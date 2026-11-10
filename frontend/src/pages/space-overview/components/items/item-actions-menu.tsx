import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { FolderInput, MoreVertical, Pencil, Trash2 } from "lucide-react";

export function ItemActionsMenu({ name, onDelete, onEdit, onMove }: Readonly<{ name: string; onDelete: () => void; onEdit: () => void; onMove: () => void }>) {
  return (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <IconButton type="button" aria-label={`Ações de ${name}`} variant="ghost" size="xs"
          color="fg.muted" _hover={{ bg: "bg.subtle", color: "fg.default" }}>
          <MoreVertical size={16} strokeWidth={1.8} aria-hidden="true" />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content bg="bg.surface" borderColor="border.default" borderWidth="1px">
            <Menu.Item value="edit" color="fg.default" gap="2" onSelect={onEdit}
              _highlighted={{ bg: "bg.subtle", color: "fg.default" }}>
              <Pencil size={16} aria-hidden="true" />
              Editar
            </Menu.Item>
            <Menu.Item value="move" color="fg.default" gap="2" onSelect={onMove}
              _highlighted={{ bg: "bg.subtle", color: "fg.default" }}>
              <FolderInput size={16} aria-hidden="true" />
              Mover
            </Menu.Item>
            <Menu.Item value="delete" color="danger.700" gap="2" onSelect={onDelete}
              _highlighted={{ bg: "danger.50", color: "danger.700" }}>
              <Trash2 size={16} aria-hidden="true" />
              Excluir
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}