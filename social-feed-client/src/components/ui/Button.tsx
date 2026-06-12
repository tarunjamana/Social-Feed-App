import type { ButtonProps } from "../../types/ui";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  variant = "primary",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        variant === "primary"
          ? "bg-indigo-600 text-white hover:bg-indigo-700"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
      }`}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
