import { useCallback, useState } from "react";

export const useMouseGlow = () => {
  const [style, setStyle] = useState({});

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStyle({
      "--mouse-x": `${x}px`,
      "--mouse-y": `${y}px`,
      "--spotlight-opacity": "1",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyle({ "--spotlight-opacity": "0" });
  }, []);

  return { handleMouseMove, handleMouseLeave, style };
};