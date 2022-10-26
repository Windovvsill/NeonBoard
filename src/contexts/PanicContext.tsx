import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";

// At some point there is no point in keeping old logs
const HISTORY_MAX = 128;

const PanicContext = createContext<{
  panic: (message: unknown) => void;
  panicMessages: unknown[];
  history: unknown[];
}>({ panic: () => undefined, panicMessages: [], history: [] });

export const PanicProvider = ({ children }: PropsWithChildren) => {
  const [panicMessages, setPanicMessages] = useState<unknown[]>([]);
  const [history, setHistory] = useState<unknown[]>([]);
  const timer = useRef<NodeJS.Timer>();

  const panic = (message: unknown) => {
    // Let the console have to error too, so that callers don't
    // have to worry about logging it themselves
    console.error(message);

    setPanicMessages((m) => [...m, message]);
    timer.current = setTimeout(
      () => setPanicMessages((m) => m.slice(0, -1)),
      Math.min(10 * 1000, 5500 * (panicMessages.length + 1))
    );

    setHistory((h) => [...h, message].slice(0, HISTORY_MAX));
  };

  return (
    <PanicContext.Provider value={{ panic, panicMessages, history }}>
      {children}
    </PanicContext.Provider>
  );
};

export const usePanicContext = () => {
  const context = useContext(PanicContext);

  return context;
};
