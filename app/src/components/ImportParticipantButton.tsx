import { useState } from "react";
import { importParticipants } from "@/services/ParticipantAPI";
import { Upload } from "lucide-react";
import { GradientButton } from "./GradientButton";
import { showSwal } from "@/lib/SwalHelper"; // pastikan helper Swal
import { handleApiError } from "@/lib/ErrorHandler";

export default function ImportParticipantModal({
  eventId,
  onSuccess,
}: {
  eventId: string;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      await showSwal({
        title: "Perhatian",
        text: "Pilih file terlebih dahulu",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    try {
      await importParticipants(file, eventId);
      setFile(null);
      setError(null);

      // tutup modal
      const modalCheckbox = document.getElementById(
        "import_modal"
      ) as HTMLInputElement;
      if (modalCheckbox) modalCheckbox.checked = false;

      await showSwal({
        title: "Berhasil",
        text: "Peserta berhasil diimport!",
        icon: "success",
        confirmButtonText: "OK",
      });

      onSuccess(); // refetch peserta
    } catch (err: any) {
      await handleApiError(err, "Terjadi kesalahan dari sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <GradientButton
        htmlFor="import_modal"
        icon={<Upload size={20} />}
        label="Import Peserta"
      />

      {/* Modal */}
      <input type="checkbox" id="import_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold mb-4">Import Peserta dari Excel</h3>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="file-input w-full"
          />
          {error && <p className="text-error mt-2">{error}</p>}

          <div className="modal-action">
            <label htmlFor="import_modal" className="btn btn-ghost">
              Batal
            </label>
            <button
              onClick={handleUpload}
              className="btn btn-primary"
              disabled={loading || !file}
            >
              {loading ? "Mengunggah..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
