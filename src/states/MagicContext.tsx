import React from "react";
import { Magic } from 'magic-sdk';

export interface MagicContext {
  magic?: Magic;
  setCurrentMagic: (newMagic: Magic) => void;
}

const MAGIC_DEFAULT_VALUE = {
  setCurrentMagic: () => {},
}

const magicContext = React.createContext<MagicContext>(MAGIC_DEFAULT_VALUE);

export default magicContext;