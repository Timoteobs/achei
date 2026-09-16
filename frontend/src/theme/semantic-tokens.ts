import { defineSemanticTokens } from "@chakra-ui/react";

export const semanticTokens = defineSemanticTokens({
  colors: {
    brand: {
      solid: {
        value: {
          base: "{colors.brand.700}",
          _dark: "{colors.brand.400}",
        },
      },

      contrast: {
        value: {
          base: "{colors.neutral.0}",
          _dark: "{colors.neutral.950}",
        },
      },

      fg: {
        value: {
          base: "{colors.brand.700}",
          _dark: "{colors.brand.300}",
        },
      },

      muted: {
        value: {
          base: "{colors.brand.100}",
          _dark: "{colors.brand.900}",
        },
      },

      subtle: {
        value: {
          base: "{colors.brand.50}",
          _dark: "{colors.brand.950}",
        },
      },

      emphasized: {
        value: {
          base: "{colors.brand.200}",
          _dark: "{colors.brand.800}",
        },
      },

      focusRing: {
        value: {
          base: "{colors.brand.500}",
          _dark: "{colors.brand.400}",
        },
      },
    },

    bg: {
      canvas: {
        value: {
          base: "{colors.neutral.50}",
          _dark: "{colors.neutral.950}",
        },
      },

      surface: {
        value: {
          base: "{colors.neutral.0}",
          _dark: "{colors.neutral.900}",
        },
      },

      subtle: {
        value: {
          base: "{colors.neutral.100}",
          _dark: "{colors.neutral.800}",
        },
      },

      elevated: {
        value: {
          base: "{colors.neutral.0}",
          _dark: "{colors.neutral.800}",
        },
      },
    },

    fg: {
      default: {
        value: {
          base: "{colors.neutral.900}",
          _dark: "{colors.neutral.50}",
        },
      },

      muted: {
        value: {
          base: "{colors.neutral.500}",
          _dark: "{colors.neutral.400}",
        },
      },

      subtle: {
        value: {
          base: "{colors.neutral.400}",
          _dark: "{colors.neutral.500}",
        },
      },

      disabled: {
        value: {
          base: "{colors.neutral.300}",
          _dark: "{colors.neutral.600}",
        },
      },
    },

    border: {
      default: {
        value: {
          base: "{colors.neutral.200}",
          _dark: "{colors.neutral.700}",
        },
      },

      subtle: {
        value: {
          base: "{colors.neutral.100}",
          _dark: "{colors.neutral.800}",
        },
      },

      emphasized: {
        value: {
          base: "{colors.neutral.300}",
          _dark: "{colors.neutral.600}",
        },
      },
    },

    status: {
      success: {
        value: {
          base: "{colors.success.500}",
          _dark: "{colors.success.500}",
        },
      },

      warning: {
        value: {
          base: "{colors.warning.500}",
          _dark: "{colors.warning.500}",
        },
      },

      danger: {
        value: {
          base: "{colors.danger.500}",
          _dark: "{colors.danger.500}",
        },
      },

      info: {
        value: {
          base: "{colors.info.500}",
          _dark: "{colors.info.500}",
        },
      },
    },
  },
});
