import { Avatar, AvatarGroup, Flex, Grid, Text } from "@chakra-ui/react";
import { CalendarDays, LayoutGrid, Package, UsersRound } from "lucide-react";
import { InfoCard } from "../../../../components/info-card/info-card";
import type { SpaceDetailsResponse } from "../../../../services/spaces";
import { formatDate } from "../../../../utils/date";

type SpaceSummaryData = Pick<SpaceDetailsResponse,
  "createdAt" | "itemsCount" | "roomsCount" | "membersCount" | "membersPreview"
>;

export function SpaceSummary({ space }: Readonly<{ space: SpaceSummaryData }>) {
  const { createdAt, itemsCount, roomsCount, membersCount, membersPreview } = space;
  const remainingMembers = Math.max(0, membersCount - membersPreview.length);

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
            <Text>{membersCount} {membersCount === 1 ? "membro" : "membros"}</Text>
            {membersPreview.length > 0 && (
              <AvatarGroup size="2xs" spaceX="-1.5">
                {membersPreview.map((member) => (
                  <Avatar.Root
                    key={member.id}
                    boxSize="7"
                    bg="brand.subtle"
                    color="brand.fg"
                    borderWidth="2px"
                    borderColor="bg.surface"
                    title={member.name}
                  >
                    <Avatar.Fallback name={member.name} fontSize="xs" />
                    {member.avatarUrl && <Avatar.Image src={member.avatarUrl} alt={member.name} />}
                  </Avatar.Root>
                ))}
                {remainingMembers > 0 && (
                  <Avatar.Root
                    boxSize="7"
                    bg="bg.subtle"
                    color="fg.muted"
                    borderWidth="2px"
                    borderColor="bg.surface"
                    aria-label={`Mais ${remainingMembers} ${remainingMembers === 1 ? "membro" : "membros"}`}
                  >
                    <Avatar.Fallback fontSize="xs">+{remainingMembers}</Avatar.Fallback>
                  </Avatar.Root>
                )}
              </AvatarGroup>
            )}
          </Flex>
        }
      />
      <InfoCard
        icon={<Package size={18} strokeWidth={1.8} />}
        value={`${itemsCount} ${itemsCount === 1 ? "item" : "itens"}`}
      />
      <InfoCard
        icon={<LayoutGrid size={18} strokeWidth={1.8} />}
        value={`${roomsCount} ${roomsCount === 1 ? "ambiente" : "ambientes"}`}
      />
      <InfoCard
        icon={<CalendarDays size={18} strokeWidth={1.8} />}
        label="Criado em"
        value={formatDate(createdAt)}
      />
    </Grid>
  );
}
