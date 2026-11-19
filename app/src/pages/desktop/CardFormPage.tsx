import {
  X,
  Save,
  Plus,
  Edit,
  Gift,
  Video,
  Image,
  SlidersHorizontal,
  Pen,
  Puzzle,
  AudioLines,
  Info,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePageHeader } from "@/context/PageHeaderContext";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useCardForm } from "@/hooks/use-card-form";
import { getEventDetail, type EventItem } from "@/services/eventAPI";

export default function CardFormPage() {
  const { eventId, cardId } = useParams();
  const { setHeader } = usePageHeader();
  const { card, setCard, loading, saving, isEdit, handleSubmit } = useCardForm(
    eventId,
    cardId
  );
  const [event, setEvent] = useState<EventItem | null>(null);
  const [, setLoadingEvent] = useState(true);
  const [, setErrorEvent] = useState<string | null>(null);
  // ambil data event
  useEffect(() => {
    if (!eventId) return;
    getEventDetail(eventId)
      .then((data) => setEvent(data))
      .catch(() => setErrorEvent("Gagal memuat data event"))
      .finally(() => setLoadingEvent(false));
  }, [eventId]);

  useEffect(() => {
    setHeader({
      breadcrumb: [
        { label: "Dashboard", path: "/" },
        { label: event?.name || "Event", path: `events/detail/${eventId}` },
        { label: isEdit ? "Edit Card" : "Buat Card", path: "" },
      ],
      icon: isEdit ? Edit : Plus,
      title: isEdit ? "Edit Card" : "Buat Card",
      description: isEdit
        ? "Ubah detail card event"
        : "Buat card baru untuk event ini",
    });
  }, [setHeader, isEdit, eventId, event]);

  if (loading) return <LoadingIndicator />;

  // Render dynamic settings
  const renderSettingsFields = () => {
    const s = card.settings || {};
    switch (card.type) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-semibold flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                URL Video
              </label>
              <input
                type="text"
                value={s.url || ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    settings: { ...s, url: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
                placeholder="Masukkan URL video"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Upload File MP4
              </label>
              <input
                id="file"
                type="file"
                accept="video/mp4"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCard({
                      ...card,
                      settings: { ...s, file },
                    });
                  }
                }}
                className="
                        w-full
                        text-sm text-base-content
                        border border-base-300
                        rounded-xl
                        bg-base-50
                        px-4 py-3
                        focus:outline-none
                        focus:ring-2 focus:ring-primary/50
                        focus:border-primary
                        transition-all
                        file:mr-4
                        file:py-2
                        file:px-4
                        file:rounded-lg
                        file:border-0
                        file:font-semibold
                        file:bg-primary
                        file:text-white
                        hover:file:bg-primary/80
                        cursor-pointer
                      "
              />

              {/* Preview jika sudah pilih file */}
              {s.file && (
                <video
                  controls
                  src={URL.createObjectURL(s.file)}
                  className="mt-2 w-fit max-h-50 rounded-xl border border-base-300 object-contain"
                />
              )}
            </div>
          </div>
        );

      case "idle":
        const inputMode = (s as any)?.input_mode || "none";

        return (
          <div className="space-y-8">
            {/* Pilih Mode Input */}
            <div className="flex items-center gap-4">
              <label className="font-semibold text-base">
                Pilih sumber input:
              </label>
              <select
                value={inputMode}
                onChange={(e) => {
                  const mode = e.target.value as "none" | "url" | "file";

                  // Reset sesuai mode
                  let newSettings = { ...s, input_mode: mode };

                  if (mode === "url") {
                    newSettings = {
                      ...newSettings,
                      picture_file: undefined,
                      sound_file: undefined,
                      video_file: undefined,
                    };
                  }

                  if (mode === "file") {
                    newSettings = {
                      ...newSettings,
                      picture_url: "",
                      sound_url: "",
                      video_url: "",
                    };
                  }

                  setCard({
                    ...card,
                    settings: newSettings,
                  });
                }}
                className="px-4 py-2 border border-base-300 rounded-lg bg-base-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="none">Pilih Mode</option>
                <option value="url">Gunakan URL</option>
                <option value="file">Upload File</option>
              </select>
            </div>

            {/* Input URL */}
            {inputMode === "url" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: "picture_url", label: "URL Gambar", icon: Image },
                  { key: "sound_url", label: "URL Suara", icon: AudioLines },
                  { key: "video_url", label: "URL Video", icon: Video },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <label className="font-semibold flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      {label}
                    </label>
                    <input
                      type="text"
                      value={(s as any)[key] || ""}
                      onChange={(e) =>
                        setCard({
                          ...card,
                          settings: { ...s, [key]: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
                      placeholder={`Masukkan ${label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Upload File */}
            {inputMode === "file" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    key: "picture_file",
                    label: "Upload Gambar",
                    accept: "image/*",
                    preview: "image",
                  },
                  {
                    key: "sound_file",
                    label: "Upload Suara",
                    accept: "audio/*",
                    preview: "audio",
                  },
                  {
                    key: "video_file",
                    label: "Upload Video",
                    accept: "video/*",
                    preview: "video",
                  },
                ].map(({ key, label, accept, preview }) => (
                  <div key={key} className="space-y-2">
                    <label className="font-semibold flex items-center gap-2">
                      <Pen className="w-5 h-5 text-primary" />
                      {label}
                    </label>
                    <input
                      type="file"
                      accept={accept}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCard({
                            ...card,
                            settings: { ...s, [key]: file },
                          });
                        }
                      }}
                      className="
                        w-full
                        text-sm text-base-content
                        border border-base-300
                        rounded-xl
                        bg-base-50
                        px-4 py-3
                        focus:outline-none
                        focus:ring-2 focus:ring-primary/50
                        focus:border-primary
                        transition-all
                        file:mr-4
                        file:py-2
                        file:px-4
                        file:rounded-lg
                        file:border-0
                        file:font-semibold
                        file:bg-primary
                        file:text-white
                        hover:file:bg-primary/80
                        cursor-pointer
                      "
                    />

                    {/* Preview */}
                    {(s as any)[key] && (
                      <>
                        {preview === "image" && (
                          <img
                            src={URL.createObjectURL((s as any)[key])}
                            alt="preview"
                            className="mt-2 w-full max-h-40 object-contain rounded-lg border border-base-300"
                          />
                        )}
                        {preview === "audio" && (
                          <audio
                            controls
                            src={URL.createObjectURL((s as any)[key])}
                            className="mt-2 w-full"
                          />
                        )}
                        {preview === "video" && (
                          <video
                            controls
                            src={URL.createObjectURL((s as any)[key])}
                            className="mt-2 w-full max-h-48 rounded-lg border border-base-300 object-contain"
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "slideshow":
        return (
          <div className="space-y-3">
            <label className="font-semibold flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              URL Slideshow <span className="text-error">*</span>
            </label>

            <input
              type="text"
              value={s.slideshow_url || ""}
              onChange={(e) => {
                const inputUrl = e.target.value.trim();
                let newUrl = inputUrl;

                if (inputUrl.includes("canva.com/design")) {
                  // pastikan selalu ?embed
                  if (inputUrl.endsWith("/view")) {
                    newUrl = `${inputUrl}?embed`;
                  } else if (!inputUrl.includes("?embed")) {
                    newUrl = inputUrl.replace(/\/view.*/, "/view?embed");
                  }
                } else if (inputUrl.includes("docs.google.com/presentation")) {
                  if (inputUrl.includes("/pub")) {
                    const base = inputUrl.split("/pub")[0];
                    newUrl = `${base}/pubembed?`;
                  } else if (inputUrl.includes("/d/e/")) {
                    const match = inputUrl.match(/\/d\/e\/([^/]+)/);
                    const id = match ? match[1] : null;
                    if (id)
                      newUrl = `https://docs.google.com/presentation/d/e/${id}/pubembed?`;
                  } else {
                    const match = inputUrl.match(/\/d\/([^/]+)/);
                    const id = match ? match[1] : null;
                    if (id)
                      newUrl = `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000`;
                  }
                }

                setCard({
                  ...card,
                  settings: { ...s, slideshow_url: newUrl },
                });
              }}
              className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
              placeholder="Tempel URL dari Canva atau Google Slides"
            />

            {/* Info block */}
            {s.slideshow_url && (
              <div className="p-3 bg-base-200 rounded-lg border border-base-300 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm text-base-content/80">
                  {s.slideshow_url.includes("canva.com") ? (
                    <>
                      Terdeteksi <strong>Canva</strong>. Pastikan desain
                      bersifat publik.
                      <br />
                      Embed URL:
                      <code className="block text-xs bg-base-300 px-2 py-1 mt-1 rounded break-all">
                        {s.slideshow_url}
                      </code>
                    </>
                  ) : s.slideshow_url.includes("docs.google.com") ? (
                    <>
                      Terdeteksi <strong>Google Slides</strong>. Pastikan link
                      dibagikan ke publik.
                      <br />
                      Embed URL:
                      <code className="block text-xs bg-base-300 px-2 py-1 mt-1 rounded break-all">
                        {s.slideshow_url}
                      </code>
                    </>
                  ) : (
                    "URL tidak dikenali. Harap masukkan link Canva atau Google Slides."
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case "lucky_draw":
        return (
          <>
            <div className="space-y-2">
              <label className="font-semibold flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Nama Hadiah <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={s.prize_name || ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    settings: { ...s, prize_name: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
                placeholder="Masukkan nama hadiah"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-primary" />
                Jumlah Hadiah <span className="text-error">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={s.prize_quantity || ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    settings: {
                      ...s,
                      prize_quantity: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
                placeholder="Masukkan jumlah hadiah"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-base-200  overflow-hidden space-y-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-base font-semibold text-base-content">
          <Pen className="w-5 h-5 text-primary" />
          <span>Judul Card</span>
          <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={card.title}
          onChange={(e) => setCard({ ...card, title: e.target.value })}
          className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
          placeholder="Masukkan judul card"
        />
      </div>

      {/* Type Dropdown */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-base font-semibold text-base-content">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <span>Tipe Card</span>
          <span className="text-error">*</span>
        </label>
        <select
          value={card.type}
          onChange={(e) =>
            setCard({
              ...card,
              type: e.target.value,
              settings: {},
            })
          }
          className="select select-bordered w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content text-base"
        >
          <option value="">Pilih tipe card</option>
          <option value="video">Video</option>
          <option value="idle">Idle</option>
          <option value="slideshow">Slideshow</option>
          <option value="lucky_draw">Lucky Draw</option>
        </select>
      </div>

      {card.type && (
        <div className="border-t border-primary/60 pt-4 space-y-4">
          {renderSettingsFields()}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-content px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <X className="w-5 h-5" />
          <span>Batal</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-content px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          {saving ? (
            <span>Menyimpan...</span>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{isEdit ? "Simpan Perubahan" : "Simpan"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
// case "idle":
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {[
//           { key: "picture_url", label: "URL Gambar", icon: Image },
//           { key: "sound_url", label: "URL Suara", icon: AudioLines },
//           { key: "video_url", label: "URL Video", icon: Video },
//         ].map(({ key, label, icon: Icon }) => (
//           <div key={key} className="space-y-2">
//             <label className="font-semibold flex items-center gap-2">
//               <Icon className="w-5 h-5 text-primary" />
//               {label}
//             </label>
//             <input
//               type="text"
//               value={(s as any)[key] || ""}
//               onChange={(e) =>
//                 setCard({
//                   ...card,
//                   settings: { ...s, [key]: e.target.value },
//                 })
//               }
//               className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
//               placeholder={`Masukkan ${label.toLowerCase()}`}
//             />
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {[
//           {
//             key: "picture_file",
//             label: "Upload Gambar",
//             accept: "image/*",
//             preview: "image",
//           },
//           {
//             key: "sound_file",
//             label: "Upload Suara",
//             accept: "audio/*",
//             preview: "audio",
//           },
//           {
//             key: "video_file",
//             label: "Upload Video",
//             accept: "video/*",
//             preview: "video",
//           },
//         ].map(({ key, label, accept, preview }) => (
//           <div key={key} className="space-y-2">
//             <label className="font-semibold flex items-center gap-2">
//               <Pen className="w-5 h-5 text-primary" />
//               {label}
//             </label>
//             <input
//               type="file"
//               accept={accept}
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) {
//                   setCard({
//                     ...card,
//                     settings: { ...s, [key]: file },
//                   });
//                 }
//               }}
//               className="block w-full text-sm text-base-content file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80 cursor-pointer"
//             />

//             {/* --- Preview --- */}
//             {(s as any)[key] && (
//               <>
//                 {preview === "image" && (
//                   <img
//                     src={URL.createObjectURL((s as any)[key])}
//                     alt="preview"
//                     className="mt-2 w-full max-h-40 object-contain rounded-lg border border-base-300"
//                   />
//                 )}
//                 {preview === "audio" && (
//                   <audio
//                     controls
//                     src={URL.createObjectURL((s as any)[key])}
//                     className="mt-2 w-full"
//                   />
//                 )}
//                 {preview === "video" && (
//                   <video
//                     controls
//                     src={URL.createObjectURL((s as any)[key])}
//                     className="mt-2 w-full max-h-48 rounded-lg border border-base-300 object-contain"
//                   />
//                 )}
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
