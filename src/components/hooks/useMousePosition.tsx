import { useCallback, useEffect, useState } from "react";

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const setFromEvent = useCallback(
    (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY }),
    []
  );

  const off = () => window.removeEventListener("mousemove", setFromEvent);

  const on = () => window.addEventListener("mousemove", setFromEvent);

  useEffect(() => {
    on();

    return () => {
      off();
    };
  }, []);

  return { mousePosition: position, on, off };
};
