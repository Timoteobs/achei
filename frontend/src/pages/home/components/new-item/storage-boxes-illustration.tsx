import { chakra } from "@chakra-ui/react";

export function StorageBoxesIllustration() {
  return (
    <chakra.svg viewBox="0 0 160 100" w={{ base: "120px", md: "136px" }} h="84px" flexShrink="0" aria-hidden="true" focusable="false">
      <chakra.g stroke="brand.fg" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M80 5V17M59 13L66 20M102 13L95 20" />
      </chakra.g>
      <chakra.path d="M48 39L81 32L116 39L81 51Z" fill="illustration.cardboard.dark" />
      <chakra.path d="M48 39L81 49V93L48 89Z" fill="illustration.cardboard.medium" />
      <chakra.path d="M81 49L116 39V89L81 93Z" fill="illustration.cardboard.dark" />
      <chakra.path d="M48 39L40 31L80 33L81 49Z" fill="illustration.cardboard.light" />
      <chakra.path d="M81 49L80 33L120 32L116 39Z" fill="illustration.cardboard.medium" />
      <chakra.path d="M48 39L81 49L70 54L38 43Z" fill="illustration.cardboard.medium" />
      <chakra.path d="M81 49L116 39L122 44L91 54Z" fill="illustration.cardboard.light" />
      <chakra.rect x="18" y="52" width="43" height="40" rx="2" fill="illustration.cardboard.light" />
      <chakra.path d="M18 52H61L57 48H23Z" fill="illustration.cardboard.medium" opacity="0.65" />
      <chakra.rect x="36" y="52" width="6" height="11" fill="illustration.cardboard.tape" />
      <chakra.path d="M27 52V47" stroke="illustration.cardboard.medium" strokeWidth="4" strokeLinecap="round" />
      <chakra.rect x="101" y="57" width="42" height="35" rx="2" fill="illustration.cardboard.medium" />
      <chakra.path d="M101 57H143L139 53H106Z" fill="illustration.cardboard.light" />
      <chakra.rect x="117" y="57" width="7" height="10" fill="illustration.cardboard.tape" />
    </chakra.svg>
  );
}
