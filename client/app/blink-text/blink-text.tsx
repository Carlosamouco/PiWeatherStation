import { useEffect, useRef, useState, type ReactNode } from "react";

export interface BlinkTextProps {
  value: unknown;
  children: ReactNode;
}

export default function BlinkText({ children, value }: BlinkTextProps) {
  const [blink, setBlink] = useState(false);
  const [content, setContent] = useState(children);
  const oldValueRef = useRef(value);

  useEffect(() => {
    if (oldValueRef.current === value && !blink) {
      setContent(children);
      return;
    }

    oldValueRef.current = value;
    setBlink(true);
  }, [children, value]);

  const onTransitionEnd = () => {
    setBlink(false);
    setContent(children);
  };

  return (
    <span
      className={`transition-opacity duration-300 ${
        blink ? "opacity-0" : "opacity-100"
      }`}
      onTransitionEnd={onTransitionEnd}
    >
      {content}
    </span>
  );
}
