import { ButtonGroup, IconButton, Pagination as ChakraPagination } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  count: number;
  pageSize: number;
  defaultPage?: number;
}

export function Pagination({
  count,
  pageSize,
  defaultPage = 1,
}: Readonly<PaginationProps>) {
  return (
    <ChakraPagination.Root
      count={count}
      pageSize={pageSize}
      defaultPage={defaultPage}
      siblingCount={1}
    >
      <ButtonGroup size="sm" gap="2" variant="ghost">
        <ChakraPagination.PrevTrigger asChild>
          <IconButton
            aria-label="Página anterior"
            color="fg.muted"
            borderWidth="1px"
            borderColor="border.default"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
          </IconButton>
        </ChakraPagination.PrevTrigger>

        <ChakraPagination.Items
          render={(page) => (
            <ChakraPagination.Item key={page.value} type={page.type} value={page.value} asChild>
              <IconButton
                variant={{ base: "ghost", _selected: "outline" }}
                borderWidth="1px"
                borderColor={{ base: "transparent", _selected: "brand.solid" }}
                color={{ base: "fg.muted", _selected: "brand.fg" }}
              >
                {page.value}
              </IconButton>
            </ChakraPagination.Item>
          )}
        />

        <ChakraPagination.NextTrigger asChild>
          <IconButton
            aria-label="Próxima página"
            color="fg.muted"
            borderWidth="1px"
            borderColor="border.default"
          >
            <ChevronRight size={16} strokeWidth={1.8} />
          </IconButton>
        </ChakraPagination.NextTrigger>
      </ButtonGroup>
    </ChakraPagination.Root>
  );
}
