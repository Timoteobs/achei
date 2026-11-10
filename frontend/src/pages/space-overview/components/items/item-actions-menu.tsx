import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { MoreVertical, Trash2 } from "lucide-react";

export function ItemActionsMenu({ name, onDelete }: Readonly<{ name: string; onDelete: () => void }>) {
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