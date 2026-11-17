import { CheckCheck } from "lucide-react";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="toast" role="status">
      <CheckCheck size={19} />
      {message}
    </div>
  );
}
