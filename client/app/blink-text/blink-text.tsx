import { useEffect, useRef, useState, type ReactNode } from "react";

export interface BlinkTextProps {
  value: ReactNode;
}

export default function BlinkText({ children }: { children: ReactNode }) {
  const [blink, setBlink] = useState(false);
  const prevValueRef = useRef<ReactNode>(children);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    setBlink(true);

    const timeout = setTimeout(() => {
      setBlink(false);
      prevValueRef.current = children;
    }, 350);

    return () => clearTimeout(timeout);
  }, [children]);

  return (
    <span
      className={`transition-opacity duration-350 ${
        blink ? "opacity-0" : "opacity-100"
      }`}
    >
      {prevValueRef.current ?? "--"}
    </span>
  );
}
