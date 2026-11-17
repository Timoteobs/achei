import { Box, Flex, Grid, Text, chakra } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, Mail, Pencil, Send, UsersRound } from "lucide-react";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../../../../components/button/button";
import { Input } from "../../../../components/input/input";
import { Modal } from "../../../../components/modal/modal";
import type { ModalProps } from "../../../../components/modal/modal";
import { useCreateInvitationMutation } from "../../../../hooks/invitations/use-create-invitation-mutation";
import { InvitationList } from "./invitation-list";
import { inviteMembersSchema } from "./invite-members-schema";
import type { InviteMembersValues } from "./invite-members-schema";

const invitationValidityDays = 7;

const permissions = [
  {
    value: "EDITOR",
    label: "Editor",
    description: "Pode adicionar, editar, mover e excluir itens, ambientes e caixas.",
    icon: Pencil,
  },
  {
    value: "VIEWER",
    label: "Visualizador",
    description: "Pode apenas ver os itens e a organização do espaço.",
    icon: Eye,
  },
] as const;

export function InviteMembersModal({
  open,
  onOpenChange,
  spaceId,
  spaceName,
}: Readonly<Pick<ModalProps, "open" | "onOpenChange"> & { spaceId: string; spaceName: string }>) {
  const id = useId();
  const createInvitationMutation = useCreateInvitationMutation(spaceId);
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InviteMembersValues>({
    resolver: yupResolver(inviteMembersSchema),
    defaultValues: { email: "", role: "EDITOR" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const role = useWatch({ control, name: "role" });
  const isBusy = isSubmitting || createInvitationMutation.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isBusy) return;
    if (!nextOpen) {
      reset();
      createInvitationMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const submit = (values: InviteMembersValues) => {
    if (isBusy) return;
    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + invitationValidityDays);
    createInvitationMutation.mutate(
      { ...values, expiresAt: expiresAt.toISOString() },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Convidar membros"
      description={`Compartilhe o espaço “${spaceName}” com outras pessoas e organize tudo em conjunto.`}
      icon={<UsersRound size={26} strokeWidth={1.8} />}
      size="xl"
      bodyOverflow={{ base: "auto", md: "hidden" }}
      compact
      closeDisabled={isBusy}
    >
      <Grid
        templateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" }}
        gap="6"
        h={{ md: "min(480px, calc(100dvh - 180px))" }}
        minH="0"
      >
        <chakra.form
          noValidate
          aria-busy={isBusy}
          display="flex"
          flexDirection="column"
          gap="4"
          minW="0"
          minH="0"
          overflowY={{ md: "auto" }}
          overscrollBehavior="contain"
          scrollbarGutter={{ md: "stable" }}
          p="1"
          pr={{ md: "3" }}
          onSubmit={(event) => {
            void handleSubmit(submit)(event);
          }}
        >
          <Input
            label="E-mail da pessoa"
            type="email"
            autoComplete="email"
            placeholder="Ex.: maria@email.com"
            required
            disabled={isBusy}
            maxLength={255}
            h="10"
            startElement={<Mail size={17} strokeWidth={1.8} />}
            {...register("email")}
            errorText={errors.email?.message}
          />
          <chakra.fieldset disabled={isBusy} minW="0" aria-describedby={errors.role ? `${id}-role-error` : undefined}>
            <chakra.legend fontSize="sm" fontWeight="semibold" color="fg.default" mb="2">
              Permissão de acesso
            </chakra.legend>
            <Flex direction="column" gap="2">
              {permissions.map(({ value, label, description, icon: Icon }) => {
                const selected = role === value;
                return (
                  <chakra.label
                    key={value}
                    position="relative"
                    display="flex"
                    alignItems="flex-start"
                    gap="3"
                    px="3"
                    py="3"
                    borderWidth="1px"
                    borderColor={selected ? "brand.emphasized" : "border.default"}
                    borderRadius="md"
                    bg={selected ? "brand.subtle" : "bg.surface"}
                    cursor="pointer"
                    _hover={{ borderColor: selected ? "brand.solid" : "border.emphasized" }}
                    _focusWithin={{ outline: "2px solid", outlineColor: "brand.focusRing", outlineOffset: "2px" }}
                  >
                    <chakra.input
                      type="radio"
                      {...register("role")}
                      value={value}
                      position="absolute"
                      inset="0"
                      w="full"
                      h="full"
                      opacity="0"
                      cursor="pointer"
                      aria-labelledby={`${id}-${value}-label`}
                      aria-describedby={`${id}-${value}-description`}
                      aria-invalid={!!errors.role}
                    />
                    <Box
                      boxSize="4"
                      mt="1"
                      flexShrink="0"
                      borderRadius="full"
                      borderWidth={selected ? "5px" : "1px"}
                      borderColor={selected ? "brand.solid" : "fg.subtle"}
                      bg="bg.surface"
                      aria-hidden="true"
                    />
                    <Flex align="center" justify="center" boxSize="7" flexShrink="0" color={selected ? "brand.fg" : "fg.muted"} aria-hidden="true">
                      <Icon size={19} strokeWidth={1.8} />
                    </Flex>
                    <Box minW="0">
                      <Text id={`${id}-${value}-label`} fontSize="sm" fontWeight="semibold" lineHeight="short" color={selected ? "brand.fg" : "fg.default"}>
                        {label}
                      </Text>
                      <Text id={`${id}-${value}-description`} fontSize="xs" color="fg.muted" lineHeight="short" mt="1">
                        {description}
                      </Text>
                    </Box>
                  </chakra.label>
                );
              })}
            </Flex>
            {errors.role && <Text id={`${id}-role-error`} role="alert" color="danger.700" fontSize="sm" mt="2">{errors.role.message}</Text>}
          </chakra.fieldset>
          <Flex justify="flex-end" gap="2" mt="1" wrap="wrap">
            <Button type="button" variant="outline" h="10" px="5" disabled={isBusy} onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" w="auto" h="10" px="5" disabled={isBusy} loading={isBusy} loadingText="Enviando...">
              <Send size={16} strokeWidth={1.8} aria-hidden="true" />
              Enviar convite
            </Button>
          </Flex>
        </chakra.form>
        <InvitationList spaceId={spaceId} />
      </Grid>
    </Modal>
  );
}
