import { Field, Flex, Grid, Text, Textarea, chakra } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check } from "lucide-react";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../../../components/button/button";
import { colorVariantStyles } from "../../../../../components/color-variants";
import { Input } from "../../../../../components/input/input";
import { Modal } from "../../../../../components/modal/modal";
import type { ModalProps } from "../../../../../components/modal/modal";
import { roomColorOptions, roomIconOptions } from "./new-room-options";
import { newRoomSchema } from "./new-room-schema";
import type { NewRoomValues } from "./new-room-schema";

export function NewRoomModal({
  open,
  onOpenChange,
}: Readonly<Pick<ModalProps, "open" | "onOpenChange">>) {
  const formId = useId();
  const {
    register, control, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<NewRoomValues>({
    resolver: yupResolver(newRoomSchema),
    defaultValues: { name: "", description: "", icon: "armchair", color: "teal" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const [description, icon, color] = useWatch({ control, name: ["description", "icon", "color"] });
  const selectedIcon = roomIconOptions.find((option) => option.value === icon) ?? roomIconOptions[0];
  const PreviewIcon = selectedIcon.icon;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Novo ambiente"
      size="md"
      closeDisabled={isSubmitting}
      footer={
        <>
          <Button type="button" variant="outline" px="6" disabled={isSubmitting} onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form={formId} px="6" w={{ base: "full", sm: "auto" }} loading={isSubmitting}>
            Salvar ambiente
          </Button>
        </>
      }
    >
      <chakra.form
        id={formId}
        aria-label="Cadastrar ambiente"
        noValidate
        display="flex"
        flexDirection="column"
        gap="5"
        onSubmit={(event) => {
          void handleSubmit(() => {
            toast.info("Dados validados. O ambiente ainda não foi salvo; o cadastro estará disponível em breve.");
          })(event);
        }}
      >
        <Flex align="center" gap="4">
          <Flex boxSize="16" flexShrink="0" align="center" justify="center" borderRadius="md" {...colorVariantStyles[color]} aria-hidden="true">
            <PreviewIcon size={30} strokeWidth={1.8} />
          </Flex>
          <Text fontSize="sm" color="fg.muted">Crie um ambiente para organizar os itens deste espaço.</Text>
        </Flex>
        <Input
          label="Nome do ambiente"
          placeholder="Ex.: Sala de estar"
          required
          maxLength={100}
          {...register("name")}
          errorText={errors.name?.message}
        />
        <Field.Root invalid={!!errors.description}>
          <Field.Label fontSize="sm" fontWeight="medium" mb="1">Descrição (opcional)</Field.Label>
          <Textarea
            {...register("description")}
            placeholder="Ex.: Ambiente para guardar livros e eletrônicos."
            maxLength={500}
            minH="24"
            px="4"
            py="3"
            resize="vertical"
            borderRadius="md"
            borderColor="border.default"
            bg="bg.surface"
            color="fg.default"
            fontSize="sm"
            _placeholder={{ color: "fg.subtle" }}
            _hover={{ borderColor: "border.emphasized" }}
            _focusVisible={{ borderColor: "brand.solid", outlineColor: "brand.focusRing", outlineWidth: "2px", outlineOffset: "2px" }}
          />
          <Field.HelperText alignSelf="flex-end" color="fg.muted">{description.length}/500</Field.HelperText>
          <Field.ErrorText color="danger.700">{errors.description?.message}</Field.ErrorText>
        </Field.Root>
        <chakra.fieldset minW="0" aria-describedby={errors.icon ? `${formId}-icon-error` : undefined}>
          <chakra.legend fontSize="sm" fontWeight="semibold" color="fg.default" mb="3">Ícone do ambiente</chakra.legend>
          <Grid templateColumns="repeat(4, minmax(0, 1fr))" gap="2">
            {roomIconOptions.map(({ value, label, icon: Icon }) => (
              <chakra.label
                key={value}
                position="relative"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap="2"
                p="2"
                minH="20"
                borderRadius="md"
                borderWidth="1px"
                borderColor={icon === value ? "brand.solid" : "border.default"}
                bg={icon === value ? "brand.subtle" : "bg.surface"}
                color={icon === value ? "brand.fg" : "fg.muted"}
                _hover={{ bg: "bg.subtle" }}
                _focusWithin={{ outlineColor: "brand.focusRing", outlineWidth: "2px", outlineStyle: "solid", outlineOffset: "2px" }}
              >
                <chakra.input
                  type="radio"
                  {...register("icon")}
                  value={value}
                  position="absolute"
                  inset="0"
                  w="full"
                  h="full"
                  opacity="0"
                  cursor="pointer"
                  aria-invalid={!!errors.icon}
                />
                <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                <Text as="span" fontSize="xs" textAlign="center">{label}</Text>
              </chakra.label>
            ))}
          </Grid>
          {errors.icon && <Text id={`${formId}-icon-error`} color="danger.700" fontSize="sm" mt="2">{errors.icon.message}</Text>}
        </chakra.fieldset>
        <chakra.fieldset minW="0" aria-describedby={errors.color ? `${formId}-color-error` : undefined}>
          <chakra.legend fontSize="sm" fontWeight="semibold" color="fg.default" mb="3">Cor do ambiente</chakra.legend>
          <Flex gap="3" wrap="wrap">
            {roomColorOptions.map(({ value, label }) => (
              <chakra.label
                key={value}
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxSize="11"
                borderRadius="full"
                borderWidth="2px"
                borderColor={color === value ? "brand.solid" : "border.default"}
                {...colorVariantStyles[value]}
                _hover={{ borderColor: "brand.solid" }}
                _focusWithin={{ outlineColor: "brand.focusRing", outlineWidth: "2px", outlineStyle: "solid", outlineOffset: "2px" }}
              >
                <chakra.input
                  type="radio"
                  {...register("color")}
                  value={value}
                  aria-label={label}
                  position="absolute"
                  inset="0"
                  w="full"
                  h="full"
                  opacity="0"
                  cursor="pointer"
                  aria-invalid={!!errors.color}
                />
                {color === value && <Check size={20} aria-hidden="true" />}
              </chakra.label>
            ))}
          </Flex>
          {errors.color && <Text id={`${formId}-color-error`} color="danger.700" fontSize="sm" mt="2">{errors.color.message}</Text>}
        </chakra.fieldset>
        <Text fontSize="xs" color="fg.muted">Prévia do cadastro: os dados ainda não serão salvos.</Text>
      </chakra.form>
    </Modal>
  );
}
