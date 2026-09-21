import { Avatar, AvatarGroup, Flex, Grid, Text } from "@chakra-ui/react";
import { CalendarDays, LayoutGrid, Package, UsersRound } from "lucide-react";
import { InfoCard } from "../../../components/info-card/info-card";
import { spaceSummaryMock } from "../space-summary-mock";

export function SpaceSummary() {
  const { members, itemsCount, roomsCount, createdAt } = spaceSummaryMock;

  return (
    <Grid
      as="section"
      aria-label="Resumo do espaço"
      mt="6"
      gap="3"
      templateColumns={{
        base: "repeat(auto-fit, minmax(min(100%, 10rem), 1fr))",
        sm: "repeat(2, minmax(0, 1fr))",
        xl: "repeat(4, max-content)",
      }}
    >
      <InfoCard
        icon={<UsersRound size={18} strokeWidth={1.8} />}
        value={
          <Flex align="center" flexWrap="wrap" gap="2">
            <Text>{members.total} membros</Text>
            <AvatarGroup size="2xs" spaceX="-1.5">
              {members.visibleMembers.map((member) => (
                <Avatar.Root
                  key={member.id}
                  boxSize="7"
                  bg="brand.subtle"
                  color="brand.fg"
                  borderWidth="2px"
                  borderColor="bg.surface"
                  title={member.name}
                >
                  <Avatar.Fallback name={member.name} fontSize="xs">
                    {member.fallback}
                  </Avatar.Fallback>
                </Avatar.Root>
              ))}
              <Avatar.Root
                boxSize="7"
                bg="bg.subtle"
                color="fg.muted"
                borderWidth="2px"
                borderColor="bg.surface"
                aria-label={`Mais ${members.remaining} membro`}
              >
                <Avatar.Fallback fontSize="xs">
                  +{members.remaining}
                </Avatar.Fallback>
              </Avatar.Root>
            </AvatarGroup>
          </Flex>
        }
      />
      <InfoCard
        icon={<Package size={18} strokeWidth={1.8} />}
        value={`${itemsCount} itens`}
      />
      <InfoCard
        icon={<LayoutGrid size={18} strokeWidth={1.8} />}
        value={`${roomsCount} ambientes`}
      />
      <InfoCard
        icon={<CalendarDays size={18} strokeWidth={1.8} />}
        label="Criado em"
        value={createdAt}
      />
    </Grid>
  );
}
