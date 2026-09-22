import { Box, Field, Input as ChakraInput } from "@chakra-ui/react";
import type { InputProps as ChakraInputProps } from "@chakra-ui/react";
import { forwardRef, useId } from "react";
import type { ReactNode } from "react";

export interface InputProps extends Omit<ChakraInputProps, "children"> {
  label?: ReactNode;
  errorText?: ReactNode;
  invalid?: boolean;
  startElement?: ReactNode;
  endElement?: ReactNode;
}

const fieldStyle = {
  h: "48px",
  borderRadius: "md",
  borderColor: "border.default",
  bg: "bg.surface",
  fontSize: "sm",
  color: "fg.default",
  _placeholder: { color: "fg.subtle" },
  _hover: { borderColor: "border.emphasized" },
  _focusVisible: {
    borderColor: "brand.solid",
    outlineColor: "brand.focusRing",
    outlineWidth: "2px",
    outlineOffset: "2px",
  },
} satisfies ChakraInputProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      id,
      label,
      errorText,
      invalid = !!errorText,
      startElement,
      endElement,
      disabled,
      readOnly,
      required,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const descriptionIds = [
      describedBy,
      invalid && errorText ? errorId : undefined,
    ].filter(Boolean).join(" ") || undefined;

    return (
      <Field.Root
        invalid={invalid}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
      >
        {label && (
          <Field.Label
            htmlFor={inputId}
            fontSize="sm"
            fontWeight="medium"
            mb="1"
          >
            {label}
            <Field.RequiredIndicator color="danger.500" ms="1" />
          </Field.Label>
        )}
        <Box position="relative" w="full">
          {startElement && (
            <Box
              position="absolute"
              left="4"
              top="50%"
              transform="translateY(-50%)"
              color="fg.muted"
              pointerEvents="none"
              zIndex="1"
              aria-hidden="true"
            >
              {startElement}
            </Box>
          )}
          <ChakraInput
            {...fieldStyle}
            ps={startElement ? "11" : "4"}
            pe={endElement ? "12" : "4"}
            {...props}
            id={inputId}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-describedby={descriptionIds}
          />
          {endElement && (
            <Box
              position="absolute"
              right="1"
              top="50%"
              transform="translateY(-50%)"
            >
              {endElement}
            </Box>
          )}
        </Box>
        {invalid && errorText && (
          <Field.ErrorText id={errorId} color="danger.700">
            {errorText}
          </Field.ErrorText>
        )}
      </Field.Root>
    );
  },
);
