import { IconButton } from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useId, useState } from "react";
import { Input } from "./input";
import type { InputProps } from "./input";

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  function PasswordInput({ id: providedId, name, ...props }, ref) {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const [visible, setVisible] = useState(false);

    return (
      <Input
        autoComplete="new-password"
        h="46px"
        {...props}
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        ref={ref}
        endElement={
          <IconButton
            type="button"
            variant="ghost"
            h="40px"
            w="40px"
            minW="40px"
            color="fg.muted"
            borderRadius="sm"
            aria-label={`${visible ? "Esconder" : "Mostrar"} ${name === "password" ? "senha" : "confirmação de senha"}`}
            aria-pressed={visible}
            aria-controls={id}
            onClick={() => setVisible((current) => !current)}
            _hover={{ bg: "bg.subtle", color: "fg.default" }}
          >
            {visible ? (
              <EyeOff size={18} strokeWidth={1.6} />
            ) : (
              <Eye size={18} strokeWidth={1.6} />
            )}
          </IconButton>
        }
      />
    );
  },
);
