import { Badge, Box, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import { Mail, UserRoundMinus, X } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../../../../components/button/button";
import { EmptyState } from "../../../../components/empty-state/empty-state";
import { useInvitationsQuery } from "../../../../hooks/invitations/use-invitations-query";
import { formatDate } from "../../../../utils/date";
import type { InvitationResponse } from "../../../../services/invitations";
import { CancelInvitationModal } from "./cancel-invitation-modal";
import { RevokeInvitationModal } from "./revoke-invitation-modal";

const statuses: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pendente", color: "brand.fg", bg: "brand.subtle" },
  ACCEPTED: { label: "Aceito", color: "brand.fg", bg: "brand.subtle" },
  EXPIRED: { label: "Expirado", color: "fg.muted", bg: "bg.subtle" },
  REVOKED: { label: "Revogado", color: "fg.muted", bg: "bg.subtle" },
  DECLINED: { label: "Recusado", color: "fg.muted", bg: "bg.subtle" },
};

export function InvitationList({ spaceId }: Readonly<{ spaceId: string }>) {
  const titleId = useId();
  const query = useInvitationsQuery(spaceId);
  const [invitationToCancel, setInvitationToCancel] = useState<InvitationResponse | null>(null);
  const [invitationToRevoke, setInvitationToRevoke] = useState<InvitationResponse | null>(null);

  return (
    <Flex
      as="section"
      aria-labelledby={titleId}
      direction="column"
      minW="0"
      minH="0"
      maxH={{ base: "400px", md: "none" }}
      borderTopWidth={{ base: "1px", md: "0" }}
      borderLeftWidth={{ base: "0", md: "1px" }}
      borderColor="border.default"
      pt={{ base: "5", md: "0" }}
      pl={{ base: "0", md: "6" }}
    >
      <Flex align="center" justify="space-between" gap="3" mb="4" flexShrink="0">
        <Heading id={titleId} as="h2" fontSize="sm" fontWeight="semibold" color="fg.default">
          Convites enviados
        </Heading>
        {query.data && <Badge bg="bg.subtle" color="fg.muted" borderRadius="full" px="2">{query.data.length}</Badge>}
      </Flex>
      <Box
        flex="1"
        minH="0"
        overflowY="auto"
        overscrollBehavior="contain"
        scrollbarGutter="stable"
        pr="2"
        tabIndex={0}
        role="region"
        aria-label="Lista de convites"
        _focusVisible={{ outline: "2px solid", outlineColor: "brand.focusRing", outlineOffset: "-2px" }}
      >
        {query.isPending ? (
          <Flex direction="column" gap="4" role="status" aria-label="Carregando convites">
            {Array.from({ length: 4 }, (_, index) => (
              <Box key={index} py="3">
                <Skeleton h="4" w="70%" mb="3" />
                <Skeleton h="3" w="45%" mb="3" />
                <Skeleton h="3" w="85%" />
              </Box>
            ))}
          </Flex>
        ) : query.isError ? (
          <Box py="6" role="alert">
            <Text fontSize="sm" color="fg.muted" mb="4">Não foi possível carregar os convites.</Text>
            <Button variant="outline" w="auto" px="4" loading={query.isFetching} onClick={() => { void query.refetch(); }}>
              Tentar novamente
            </Button>
          </Box>
        ) : query.data.length === 0 ? (
          <EmptyState title="Nenhum convite ainda" description="Convide uma pessoa pelo formulário para compartilhar este espaço." />
        ) : (
          <Box as="ul" listStyleType="none" m="0" p="0">
            {query.data.map((invitation) => {
              const status = statuses[invitation.status] ?? { label: "Indisponível", color: "fg.muted", bg: "bg.subtle" };
              return (
                <Box as="li" key={invitation.id} py="4" borderBottomWidth="1px" borderColor="border.subtle" _first={{ pt: "0" }} _last={{ borderBottomWidth: "0" }}>
                  <Flex align="flex-start" gap="3">
                    <Flex align="center" justify="center" boxSize="9" flexShrink="0" bg="brand.subtle" color="brand.fg" borderRadius="md" aria-hidden="true">
                      <Mail size={17} strokeWidth={1.8} />
                    </Flex>
                    <Box minW="0" flex="1">
                      <Text fontSize="sm" fontWeight="semibold" color="fg.default" overflowWrap="anywhere">{invitation.email || "Convite por link"}</Text>
                      <Flex align="center" wrap="wrap" gap="2" mt="1">
                        <Text fontSize="xs" color="fg.muted">{invitation.role === "EDITOR" ? "Editor" : "Visualizador"}</Text>
                        <Badge bg={status.bg} color={status.color} borderRadius="full" fontSize="xs" px="2">{status.label}</Badge>
                      </Flex>
                      <Text fontSize="xs" color="fg.muted" mt="2">Criado em {formatDate(invitation.createdAt)}</Text>
                      <Text fontSize="xs" color="fg.muted" mt="1">
                        {invitation.acceptedAt ? `Aceito em ${formatDate(invitation.acceptedAt)}` : `Validade: ${formatDate(invitation.expiresAt)}`}
                      </Text>
                      {invitation.status === "ACCEPTED" && (
                        <Button
                          type="button"
                          variant="link"
                          mt="2"
                          color="danger.700"
                          gap="1"
                          aria-label={`Revogar acesso de ${invitation.email || "membro"}`}
                          onClick={() => setInvitationToRevoke(invitation)}
                        >
                          <UserRoundMinus size={14} strokeWidth={1.8} aria-hidden="true" />
                          Revogar acesso
                        </Button>
                      )}
                      {invitation.status === "PENDING" && !invitation.acceptedAt && (
                        <Button
                          type="button"
                          variant="link"
                          mt="2"
                          color="danger.700"
                          gap="1"
                          aria-label={`Cancelar convite ${invitation.email ? `para ${invitation.email}` : "por link"}`}
                          onClick={() => setInvitationToCancel(invitation)}
                        >
                          <X size={14} strokeWidth={1.8} aria-hidden="true" />
                          Cancelar convite
                        </Button>
                      )}
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      <RevokeInvitationModal
        spaceId={spaceId}
        invitation={invitationToRevoke}
        onClose={() => setInvitationToRevoke(null)}
      />
      <CancelInvitationModal
        spaceId={spaceId}
        invitation={invitationToCancel}
        onClose={() => setInvitationToCancel(null)}
      />
    </Flex>
  );
}
