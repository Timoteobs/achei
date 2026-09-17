import { ChakraProvider } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { system } from "../../theme";

export function Provider({ children }: Readonly<PropsWithChildren>) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
