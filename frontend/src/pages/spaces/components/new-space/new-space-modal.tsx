import {
  Box,
  Field,
  Flex,
  Grid,
  IconButton,
  Stack,
  Text,
  Textarea,
  chakra,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { House } from "lucide-react";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../../../../components/button/button";
import { colorVariantStyles } from "../../../../components/color-variants";
import { Input } from "../../../../components/input/input";
import { Modal } from "../../../../components/modal/modal";
import type { ModalProps } from "../../../../components/modal/modal";
import { spaceColorsMock, spaceIconsMock } from "./new-space-mock";
import { useCreateSpaceMutation } from "../../../../hooks/spaces/use-create-space-mutation";
import { newSpaceSchema } from "./new-space-schema";
import type { NewSpaceValues } from "./new-space-schema";

export function NewSpaceModal({
  open,
  onOpenChange,
}: Readonly<Pick<ModalProps, "open" | "onOpenChange">>) {
  const formId = useId();
  const createSpaceMutation = useCreateSpaceMutation();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewSpaceValues>({
    resolver: yupResolver(newSpaceSchema),
    defaultValues: { name: "", description: "", imageUrl: "" },
    mode: "onTouched",
  });
  const description = useWatch({ control, name: "description" });
  const isBusy = isSubmitting || createSpaceMutation.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isBusy) return;
    if (!nextOpen) {
      reset();
      createSpaceMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const submit = (values: NewSpaceValues) => {
    if (createSpaceMutation.isPending) return;
    createSpaceMutation.mutate(
      {
        name: values.name,
        description: values.description || null,
        imageUrl: values.imageUrl || null,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Modal
      title="Novo espaço"
      size="lg"
      open={open}
      onOpenChange={handleOpenChange}
      closeDisabled={isBusy}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            w={{ base: "full", sm: "auto" }}
            px="6"
            disabled={isBusy}
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form={formId}
            w={{ base: "full", sm: "auto" }}
            px="6"
            loading={isBusy}
            loadingText="Salvando..."
          >
            Salvar espaço
          </Button>
        </>
      }
    >
      <chakra.form
        id={formId}
        noValidate
        aria-label="Cadastrar espaço"
        aria-busy={isBusy}
        display="flex"
        flexDirection="column"
        gap="5"
        pb="6"
        minW="0"
        onSubmit={(event) => {
          void handleSubmit(submit)(event);
        }}
      >
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
              Imagem do espaço
            </Text>
            <Text fontSize="xs" color="fg.muted" mt="1">
              Informe uma URL de imagem no campo ao lado.
            </Text>
          </Flex>

          <Stack gap="5" minW="0">
            <Input
              label="Nome do espaço"
              placeholder="Ex.: Minha Casa"
              required
              {...register("name")}
              errorText={errors.name?.message}
              maxLength={100}
              disabled={isBusy}
            />
            <Field.Root invalid={!!errors.description} disabled={isBusy}>
              <Field.Label fontSize="sm" fontWeight="medium" mb="1">
                Descrição (opcional)
              </Field.Label>
              <Textarea
                {...register("description")}
                maxLength={500}
                disabled={isBusy}
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
                {description.length}/500
              </Field.HelperText>
              {errors.description?.message && (
                <Field.ErrorText color="danger.700">
                  {errors.description.message}
                </Field.ErrorText>
              )}
            </Field.Root>
            <Input
              {...register("imageUrl")}
              label="URL da imagem (opcional)"
              placeholder="https://exemplo.com/imagem.jpg"
              type="url"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={1000}
              disabled={isBusy}
              errorText={errors.imageUrl?.message}
            />
          </Stack>
        </Grid>

        <Box role="group" aria-label="Sugestões de ícones">
          <Text fontSize="sm" fontWeight="semibold" color="fg.default" mb="3">
            Sugestões de ícones — em breve
          </Text>
          <Flex gap="4" wrap="wrap">
            {spaceIconsMock.map(({ label, icon: Icon, variant }, index) => (
              <IconButton
                key={label}
                type="button"
                disabled
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
            Cor do espaço — em breve
          </Text>
          <Flex gap="3" wrap="wrap">
            {spaceColorsMock.map(({ label, color }, index) => (
              <IconButton
                key={label}
                type="button"
                disabled
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
      </chakra.form>
    </Modal>
  );
}
