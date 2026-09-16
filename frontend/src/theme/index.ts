import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { tokens } from "./tokens";
import { semanticTokens } from "./semantic-tokens";

const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
  },

  globalCss: {
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
