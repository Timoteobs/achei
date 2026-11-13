import { Field, Flex, NativeSelect, Text, Textarea, chakra } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../../../../../components/button/button";
import { Input } from "../../../../../components/input/input";
import { Modal } from "../../../../../components/modal/modal";
import type { ModalProps } from "../../../../../components/modal/modal";
import { useRoomsQuery } from "../../../../../hooks/rooms/use-rooms-query";
import { useCreateBoxMutation } from "../../../../../hooks/boxes/use-create-box-mutation";
import { useUpdateBoxMutation } from "../../../../../hooks/boxes/use-update-box-mutation";
import type { BoxResponse } from "../../../../../services/boxes";
import { newBoxSchema } from "./new-box-schema";
import type { NewBoxValues } from "./new-box-schema";

export function NewBoxModal({ open, onOpenChange, initialRoomId, box, spaceId: providedSpaceId, onCreated, onRoomsClick }: Readonly<
  Pick<ModalProps, "open" | "onOpenChange"> & { initialRoomId: number; box?: BoxResponse; spaceId?: string; onCreated?: (box: BoxResponse) => void; onRoomsClick?: () => void }
>) {
  const formId = useId();
  const { spaceId: routeSpaceId } = useParams({ strict: false });
  const spaceId = providedSpaceId ?? routeSpaceId ?? "";
  const roomsQuery = useRoomsQuery(spaceId);
  const createMutation = useCreateBoxMutation(spaceId);
  const updateMutation = useUpdateBoxMutation(spaceId);
  const { register, control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<NewBoxValues>({
    resolver: yupResolver(newBoxSchema),
    defaultValues: {
      name: box?.name ?? "",
      description: box?.description ?? "",
      roomId: String(box?.roomId ?? initialRoomId),
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const description = useWatch({ control, name: "description" });
  const isBusy = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const canSave = roomsQuery.isSuccess && roomsQuery.data.length > 0;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isBusy) return;
    if (!nextOpen) {
      reset();
      createMutation.reset();
      updateMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const submit = (values: NewBoxValues) => {
    if (createMutation.isPending || updateMutation.isPending || !canSave) return;
    const room = roomsQuery.data?.find(({ id }) => String(id) === values.roomId);
    if (!room) {
      setError("roomId", { message: "Selecione um ambiente disponível neste espaço." }, { shouldFocus: true });
      return;
    }
    const payload = { name: values.name, description: values.description || null, roomId: room.id };
    const options = { onSuccess: (savedBox: BoxResponse) => { if (!box) onCreated?.(savedBox); reset(); onOpenChange(false); } };
    if (box) {
      updateMutation.mutate({ id: box.id, values: payload }, options);
    } else {
      createMutation.mutate(payload, options);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={box ? "Editar caixa" : "Nova caixa"}
      size="md"
      closeDisabled={isBusy}
      footer={
        <>
          <Button type="button" variant="outline" px="6" disabled={isBusy} onClick={() => handleOpenChange(false)}>Cancelar</Button>
          <Button type="submit" form={formId} w={{ base: "full", sm: "auto" }} px="6" loading={isBusy} loadingText="Salvando..." disabled={isBusy || !canSave}>{box ? "Salvar alterações" : "Salvar caixa"}</Button>
        </>
      }
    >
      <chakra.form id={formId} aria-label={box ? "Editar caixa" : "Cadastrar caixa"} aria-busy={isBusy} noValidate display="flex" flexDirection="column" gap="5" onSubmit={(event) => { void handleSubmit(submit)(event); }}>
        <Flex align="center" gap="4">
          <Flex boxSize="16" flexShrink="0" align="center" justify="center" borderRadius="md" bg="brand.subtle" color="brand.fg" aria-hidden="true">
            <Package size={30} strokeWidth={1.8} />
          </Flex>
          <Text color="fg.muted" fontSize="sm">{box ? "Atualize as informações desta caixa." : "Organize seus itens em uma caixa dentro de um ambiente."}</Text>
        </Flex>
        <Input label="Nome da caixa" placeholder="Ex.: Caixa de ferramentas" required maxLength={100} disabled={isBusy} {...register("name")} errorText={errors.name?.message} />
        <Field.Root required invalid={!!errors.roomId} disabled={isBusy || !canSave}>
          <Field.Label fontSize="sm" fontWeight="medium">Ambiente <Field.RequiredIndicator color="danger.500" /></Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...register("roomId")}
              required
              disabled={isBusy || !canSave}
              h="12"
              px="4"
              bg="bg.surface"
              color="fg.default"
              borderColor="border.default"
              borderRadius="md"
              fontSize="sm"
              _hover={{ borderColor: "border.emphasized" }}
              _focusVisible={{ borderColor: "brand.solid", outlineColor: "brand.focusRing", outlineWidth: "2px", outlineOffset: "2px" }}
            >
              <option value="">{roomsQuery.isPending ? "Carregando ambientes..." : "Selecione um ambiente"}</option>
              {roomsQuery.data?.map((room) => <option key={room.id} value={String(room.id)}>{room.name}</option>)}
            </NativeSelect.Field>
            <NativeSelect.Indicator color="fg.muted" />
          </NativeSelect.Root>
          <Field.ErrorText color="danger.700">{errors.roomId?.message}</Field.ErrorText>
        </Field.Root>
        {roomsQuery.isPending && <Text role="status" fontSize="sm" color="fg.muted">Carregando ambientes...</Text>}
        {roomsQuery.isError && (
          <Flex gap="3" align="center" wrap="wrap">
            <Text role="alert" color="fg.muted" fontSize="sm">Não foi possível carregar os ambientes.</Text>
            <Button type="button" variant="outline" h="10" px="4" loading={roomsQuery.isFetching} onClick={() => { void roomsQuery.refetch(); }}>Tentar novamente</Button>
          </Flex>
        )}
        {roomsQuery.isSuccess && roomsQuery.data.length === 0 && (
          <Flex direction="column" gap="2" align="start">
            <Text color="fg.muted" fontSize="sm">Cadastre um ambiente antes de adicionar caixas neste espaço.</Text>
            {onRoomsClick && <Button type="button" variant="link" onClick={() => { handleOpenChange(false); onRoomsClick(); }}>Ir para Ambientes</Button>}
          </Flex>
        )}
        <Field.Root invalid={!!errors.description} disabled={isBusy}>
          <Field.Label fontSize="sm" fontWeight="medium">Descrição (opcional)</Field.Label>
          <Textarea
            {...register("description")}
            disabled={isBusy}
            placeholder="Ex.: Ferramentas para pequenos reparos."
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
      </chakra.form>
    </Modal>
  );
}
