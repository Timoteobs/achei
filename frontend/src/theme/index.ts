import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { tokens } from "./tokens";
import { semanticTokens } from "./semantic-tokens";

const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
  },

  globalCss: {
    "*:focus-visible": {
      outline: "2px solid",
      outlineColor: "brand.focusRing",
      outlineOffset: "2px",
    },
    body: {
      bg: "bg.canvas",
      color: "fg.default",
    },

    "*::selection": {
      bg: "brand.muted",
      color: "fg.default",
    },
  },
});

export const system = createSystem(defaultConfig, config);
