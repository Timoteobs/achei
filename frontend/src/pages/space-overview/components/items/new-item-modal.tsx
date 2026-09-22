import {
  Box,
  Field,
  Flex,
  Grid,
  Image,
  NativeSelect,
  Stack,
  Text,
  Textarea,
  chakra,
} from "@chakra-ui/react";
import {
  ChevronRight,
  FileText,
  House,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "../../../../components/button/button";
import { Input } from "../../../../components/input/input";
import { Modal } from "../../../../components/modal/modal";
import { categoryOptionsMock, newItemMock, photosMock } from "./new-item-mock";

export function NewItemModal({
  open,
  onOpenChange,
}: Readonly<Pick<ComponentProps<typeof Modal>, "open" | "onOpenChange">>) {
  const { name, category, description, location } = newItemMock;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Novo item"
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            w={{ base: "full", sm: "auto" }}
            h="12"
            px="6"
            bg="bg.subtle"
            color="fg.muted"
            borderRadius="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            w={{ base: "full", sm: "40" }}
            h="12"
            px="6"
            borderRadius="sm"
          >
            Salvar item
          </Button>
        </>
      }
    >
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(0, 1fr) minmax(0, 2fr)",
        }}
        gap="6"
      >
        <Stack gap="3" minW="0">
          <chakra.button
            type="button"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            w="full"
            minH={{ base: "40", md: "64" }}
            p="4"
            textAlign="center"
            bg="bg.subtle"
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="border.default"
            borderRadius="sm"
            _hover={{ borderColor: "brand.solid" }}
          >
            <Flex
              boxSize="12"
              align="center"
              justify="center"
              borderRadius="full"
              bg="brand.subtle"
              color="brand.fg"
              mb="3"
              aria-hidden="true"
            >
              <ImageIcon size={28} strokeWidth={1.6} />
            </Flex>
            <Text fontSize="sm" fontWeight="medium" color="fg.muted">
              Adicionar foto
            </Text>
            <Text fontSize="xs" color="fg.muted" mt="1">
              ou arraste uma imagem aqui
            </Text>
          </chakra.button>

          <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap="2">
            {photosMock.map(({ label, src }) => (
              <Image
                key={label}
                src={src}
                alt={label}
                w="full"
                aspectRatio="square"
                objectFit="cover"
                bg="bg.subtle"
                borderRadius="sm"
                borderWidth="1px"
                borderColor="border.default"
              />
            ))}
            <chakra.button
              type="button"
              display="flex"
              w="full"
              aspectRatio="square"
              alignItems="center"
              justifyContent="center"
              bg="bg.surface"
              color="fg.muted"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="sm"
              _hover={{ bg: "bg.subtle" }}
              aria-label="Adicionar outra foto"
            >
              <Plus size={28} strokeWidth={1.8} aria-hidden="true" />
            </chakra.button>
          </Grid>
        </Stack>

        <Stack gap="4" minW="0">
          <Input
            label="Nome do item"
            required
            defaultValue={name}
            borderRadius="sm"
          />

          <Field.Root>
            <Field.Label fontSize="sm" fontWeight="medium" mb="1">
              Categoria
            </Field.Label>
            <Box position="relative" w="full">
              <Box
                position="absolute"
                left="4"
                top="50%"
                transform="translateY(-50%)"
                color="fg.muted"
                pointerEvents="none"
                zIndex="1"
                aria-hidden="true"
              >
                <FileText size={18} strokeWidth={1.8} />
              </Box>
              <NativeSelect.Root>
                <NativeSelect.Field
                  defaultValue={category}
                  ps="11"
                  h="48px"
                  borderRadius="sm"
                  borderColor="border.default"
                  bg="bg.surface"
                  fontSize="sm"
                  color="fg.default"
                  _hover={{ borderColor: "border.emphasized" }}
                  _focusVisible={{
                    borderColor: "brand.solid",
                    outlineColor: "brand.focusRing",
                    outlineWidth: "2px",
                    outlineOffset: "2px",
                  }}
                >
                  {categoryOptionsMock.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator color="fg.muted" />
              </NativeSelect.Root>
            </Box>
          </Field.Root>

          <Field.Root>
            <Field.Label fontSize="sm" fontWeight="medium" mb="1">
              Descrição (opcional)
            </Field.Label>
            <Textarea
              defaultValue={description}
              minH="20"
              borderRadius="sm"
              px="3"
              py="3"
              resize="vertical"
              borderColor="border.default"
              bg="bg.surface"
              fontSize="sm"
              color="fg.default"
              _hover={{ borderColor: "border.emphasized" }}
              _focusVisible={{
                borderColor: "brand.solid",
                outlineColor: "brand.focusRing",
                outlineWidth: "2px",
                outlineOffset: "2px",
              }}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label fontSize="sm" fontWeight="medium" mb="1">
              Local onde está guardado
              <Field.RequiredIndicator color="danger.500" ms="1" />
            </Field.Label>
            <Flex
              align="center"
              justify="space-between"
              gap="3"
              flexWrap="wrap"
              w="full"
              minH="12"
              bg="bg.subtle"
              borderRadius="sm"
              px="3"
              py="1.5"
            >
              <Flex
                align="center"
                gap="1.5"
                flexWrap="wrap"
                color="fg.muted"
                fontSize="sm"
                minW="0"
              >
                <Box color="fg.muted" flexShrink="0" aria-hidden="true">
                  <House size={16} strokeWidth={1.8} />
                </Box>
                <Text as="span" fontWeight="medium">
                  {location.space}
                </Text>
                <Box color="fg.subtle" flexShrink="0" aria-hidden="true">
                  <ChevronRight size={14} strokeWidth={1.8} />
                </Box>
                <Text as="span">{location.room}</Text>
                <Box color="fg.subtle" flexShrink="0" aria-hidden="true">
                  <ChevronRight size={14} strokeWidth={1.8} />
                </Box>
                <Text as="span">{location.box}</Text>
              </Flex>
              <Button type="button" variant="link" flexShrink="0">
                Alterar
              </Button>
            </Flex>
          </Field.Root>
        </Stack>
      </Grid>
    </Modal>
  );
}
