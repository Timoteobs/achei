import { Box, Field, Flex, Grid, Heading, Stack, Text, Textarea, chakra } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "@tanstack/react-router";
import { Armchair, ArrowRight, House, Package } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "../../../../components/button/button";
import { Input } from "../../../../components/input/input";
import { Modal } from "../../../../components/modal/modal";
import type { ModalProps } from "../../../../components/modal/modal";
import { SearchSelect } from "../../../../components/search-select/search-select";
import { useSpacesQuery } from "../../../../hooks/spaces/use-spaces-query";
import { useRoomsQuery } from "../../../../hooks/rooms/use-rooms-query";
import { useBoxesQuery } from "../../../../hooks/boxes/use-boxes-query";
import { useCreateItemMutation } from "../../../../hooks/items/use-create-item-mutation";
import { useUpdateItemMutation } from "../../../../hooks/items/use-update-item-mutation";
import type { ItemResponse } from "../../../../services/items";
import { NewSpaceModal } from "../../../spaces/components/new-space/new-space-modal";
import { NewRoomModal } from "../rooms/new-room/new-room-modal";
import { roomIconOptions } from "../rooms/new-room/new-room-options";
import { NewBoxModal } from "../boxes/new-box/new-box-modal";
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
  _placeholder: { color: "fg.subtle" },
  _hover: { borderColor: "border.emphasized" },
  _focusVisible: { borderColor: "brand.solid", outlineColor: "brand.focusRing", outlineWidth: "2px", outlineOffset: "2px" },
};

export function NewItemModal({ open, onOpenChange, location, item, spaceId: providedSpaceId }: Readonly<
  Pick<ModalProps, "open" | "onOpenChange"> & { location?: ItemLocation; item?: ItemResponse; spaceId?: string }
>) {
  const formId = useId();
  const { spaceId: routeSpaceId } = useParams({ strict: false });
  const spacesQuery = useSpacesQuery();
  const [creation, setCreation] = useState<"space" | "room" | "box" | null>(null);
  const { register, control, handleSubmit, reset, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm<NewItemValues>({
    resolver: yupResolver(newItemSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      notes: item?.notes ?? "",
      quantity: item?.quantity ?? 1,
      spaceId: item ? String(item.spaceId) : providedSpaceId ?? routeSpaceId ?? "",
      roomId: location ? String(location.roomId) : "",
      boxId: location?.boxId ? String(location.boxId) : "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    // Keep the item draft while a location registration replaces its dialog.
    shouldUnregister: false,
  });
  const [spaceId, roomId, boxId] = useWatch({ control, name: ["spaceId", "roomId", "boxId"] });
  const roomsQuery = useRoomsQuery(spaceId);
  const boxesQuery = useBoxesQuery(spaceId);
  const createMutation = useCreateItemMutation(spaceId);
  const updateMutation = useUpdateItemMutation(spaceId);
  const selectedSpace = spacesQuery.data?.find((space) => String(space.id) === spaceId);
  const selectedRoom = roomsQuery.data?.find((room) => String(room.id) === roomId);
  const boxes = boxesQuery.data?.filter((box) => String(box.roomId) === roomId) ?? [];
  const isBusy = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const canSave = spacesQuery.isSuccess && roomsQuery.isSuccess && (!boxId || boxesQuery.isSuccess);

  useEffect(() => {
    if (!spaceId && spacesQuery.data?.[0]) setValue("spaceId", String(spacesQuery.data[0].id));
  }, [spaceId, spacesQuery.data, setValue]);

  const selectSpace = (id: number) => {
    setValue("spaceId", String(id), { shouldDirty: true });
    setValue("roomId", "", { shouldDirty: true });
    setValue("boxId", "", { shouldDirty: true });
    clearErrors(["spaceId", "roomId", "boxId"]);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isBusy || creation) return;
    if (!nextOpen) {
      reset();
      createMutation.reset();
      updateMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const submit = (values: NewItemValues, addMore = false) => {
    if (createMutation.isPending || updateMutation.isPending || creation || !canSave) return;
    if (!spacesQuery.data?.some((space) => String(space.id) === values.spaceId)) {
      setError("spaceId", { message: "Selecione um espaço disponível." }, { shouldFocus: true });
      return;
    }
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
      categoryId: item?.categoryId ?? null,
    };
    const options = {
      onSuccess: () => {
        if (addMore && !item) {
          reset({ name: "", description: "", notes: "", quantity: 1, spaceId: values.spaceId, roomId: values.roomId, boxId: values.boxId });
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

  const handleCreationOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setCreation(null);
  };

  // Mount only the active dialog so its backdrop and focus trap do not overlap.
  if (creation === "space") {
    return (
      <NewSpaceModal
        open={open}
        onOpenChange={handleCreationOpenChange}
        onCreated={(space) => selectSpace(space.id)}
      />
    );
  }

  if (creation === "room") {
    return (
      <NewRoomModal
        open={open}
        spaceId={spaceId}
        onOpenChange={handleCreationOpenChange}
        onCreated={(room) => {
          setValue("roomId", String(room.id), { shouldDirty: true });
          setValue("boxId", "", { shouldDirty: true });
          clearErrors(["roomId", "boxId"]);
        }}
      />
    );
  }

  if (creation === "box") {
    return (
      <NewBoxModal
        open={open}
        spaceId={spaceId}
        initialRoomId={Number(roomId)}
        onRoomsClick={() => setCreation("room")}
        onOpenChange={handleCreationOpenChange}
        onCreated={(box) => {
          setValue("roomId", String(box.roomId), { shouldDirty: true });
          setValue("boxId", String(box.id), { shouldDirty: true });
          clearErrors(["roomId", "boxId"]);
        }}
      />
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={item ? "Editar item" : "Novo item"}
      description={item ? "Atualize as informações do item e onde ele está guardado." : "Cadastre o item e escolha onde ele será guardado."}
      icon={<Package size={30} strokeWidth={1.8} />}
      size="xl"
      closeDisabled={isBusy}
      footer={
        <>
          <Button type="button" variant="outline" px="6" disabled={isBusy} onClick={() => handleOpenChange(false)}>Cancelar</Button>
          {!item && (
            <Button type="button" variant="outline" w={{ base: "full", sm: "auto" }} px="6" disabled={isBusy || !canSave} onClick={() => { void handleSubmit((values) => submit(values, true))(); }}>
              Salvar e adicionar mais
            </Button>
          )}
          <Button type="submit" form={formId} w={{ base: "full", sm: "auto" }} px="6" loading={isBusy} loadingText="Salvando..." disabled={isBusy || !canSave}>{item ? "Salvar alterações" : "Salvar item"}</Button>
        </>
      }
    >
      <chakra.form id={formId} aria-label={item ? "Editar item" : "Cadastrar item"} aria-busy={isBusy} noValidate onSubmit={(event) => { void handleSubmit((values) => submit(values))(event); }}>
        <Stack gap="5" pt="2">
          <Grid templateColumns={{ base: "1fr", sm: "minmax(0, 1fr) 170px" }} gap="5">
            <Input label="Nome do item" placeholder="Ex.: Furadeira Bosch" required maxLength={150} disabled={isBusy} {...register("name")} errorText={errors.name?.message} />
            <Input label="Quantidade" type="number" min={1} max={2147483647} step={1} required disabled={isBusy} {...register("quantity", { valueAsNumber: true })} errorText={errors.quantity?.message} />
          </Grid>
          <Field.Root invalid={!!errors.description} disabled={isBusy}>
            <Field.Label fontSize="sm">Descrição (opcional)</Field.Label>
            <Textarea {...controlStyles} {...register("description")} disabled={isBusy} maxLength={1000} minH="20" py="3" resize="vertical" placeholder="Descreva o item para encontrá-lo mais facilmente." />
            <Field.ErrorText color="danger.700">{errors.description?.message}</Field.ErrorText>
          </Field.Root>
          <Box borderTopWidth="1px" borderColor="border.default" pt="4">
            <Heading as="h3" fontSize="lg" fontWeight="bold" color="fg.default">Onde está guardado?</Heading>
            <Text fontSize="sm" color="fg.muted" mt="1">Selecione a localização do item. Você pode criar um espaço, ambiente ou caixa na hora.</Text>
            <Grid templateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)" }} gap="3" alignItems="start" mt="6">
              <Field.Root invalid={!!errors.spaceId}>
                <Controller name="spaceId" control={control} render={({ field }) => (
                  <SearchSelect
                    label="Espaço"
                    placeholder="Selecione um espaço"
                    searchPlaceholder="Buscar espaço..."
                    emptyMessage="Nenhum espaço cadastrado."
                    icon={House}
                    options={(spacesQuery.data ?? []).map((space) => ({ value: String(space.id), label: space.name, description: space.description ?? undefined }))}
                    value={field.value}
                    onValueChange={(value) => selectSpace(Number(value))}
                    onBlur={field.onBlur}
                    createAction={item ? undefined : { label: "Novo espaço", onClick: () => setCreation("space") }}
                    disabled={isBusy || !!item || spacesQuery.isError}
                    loading={spacesQuery.isPending}
                    portalled={false}
                    size="lg"
                    triggerRef={field.ref}
                    invalid={!!errors.spaceId}
                    describedBy={errors.spaceId ? formId + "-space-error" : undefined}
                  />
                )} />
                <Field.ErrorText id={formId + "-space-error"} color="danger.700">{errors.spaceId?.message}</Field.ErrorText>
              </Field.Root>
              <Box display={{ base: "none", md: "block" }} pt="6" color="fg.muted" aria-hidden="true"><ArrowRight size={19} strokeWidth={1.5} /></Box>
              <Field.Root invalid={!!errors.roomId}>
                <Controller name="roomId" control={control} render={({ field }) => (
                  <SearchSelect
                    label="Ambiente"
                    placeholder="Selecione um ambiente"
                    searchPlaceholder="Buscar ambiente..."
                    emptyMessage="Nenhum ambiente cadastrado neste espaço."
                    icon={Armchair}
                    options={(roomsQuery.data ?? []).map((room) => ({
                      value: String(room.id),
                      label: room.name,
                      description: room.description ?? undefined,
                      icon: roomIconOptions.find((option) => option.value === room.icon)?.icon ?? Armchair,
                    }))}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("boxId", "", { shouldDirty: true });
                      clearErrors("boxId");
                    }}
                    onBlur={field.onBlur}
                    createAction={{ label: "Novo ambiente", onClick: () => setCreation("room") }}
                    disabled={isBusy || !selectedSpace || !roomsQuery.isSuccess}
                    loading={!!spaceId && roomsQuery.isPending}
                    portalled={false}
                    size="lg"
                    triggerRef={field.ref}
                    invalid={!!errors.roomId}
                    describedBy={errors.roomId ? formId + "-room-error" : undefined}
                  />
                )} />
                <Field.ErrorText id={formId + "-room-error"} color="danger.700">{errors.roomId?.message}</Field.ErrorText>
              </Field.Root>
              <Box display={{ base: "none", md: "block" }} pt="6" color="fg.muted" aria-hidden="true"><ArrowRight size={19} strokeWidth={1.5} /></Box>
              <Field.Root invalid={!!errors.boxId}>
                <Controller name="boxId" control={control} render={({ field }) => (
                  <SearchSelect
                    label="Caixa (opcional)"
                    placeholder="Selecione uma caixa"
                    searchPlaceholder="Buscar caixa..."
                    emptyMessage="Nenhuma caixa cadastrada neste ambiente."
                    icon={Package}
                    options={[
                      { value: "", label: "Diretamente no ambiente" },
                      ...boxes.map((box) => ({ value: String(box.id), label: box.name, description: box.description ?? undefined })),
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    createAction={{ label: "Nova caixa", onClick: () => setCreation("box") }}
                    disabled={isBusy || !selectedRoom || !boxesQuery.isSuccess}
                    loading={!!spaceId && boxesQuery.isPending}
                    portalled={false}
                    size="lg"
                    triggerRef={field.ref}
                    invalid={!!errors.boxId}
                    describedBy={errors.boxId ? formId + "-box-error" : undefined}
                  />
                )} />
                <Field.ErrorText id={formId + "-box-error"} color="danger.700">{errors.boxId?.message}</Field.ErrorText>
              </Field.Root>
            </Grid>
          </Box>
          {spacesQuery.isError && <LocationQueryError message="Não foi possível carregar os espaços." loading={spacesQuery.isFetching} disabled={isBusy} onRetry={() => { void spacesQuery.refetch(); }} />}
          {roomsQuery.isError && <LocationQueryError message="Não foi possível carregar os ambientes." loading={roomsQuery.isFetching} disabled={isBusy} onRetry={() => { void roomsQuery.refetch(); }} />}
          {boxesQuery.isError && <LocationQueryError message="Não foi possível carregar as caixas." loading={boxesQuery.isFetching} disabled={isBusy} onRetry={() => { void boxesQuery.refetch(); }} />}
          {spacesQuery.isSuccess && spacesQuery.data.length === 0 && <Text role="status" fontSize="sm" color="fg.muted">Use “Novo espaço” no seletor para começar a organizar seus itens.</Text>}
          {roomsQuery.isSuccess && roomsQuery.data.length === 0 && <Text role="status" fontSize="sm" color="fg.muted">Crie um ambiente para guardar o item neste espaço.</Text>}
          <Field.Root invalid={!!errors.notes} disabled={isBusy} mt="3">
            <Field.Label fontSize="sm">Observações (opcional)</Field.Label>
            <Textarea {...controlStyles} {...register("notes")} disabled={isBusy} maxLength={1000} minH="24" py="3" resize="vertical" placeholder="Ex.: Guardar junto com as brocas." />
            <Field.ErrorText color="danger.700">{errors.notes?.message}</Field.ErrorText>
          </Field.Root>
        </Stack>
      </chakra.form>
    </Modal>
  );
}

function LocationQueryError({ message, loading, disabled, onRetry }: Readonly<{ message: string; loading: boolean; disabled: boolean; onRetry: () => void }>) {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <Text role="alert" fontSize="sm" color="fg.muted">{message}</Text>
      <Button type="button" variant="outline" h="10" px="4" disabled={disabled} loading={loading} onClick={onRetry}>Tentar novamente</Button>
    </Flex>
  );
}
