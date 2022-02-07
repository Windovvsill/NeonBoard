import { useCallback, useEffect, useState } from "react";

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const setFromEvent = useCallback(
    (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY }),
    []
  );

  const off = () => {
    console.log("Turning off mousemove ");
    window.removeEventListener("mousemove", setFromEvent);
    setPosition({ x: 0, y: 0 });
  };

  const on = () => {
    console.log("Turning on mousemove ");

    window.addEventListener("mousemove", setFromEvent);
  };

  useEffect(() => {
    on();

    return () => {
      off();
    };
  }, []);

  return { mousePosition: position, on, off };
};
