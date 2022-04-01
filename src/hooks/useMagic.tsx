import React, { useState } from "react";
import { Magic } from "magic-sdk";
import { MagicContext } from "../states/MagicContext";

export const useMagic = (): MagicContext => {
  const [magic, setMagic] = useState<Magic>();
  const setCurrentMagic = React.useCallback((currentMagic: Magic): void => {
    setMagic(currentMagic);
  }, []);
  return {
    magic,
    setCurrentMagic,
  };
};
