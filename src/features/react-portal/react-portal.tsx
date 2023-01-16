import React, { useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export const ReactPortal = (props: {
  children: React.ReactNode;
  wrapperId: string;
}) => {
  const { children, wrapperId } = props;
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null
  );

  // Runs synchrounosly before the DOM is repainted
  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);

    setWrapperElement(element);
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};

export default ReactPortal;
