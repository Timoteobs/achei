import { Box, Dialog, Flex, IconButton, Portal } from "@chakra-ui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  size?: ModalSize;
  footer?: ReactNode;
  closeDisabled?: boolean;
  role?: "dialog" | "alertdialog";
  initialFocusEl?: () => HTMLElement | null;
  children: ReactNode;
}

const maxWidth = {
  sm: "400px",
  md: "520px",
  lg: "820px",
  xl: "960px",
} satisfies Record<ModalSize, string>;

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  size = "md",
  footer,
  closeDisabled = false,
  role = "dialog",
  initialFocusEl,
  children,
}: Readonly<ModalProps>) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      placement="center"
      closeOnEscape={!closeDisabled}
      closeOnInteractOutside={!closeDisabled}
      // Restoring focus from the previous dialog must not dismiss this one.
      onFocusOutside={(event) => event.preventDefault()}
      role={role}
      initialFocusEl={initialFocusEl}
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.500" backdropFilter="blur(4px)" />
        <Dialog.Positioner p="4">
          <Dialog.Content
            maxW={maxWidth[size]}
            w="full"
            maxH="calc(100dvh - 32px)"
            display="flex"
            flexDirection="column"
            bg="bg.surface"
            borderRadius="lg"
            boxShadow="lg"
            overflow="hidden"
          >
            <Dialog.Header
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap="4"
              px={{ base: "5", md: "7" }}
              pt="5"
              pb="4"
              flexShrink="0"
            >
              <Flex align="center" gap="5" minW="0">
                {icon && <Flex boxSize={{ base: "12", md: "16" }} flexShrink="0" align="center" justify="center" bg="brand.subtle" color="brand.fg" borderRadius="lg" aria-hidden="true">{icon}</Flex>}
                <Box minW="0">
                  <Dialog.Title fontSize={description ? { base: "2xl", md: "3xl" } : "2xl"} fontWeight="bold" color="fg.default">
                    {title}
                  </Dialog.Title>
                  {description && <Dialog.Description color="fg.muted" fontSize={{ base: "sm", md: "md" }} mt="2">{description}</Dialog.Description>}
                </Box>
              </Flex>
              <Dialog.CloseTrigger asChild position="static">
                <IconButton
                  aria-label="Fechar"
                  disabled={closeDisabled}
                  variant="ghost"
                  size="sm"
                  color="fg.muted"
                  flexShrink="0"
                  _hover={{ bg: "bg.subtle" }}
                >
                  <X size={20} strokeWidth={1.8} />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body
              flex="1"
              minH="0"
              overflowY="auto"
              px={{ base: "5", md: "7" }}
              pt="0"
              pb="5"
            >
              {children}
            </Dialog.Body>

            {footer && (
              <Dialog.Footer
                display="flex"
                flexDirection={{ base: "column-reverse", sm: "row" }}
                justifyContent="flex-end"
                gap="3"
                px={{ base: "5", md: "6" }}
                py="5"
                flexShrink="0"
                borderTopWidth="1px"
                borderColor="border.default"
              >
                {footer}
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
