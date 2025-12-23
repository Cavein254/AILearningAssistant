import React from "react";

const Button = ({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap";

  const variantStyles = {
    primary:
      "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/75",
    secondary: "bg-slate-500 text-slate-700 hover:bg-slate-200",
    outline:
      "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-200",
  };

  const sizeStyles = {
    sm: "px-4 h-9 text-xs",
    md: "px-6 h-11 text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
