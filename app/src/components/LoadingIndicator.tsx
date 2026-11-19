export function LoadingIndicator({
  text = "Memuat Data",
  fullscreen = false,
}: {
  text?: string;
  fullscreen?: boolean;
}) {
  const base = "flex flex-col items-center justify-center bg-base-100/60";
  const style = fullscreen
    ? `${base} fixed inset-0 z-50`
    : `${base} w-full h-full py-20`;

  return (
    <div className={style}>
      <span className="loading loading-dots loading-lg mb-2"></span>
      <span className="text-sm font-medium opacity-80">{text}</span>
    </div>
  );
}
