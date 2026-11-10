import { Field, Flex, NativeSelect, Stack, Text, chakra } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../../../../../components/button/button";
import { Modal } from "../../../../../components/modal/modal";
import { useRoomsQuery } from "../../../../../hooks/rooms/use-rooms-query";
import { useBoxesQuery } from "../../../../../hooks/boxes/use-boxes-query";
import { useUpdateItemMutation } from "../../../../../hooks/items/use-update-item-mutation";
import type { ItemResponse } from "../../../../../services/items";
import { moveItemSchema } from "./move-item-schema";
import type { MoveItemValues } from "./move-item-schema";

interface MoveItemModalProps {
  spaceId: string;
  item: ItemResponse;
  initialRoomId: number;
  onClose: () => void;
}

const selectStyles = {
  h: "12",
  px: "4",
  bg: "bg.surface",
  color: "fg.default",
  borderColor: "border.default",
  borderRadius: "md",
  fontSize: "sm",
  _hover: { borderColor: "border.emphasized" },
  _focusVisible: { borderColor: "brand.solid", outlineColor: "brand.focusRing", outlineWidth: "2px", outlineOffset: "2px" },
};

export function MoveItemModal({ spaceId, item, initialRoomId, onClose }: Readonly<MoveItemModalProps>) {
  const formId = useId();
  const roomsQuery = useRoomsQuery(spaceId);
  const boxesQuery = useBoxesQuery(spaceId);
  const updateMutation = useUpdateItemMutation(spaceId);
  const { register, control, setValue, setError, handleSubmit, formState: { errors, isSubmitting } } = useForm<MoveItemValues>({
    resolver: yupResolver(moveItemSchema),
    defaultValues: {
      roomId: String(initialRoomId),
      boxId: item.locationId === initialRoomId ? "" : String(item.locationId),
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const [roomId, boxId] = useWatch({ control, name: ["roomId", "boxId"] });
  const boxes = boxesQuery.data?.filter((box) => String(box.roomId) === roomId) ?? [];
  const isBusy = isSubmitting || updateMutation.isPending;
  const destinationChanged = (boxId || roomId) !== String(item.locationId);
  const canSave = roomsQuery.isSuccess && roomsQuery.data.length > 0 && (!boxId || boxesQuery.isSuccess);

  const submit = (values: MoveItemValues) => {
    if (updateMutation.isPending || !canSave || !destinationChanged) return;
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

    updateMutation.mutate({
      id: item.id,
      values: {
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        notes: item.notes,
        categoryId: item.categoryId,
        locationId: box?.id ?? room.id,
      },
    }, { onSuccess: onClose });
  };

  return (
    <Modal
      open
      title="Mover item"
      size="md"
      closeDisabled={isBusy}
      onOpenChange={(open) => { if (!open && !isBusy) onClose(); }}
      footer={
        <>
          <Button type="button" variant="outline" px="6" disabled={isBusy} onClick={onClose}>Cancelar</Button>
          <Button type="submit" form={formId} w={{ base: "full", sm: "auto" }} px="6" loading={isBusy} loadingText="Movendo..." disabled={isBusy || !canSave || !destinationChanged}>Mover item</Button>
        </>
      }
    >
      <chakra.form id={formId} aria-label="Mover item" aria-busy={isBusy} noValidate onSubmit={(event) => { void handleSubmit(submit)(event); }}>
        <Stack gap="5">
          <Text fontSize="sm" color="fg.muted" overflowWrap="anywhere">Escolha onde guardar <strong>{item.name}</strong>.</Text>
          <Field.Root required invalid={!!errors.roomId} disabled={isBusy || !roomsQuery.isSuccess}>
            <Field.Label fontSize="sm">Ambiente <Field.RequiredIndicator color="danger.500" /></Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                {...selectStyles}
                disabled={isBusy || !roomsQuery.isSuccess}
                {...register("roomId", { onChange: () => setValue("boxId", "", { shouldDirty: true }) })}
              >
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
              <NativeSelect.Field {...selectStyles} disabled={isBusy || !roomId || !boxesQuery.isSuccess} {...register("boxId")}>
                <option value="">{boxesQuery.isPending ? "Carregando caixas..." : "Diretamente no ambiente"}</option>
                {boxes.map((box) => <option key={box.id} value={String(box.id)}>{box.name}</option>)}
              </NativeSelect.Field>
              <NativeSelect.Indicator color="fg.muted" />
            </NativeSelect.Root>
            <Field.ErrorText color="danger.700">{errors.boxId?.message}</Field.ErrorText>
            {roomId && boxesQuery.isSuccess && boxes.length === 0 && <Field.HelperText>Este ambiente ainda não possui caixas.</Field.HelperText>}
          </Field.Root>
          {roomsQuery.isError && (
            <Flex gap="3" align="center" wrap="wrap">
              <Text role="alert" fontSize="sm" color="fg.muted">Não foi possível carregar os ambientes.</Text>
              <Button type="button" variant="outline" h="10" px="4" disabled={isBusy} loading={roomsQuery.isFetching} onClick={() => { void roomsQuery.refetch(); }}>Tentar novamente</Button>
            </Flex>
          )}
          {roomsQuery.isSuccess && roomsQuery.data.length === 0 && <Text role="status" color="fg.muted" fontSize="sm">Nenhum ambiente disponível para mover este item.</Text>}
          {boxesQuery.isError && (
            <Flex gap="3" align="center" wrap="wrap">
              <Text role="alert" fontSize="sm" color="fg.muted">Não foi possível carregar as caixas.</Text>
              <Button type="button" variant="outline" h="10" px="4" disabled={isBusy} loading={boxesQuery.isFetching} onClick={() => { void boxesQuery.refetch(); }}>Tentar novamente</Button>
            </Flex>
          )}
        </Stack>
      </chakra.form>
    </Modal>
  );
}