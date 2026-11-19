import React from "react";

type GradientButtonProps = {
  icon?: React.ReactNode;
  label?: string | null;
  onClick?: () => void;
  htmlFor?: string;
  type?: "button" | "submit" | "reset";
};

export function GradientButton({
  icon,
  label,
  onClick,
  htmlFor,
  type = "button",
}: GradientButtonProps) {
  const className =
    "flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-content px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105";

  // kalau ada htmlFor, render label
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={className}>
        {icon && <span className="flex">{icon}</span>}
        {label || ""}
      </label>
    );
  }

  // default render button
  return (
    <button type={type} onClick={onClick} className={className}>
      {icon && <span className="flex">{icon}</span>}
      {label || ""}
    </button>
  );
}
