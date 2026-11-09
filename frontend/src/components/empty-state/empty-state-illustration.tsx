import { chakra } from "@chakra-ui/react";

export function EmptyStateIllustration() {
  return (
    <chakra.svg
      viewBox="0 0 280 240"
      w={{ base: "44", md: "56" }}
      h="auto"
      flexShrink="0"
      aria-hidden="true"
      focusable="false"
    >
      <chakra.path
        d="M139 10C190 7 233 49 255 96C280 150 259 198 212 218C164 240 96 238 49 209C5 182 2 136 27 98C57 54 86 14 139 10Z"
        fill="brand.subtle"
        opacity="0.8"
      />
      <chakra.g
        fill="none"
        stroke="brand.300"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M140 51V67M106 61L115 74M174 61L165 74" />
        <chakra.path d="M83 108L140 89L197 108L140 127Z" fill="bg.surface" />
        <chakra.path d="M83 119V175Q83 181 89 183L140 201L191 183Q197 181 197 175V119L140 138Z" fill="bg.surface" />
        <chakra.path d="M101 120L140 110L179 120L140 138Z" fill="brand.200" stroke="none" />
        <path d="M140 128V201" />
        <chakra.path d="M83 108L140 127L124 151Q123 154 119 153L73 138Q69 137 72 132Z" fill="bg.surface" />
        <chakra.path d="M197 108L140 127L156 151Q157 154 161 153L207 138Q211 137 208 132Z" fill="bg.surface" />
      </chakra.g>
    </chakra.svg>
  );
}
