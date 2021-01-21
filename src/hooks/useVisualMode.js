import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    setHistory((prev) => {
      return replace
        ? [...prev.slice(0, history.length - 1), newMode]
        : [...prev, newMode];
    });
  };

  const back = () => {
    if (history.length > 1) {
      const historyBack = [...history.slice(0, history.length - 1)];
      setMode(historyBack[historyBack.length - 1]);
      setHistory(historyBack);
    }
  };
  // instead of setMode, can just return mode as the last item in index
  return { mode, transition, back };
}
