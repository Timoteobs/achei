import { IconButton } from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { Input } from "./input";

export function PasswordInput({
  name,
  label,
  placeholder,
}: Readonly<{ name: string; label: string; placeholder: string }>) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <Input
      id={id}
      name={name}
      label={label}
      placeholder={placeholder}
      type={visible ? "text" : "password"}
      autoComplete="new-password"
      h="46px"
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
}
