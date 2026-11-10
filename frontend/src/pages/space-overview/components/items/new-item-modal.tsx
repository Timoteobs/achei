import { Field, Flex, Grid, NativeSelect, Stack, Text, Textarea, chakra } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../../../../components/button/button";
import { Input } from "../../../../components/input/input";
import { Modal } from "../../../../components/modal/modal";
import type { ModalProps } from "../../../../components/modal/modal";
import { useRoomsQuery } from "../../../../hooks/rooms/use-rooms-query";
import { useBoxesQuery } from "../../../../hooks/boxes/use-boxes-query";
import { useCreateItemMutation } from "../../../../hooks/items/use-create-item-mutation";
import { useUpdateItemMutation } from "../../../../hooks/items/use-update-item-mutation";
import type { ItemResponse } from "../../../../services/items";
import { newItemSchema } from "./new-item-schema";
import type { NewItemValues } from "./new-item-schema";

export interface ItemLocation {
  space: string;
  room: string;
  roomId: number;
  box?: string;
  boxId?: number;
}

const controlStyles = {
  bg: "bg.surface",
  color: "fg.default",
  borderColor: "border.default",
  borderRadius: "md",
  fontSize: "sm",
  px: "4",
  _hover: { borderColor: "border.emphasized" },
  _focusVisible: { borderColor: "brand.solid", outlineColor: "brand.focusRing", outlineWidth: "2px", outlineOffset: "2px" },
};

export function NewItemModal({ open, onOpenChange, location, item }: Readonly<
  Pick<ModalProps, "open" | "onOpenChange"> & { location?: ItemLocation; item?: ItemResponse }
>) {
  const formId = useId();
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const roomsQuery = useRoomsQuery(spaceId);
  const boxesQuery = useBoxesQuery(spaceId);
  const createMutation = useCreateItemMutation(spaceId);
  const updateMutation = useUpdateItemMutation(spaceId);
  const { register, control, handleSubmit, reset, setValue, setError, formState: { errors, isSubmitting } } = useForm<NewItemValues>({
    resolver: yupResolver(newItemSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      notes: item?.notes ?? "",
      quantity: item?.quantity ?? 1,
      roomId: location ? String(location.roomId) : "",
      boxId: location?.boxId ? String(location.boxId) : "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const [roomId, boxId] = useWatch({ control, name: ["roomId", "boxId"] });
  const boxes = boxesQuery.data?.filter((box) => String(box.roomId) === roomId) ?? [];
  const isBusy = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const canSave = roomsQuery.isSuccess && roomsQuery.data.length > 0 && (!boxId || boxesQuery.isSuccess);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isBusy) return;
    if (!nextOpen) {
      reset();
      createMutation.reset();
      updateMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const submit = (values: NewItemValues, addMore = false) => {
    if (createMutation.isPending || updateMutation.isPending || !canSave) return;
    const room = roomsQuery.data?.find(({ id }) => String(id) === values.roomId);
    if (!room) {
      setError("roomId", { message: "Selecione um ambiente disponível neste espaço." }, { shouldFocus: true });
      return;
    }
    const box = boxesQuery.data?.find(({ id, roomId: parentId }) => String(id) === values.boxId && parentId === room.id);
    if (values.boxId && !box) {
      setError("boxId", { message: "Selecione uma caixa disponível neste ambiente." }, { shouldFocus: true });
      return;
    }
    const payload = {
      name: values.name,
      description: values.description || null,
      notes: values.notes || null,
      quantity: values.quantity,
      locationId: box?.id ?? room.id,
      // Category selection is not available yet; preserve the existing category when editing.
      categoryId: item?.categoryId ?? null,
    };
    const options = {
      onSuccess: () => {
        if (addMore && !item) {
          reset({
            name: "",
            description: "",
            notes: "",
            quantity: 1,
            roomId: values.roomId,
            boxId: values.boxId,
          });
          return;
        }
        reset();
        onOpenChange(false);
      },
    };
    if (item) {
      updateMutation.mutate({ id: item.id, values: payload }, options);
    } else {
      createMutation.mutate(payload, options);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={item ? "Editar item" : "Novo item"}
      size="lg"
      closeDisabled={isBusy}
      footer={
        <>
          <Button type="button" variant="outline" px="6" disabled={isBusy} onClick={() => handleOpenChange(false)}>Cancelar</Button>
          {!item && (
            <Button
              type="button"
              variant="outline"
              w={{ base: "full", sm: "auto" }}
              px="6"
              disabled={isBusy || !canSave}
              onClick={() => { void handleSubmit((values) => submit(values, true))(); }}
            >
              Salvar e adicionar mais
            </Button>
          )}
          <Button type="submit" form={formId} w={{ base: "full", sm: "auto" }} px="6" loading={isBusy} loadingText="Salvando..." disabled={isBusy || !canSave}>{item ? "Salvar alterações" : "Salvar item"}</Button>
        </>
      }
    >
      <chakra.form id={formId} aria-label={item ? "Editar item" : "Cadastrar item"} aria-busy={isBusy} noValidate onSubmit={(event) => { void handleSubmit((values) => submit(values))(event); }}>
        <Stack gap="5">
          <Flex align="center" gap="4">
            <Flex boxSize="14" flexShrink="0" align="center" justify="center" borderRadius="md" bg="brand.subtle" color="brand.fg" aria-hidden="true">
              <Package size={28} strokeWidth={1.8} />
            </Flex>
            <Text color="fg.muted" fontSize="sm">{item ? "Atualize as informações do item e onde ele está guardado." : "Cadastre o item e escolha onde ele será guardado."}</Text>
          </Flex>
          <Grid templateColumns={{ base: "1fr", sm: "minmax(0, 1fr) 140px" }} gap="4">
            <Input label="Nome do item" placeholder="Ex.: Furadeira Bosch" required maxLength={150} disabled={isBusy} {...register("name")} errorText={errors.name?.message} />
            <Input label="Quantidade" type="number" min={1} max={2147483647} step={1} required disabled={isBusy} {...register("quantity", { valueAsNumber: true })} errorText={errors.quantity?.message} />
          </Grid>
          <Field.Root invalid={!!errors.description} disabled={isBusy}>
            <Field.Label fontSize="sm">Descrição (opcional)</Field.Label>
            <Textarea {...controlStyles} {...register("description")} disabled={isBusy} maxLength={1000} minH="24" py="3" resize="vertical" placeholder="Descreva o item para encontrá-lo mais facilmente." />
            <Field.ErrorText color="danger.700">{errors.description?.message}</Field.ErrorText>
          </Field.Root>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))" }} gap="4">
            <Field.Root required invalid={!!errors.roomId} disabled={isBusy || !roomsQuery.isSuccess}>
              <Field.Label fontSize="sm">Ambiente <Field.RequiredIndicator color="danger.500" /></Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field {...controlStyles} h="12" disabled={isBusy || !roomsQuery.isSuccess} {...register("roomId", { onChange: () => setValue("boxId", "", { shouldDirty: true }) })}>
                  <option value="">{roomsQuery.isPending ? "Carregando ambientes..." : "Selecione um ambiente"}</option>
                  {roomsQuery.data?.map((room) => <option key={room.id} value={String(room.id)}>{room.name}</option>)}
                </NativeSelect.Field>
                <NativeSelect.Indicator color="fg.muted" />
              </NativeSelect.Root>
              <Field.ErrorText color="danger.700">{errors.roomId?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.boxId} disabled={isBusy || !roomId || !boxesQuery.isSuccess}>
              <Field.Label fontSize="sm">Caixa (opcional)</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field {...controlStyles} h="12" disabled={isBusy || !roomId || !boxesQuery.isSuccess} {...register("boxId")}>
                  <option value="">{boxesQuery.isPending ? "Carregando caixas..." : "Diretamente no ambiente"}</option>
                  {boxes.map((box) => <option key={box.id} value={String(box.id)}>{box.name}</option>)}
                </NativeSelect.Field>
                <NativeSelect.Indicator color="fg.muted" />
              </NativeSelect.Root>
              <Field.ErrorText color="danger.700">{errors.boxId?.message}</Field.ErrorText>
            </Field.Root>
          </Grid>
          {roomsQuery.isError && (
            <Flex align="center" gap="3" wrap="wrap">
              <Text role="alert" fontSize="sm" color="fg.muted">Não foi possível carregar os ambientes.</Text>
              <Button type="button" variant="outline" h="10" px="4" disabled={isBusy} loading={roomsQuery.isFetching} onClick={() => { void roomsQuery.refetch(); }}>Tentar novamente</Button>
            </Flex>
          )}
          {roomsQuery.isSuccess && roomsQuery.data.length === 0 && <Text role="status" fontSize="sm" color="fg.muted">Cadastre um ambiente antes de adicionar itens neste espaço.</Text>}
          {boxesQuery.isError && (
            <Flex align="center" gap="3" wrap="wrap">
              <Text role="alert" fontSize="sm" color="fg.muted">Não foi possível carregar as caixas.</Text>
              <Button type="button" variant="outline" h="10" px="4" disabled={isBusy} loading={boxesQuery.isFetching} onClick={() => { void boxesQuery.refetch(); }}>Tentar novamente</Button>
            </Flex>
          )}
          <Field.Root invalid={!!errors.notes} disabled={isBusy}>
            <Field.Label fontSize="sm">Observações (opcional)</Field.Label>
            <Textarea {...controlStyles} {...register("notes")} disabled={isBusy} maxLength={1000} minH="20" py="3" resize="vertical" placeholder="Ex.: Guardar junto com as brocas." />
            <Field.ErrorText color="danger.700">{errors.notes?.message}</Field.ErrorText>
          </Field.Root>
        </Stack>
      </chakra.form>
    </Modal>
  );
}
