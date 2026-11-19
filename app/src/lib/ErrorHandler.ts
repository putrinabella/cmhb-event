import { showSwal } from "./SwalHelper";
export async function handleApiError(
  err: any,
  fallbackMessage = "Terjadi kesalahan yang tidak diketahui."
) {
  let message = fallbackMessage;

  try {
    const data = err.response?.data || err;

    if (data?.errors && typeof data.errors === "object") {
      const errorMessages = Object.values(data.errors).flat().join("\n");
      if (errorMessages) {
        message = errorMessages;
      }
    } else if (data?.meta?.message) {
      message = data.meta.message;
    } else if (data?.message) {
      message = data.message;
    }
  } catch {}

  await showSwal({
    title: "Gagal",
    text: message,
    icon: "error",
    confirmButtonText: "OK",
  });
}
