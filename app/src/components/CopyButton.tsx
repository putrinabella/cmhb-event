import { handleApiError } from "@/lib/ErrorHandler";
import { Check, Copy } from "lucide-react";
import { useState, type ComponentType } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  icon?: ComponentType<{ className?: string }>;
  iconOnly?: boolean;
}

export function CopyButton({
  text,
  label = "Copy",
  className = "",
  icon: Icon = Copy,
  iconOnly = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan dari sistem");
    }
  };

  return (
    <div className="tooltip" data-tip={copied ? "Copied!" : "Copy"}>
      <button
        onClick={handleCopy}
        className={`btn btn-xs bg-primary/10 text-base-content border-0 hover:bg-primary/20 flex items-center gap-1 ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            {!iconOnly && "Copied"}
          </>
        ) : (
          <>
            <Icon className="w-4 h-4" />
            {!iconOnly && label}
          </>
        )}
      </button>
    </div>
  );
}
