interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({
  children,
  className = "",
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

export const CardTitle: React.FC<CardProps> = ({
  children,
  className = "",
}) => (
  <h3 className={`text-sm font-medium text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<CardProps> = ({
  children,
  className = "",
}) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;

export const CardContent: React.FC<CardProps> = ({
  children,
  className = "",
}) => <div className={`px-6 pb-4 ${className}`}>{children}</div>;
