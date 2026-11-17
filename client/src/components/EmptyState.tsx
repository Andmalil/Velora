import type { ReactNode } from "react";
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
