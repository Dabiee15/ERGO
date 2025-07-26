// Custom Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary";
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
  onClick,
}) => {
  const baseClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-green-100 text-green-800 hover:bg-green-200",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
