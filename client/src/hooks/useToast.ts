import { useEffect, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2600);
    return () => clearTimeout(timer);
  }, [message]);
  return { message, show: setMessage };
}
