import { Box } from "@chakra-ui/react";
import { HomeHeader } from "./components/home-header";

export function HomePage() {
  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      bg="bg.canvas"
      px={{ base: "5", md: "6", lg: "8" }}
      py={{ base: "6", lg: "8" }}
    >
      <HomeHeader />
    </Box>
  );
}
