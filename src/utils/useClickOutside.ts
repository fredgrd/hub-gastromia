import React, { useEffect } from "react";

const useClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  onClick: () => void
) => {
  useEffect(() => {
    // Bind the event listener
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick();
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [ref]);
};

export default useClickOutside;
