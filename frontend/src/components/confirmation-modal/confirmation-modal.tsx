import { Dialog, Text } from "@chakra-ui/react";
import { useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "../button/button";
import { Modal } from "../modal/modal";

export interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingText?: string;
  isLoading?: boolean;
  destructive?: boolean;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loadingText = "Aguarde...",
  isLoading = false,
  destructive = false,
}: Readonly<ConfirmationModalProps>) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isLoading) onOpenChange(nextOpen);
      }}
      title={title}
      role="alertdialog"
      initialFocusEl={() => cancelRef.current}
      closeDisabled={isLoading}
      footer={
        <>
          <Button
            ref={cancelRef}
            type="button"
            variant="outline"
            px="5"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            w={{ base: "full", sm: "auto" }}
            px="5"
            loading={isLoading}
            disabled={isLoading}
            loadingText={loadingText}
            {...(destructive && {
              bg: "danger.700",
              color: "brand.contrast",
              _hover: { bg: "danger.700" },
              _active: { bg: "danger.700" },
              _focusVisible: {
                outlineColor: "danger.700",
                outlineWidth: "2px",
                outlineOffset: "3px",
              },
            })}
            onClick={() => {
              if (open && !isLoading) onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Dialog.Description asChild>
        <Text color="fg.muted" lineHeight="tall" overflowWrap="anywhere">
          {description}
        </Text>
      </Dialog.Description>
    </Modal>
  );
}
