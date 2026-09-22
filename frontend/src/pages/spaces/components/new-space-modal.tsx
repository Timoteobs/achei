import {
  Box,
  Field,
  Flex,
  Grid,
  IconButton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { House } from "lucide-react";
import { Button } from "../../../components/button/button";
import { colorVariantStyles } from "../../../components/color-variants";
import { Input } from "../../../components/input/input";
import { Modal } from "../../../components/modal/modal";
import type { ModalProps } from "../../../components/modal/modal";
import { spaceColorsMock, spaceIconsMock } from "./new-space-mock";

export function NewSpaceModal({
  open,
  onOpenChange,
}: Readonly<Pick<ModalProps, "open" | "onOpenChange">>) {
  return (
    <Modal
      title="Novo espaço"
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            w={{ base: "full", sm: "auto" }}
            px="6"
          >
            Cancelar
          </Button>
          <Button type="button" w={{ base: "full", sm: "auto" }} px="6">
            Salvar espaço
          </Button>
        </>
      }
    >
      <Stack gap="5" pb="6" minW="0">
        <Grid
          templateColumns={{
            base: "minmax(0, 1fr)",
            md: "minmax(0, 0.36fr) minmax(0, 0.64fr)",
          }}
          gap="5"
          alignItems="start"
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH={{ base: "44", md: "56" }}
            aspectRatio={{ base: "auto", md: "1.08" }}
            p="5"
            bg="brand.subtle"
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="brand.200"
            borderRadius="md"
            textAlign="center"
          >
            <Box color="brand.fg" mb="4" aria-hidden="true">
              <House size={44} strokeWidth={1.7} />
            </Box>
            <Text fontSize="sm" color="fg.muted">
              Adicionar imagem
            </Text>
            <Text fontSize="xs" color="fg.muted" mt="1">
              ou arraste uma imagem aqui
            </Text>
          </Flex>

          <Stack gap="5" minW="0">
            <Input
              label="Nome do espaço"
              placeholder="Ex.: Minha Casa"
              required
            />
            <Field.Root>
              <Field.Label fontSize="sm" fontWeight="medium" mb="1">
                Descrição (opcional)
              </Field.Label>
              <Textarea
                placeholder="Ex.: Espaço para organizar os itens da casa."
                minH="24"
                px="4"
                py="3"
                resize="vertical"
                borderRadius="md"
                borderColor="border.default"
                bg="bg.surface"
                fontSize="sm"
                color="fg.default"
                _placeholder={{ color: "fg.subtle" }}
                _hover={{ borderColor: "border.emphasized" }}
                _focusVisible={{
                  borderColor: "brand.solid",
                  outlineColor: "brand.focusRing",
                  outlineWidth: "2px",
                  outlineOffset: "2px",
                }}
              />
              <Field.HelperText
                alignSelf="flex-end"
                color="fg.muted"
                fontSize="sm"
              >
                0/200
              </Field.HelperText>
            </Field.Root>
          </Stack>
        </Grid>

        <Box role="group" aria-label="Sugestões de ícones">
          <Text fontSize="sm" fontWeight="semibold" color="fg.default" mb="3">
            Sugestões de ícones
          </Text>
          <Flex gap="4" wrap="wrap">
            {spaceIconsMock.map(({ label, icon: Icon, variant }, index) => (
              <IconButton
                key={label}
                type="button"
                aria-label={label}
                aria-pressed={index === 0}
                variant="plain"
                boxSize="16"
                borderRadius="md"
                {...colorVariantStyles[variant]}
                borderWidth="1px"
                borderColor={index === 0 ? "brand.solid" : "transparent"}
              >
                <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
              </IconButton>
            ))}
          </Flex>
        </Box>

        <Box role="group" aria-label="Cor do espaço">
          <Text fontSize="sm" fontWeight="semibold" color="fg.default" mb="3">
            Cor do espaço
          </Text>
          <Flex gap="3" wrap="wrap">
            {spaceColorsMock.map(({ label, color }, index) => (
              <IconButton
                key={label}
                type="button"
                aria-label={label}
                aria-pressed={index === 0}
                variant="plain"
                boxSize="11"
                borderRadius="full"
                borderWidth="2px"
                borderColor={index === 0 ? "brand.solid" : "transparent"}
              >
                <Box
                  boxSize="8"
                  borderRadius="full"
                  bg={color}
                  aria-hidden="true"
                />
              </IconButton>
            ))}
          </Flex>
        </Box>
      </Stack>
    </Modal>
  );
}
