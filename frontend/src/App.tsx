import { Box, Button } from "@chakra-ui/react";

function App() {
  return (
    <div>
      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        boxShadow="sm"
        p="4"
      >
        <Button bg="brand.solid" color="brand.contrast" borderRadius="md">
          Novo espaço
        </Button>
      </Box>
    </div>
  );
}

export default App;
