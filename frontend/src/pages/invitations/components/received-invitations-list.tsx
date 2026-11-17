import { Badge, Box, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import { Check, Mail, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { ConfirmationModal } from "../../../components/confirmation-modal/confirmation-modal";
import { useRespondToInvitationMutation } from "../../../hooks/invitations/use-respond-to-invitation-mutation";
import type { ReceivedInvitationResponse } from "../../../services/invitations";
import { Button } from "../../../components/button/button";
import { EmptyState } from "../../../components/empty-state/empty-state";
import { useReceivedInvitationsQuery } from "../../../hooks/invitations/use-received-invitations-query";
import { formatDate, formatDateTime } from "../../../utils/date";

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  EXPIRED: "Expirado",
  REVOKED: "Revogado",
  DECLINED: "Rejeitado",
};

export function ReceivedInvitationsList() {
  const query = useReceivedInvitationsQuery();
  const respondMutation = useRespondToInvitationMutation();
  const [invitationToDecline, setInvitationToDecline] = useState<ReceivedInvitationResponse | null>(null);

  return (
    <Box as="section" aria-label="Convites recebidos" mt="6" bg="bg.surface" borderWidth="1px" borderColor="border.default" borderRadius="lg" overflow="hidden">
      <Flex align="center" justify="space-between" gap="3" px={{ base: "4", md: "6" }} py="4" borderBottomWidth="1px" borderColor="border.default" wrap="wrap">
        <Flex align="center" gap="2">
          <Heading as="h2" fontSize="md" color="fg.default">Convites recebidos</Heading>
          {query.data && <Badge bg="brand.subtle" color="brand.fg" borderRadius="full" px="2">{query.data.length}</Badge>}
        </Flex>
        <Button type="button" variant="outline" h="9" px="3" loading={query.isFetching} disabled={query.isFetching} onClick={() => { void query.refetch(); }}>
          <RefreshCw size={15} strokeWidth={1.8} aria-hidden="true" />
          Atualizar
        </Button>
      </Flex>
      {query.isPending ? (
        <Box role="status" aria-label="Carregando convites" px={{ base: "4", md: "6" }}>
          {Array.from({ length: 4 }, (_, index) => (
            <Flex key={index} gap="4" py="5" borderBottomWidth="1px" borderColor="border.subtle" _last={{ borderBottomWidth: "0" }}>
              <Skeleton boxSize="11" borderRadius="full" flexShrink="0" />
              <Box flex="1">
                <Skeleton h="4" w="55%" mb="3" />
                <Skeleton h="3" w="75%" mb="3" />
                <Skeleton h="3" w="35%" />
              </Box>
            </Flex>
          ))}
        </Box>
      ) : query.isError ? (
        <Box p="6" role="alert">
          <Text color="fg.muted" mb="4">Não foi possível carregar seus convites.</Text>
          <Button type="button" variant="outline" px="4" loading={query.isFetching} onClick={() => { void query.refetch(); }}>
            Tentar novamente
          </Button>
        </Box>
      ) : query.data.length === 0 ? (
        <EmptyState title="Nenhum convite recebido" description="Quando alguém convidar você pelo e-mail da sua conta, o convite aparecerá aqui." />
      ) : (
        <Box as="ul" listStyleType="none" m="0" px={{ base: "4", md: "6" }}>
          {query.data.map((invitation) => (
            <Flex as="li" key={invitation.id} align="flex-start" gap="4" py="5" borderBottomWidth="1px" borderColor="border.subtle" _last={{ borderBottomWidth: "0" }}>
              <Flex align="center" justify="center" boxSize="11" flexShrink="0" borderRadius="full" bg="brand.subtle" color="brand.fg" aria-hidden="true">
                <Mail size={21} strokeWidth={1.8} />
              </Flex>
              <Flex flex="1" minW="0" justify="space-between" gap="3" direction={{ base: "column", lg: "row" }}>
                <Box minW="0">
                  <Heading as="h3" fontSize="sm" fontWeight="semibold" color="fg.default" overflowWrap="anywhere">{invitation.spaceName}</Heading>
                  <Text fontSize="sm" color="fg.muted" mt="1" overflowWrap="anywhere">
                    <Text as="span" fontWeight="medium" color="fg.default">{invitation.invitedByName}</Text> convidou você para participar deste espaço.
                  </Text>
                  <Flex align="center" gap="2" mt="2" wrap="wrap">
                    <Text fontSize="xs" color="fg.muted">Permissão: {invitation.role === "EDITOR" ? "Editor" : "Visualizador"}</Text>
                    <Badge
                      fontSize="xs"
                      px="2"
                      borderRadius="full"
                      bg={invitation.status === "PENDING" || invitation.status === "ACCEPTED" ? "brand.subtle" : "bg.subtle"}
                      color={invitation.status === "PENDING" || invitation.status === "ACCEPTED" ? "brand.fg" : "fg.muted"}
                    >
                      {statusLabels[invitation.status] ?? "Indisponível"}
                    </Badge>
                  </Flex>
                  {invitation.status === "PENDING" && !invitation.acceptedAt && (
                    <Flex gap="2" mt="3" wrap="wrap">
                      <Button
                        type="button"
                        w="auto"
                        h="9"
                        px="4"
                        disabled={respondMutation.isPending}
                        loading={respondMutation.isPending && respondMutation.variables?.id === invitation.id && respondMutation.variables.decision === "accept"}
                        loadingText="Aceitando..."
                        aria-label={`Aceitar convite para ${invitation.spaceName}`}
                        onClick={() => {
                          if (!respondMutation.isPending) respondMutation.mutate({ id: invitation.id, decision: "accept" });
                        }}
                      >
                        <Check size={16} aria-hidden="true" />
                        Aceitar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        h="9"
                        px="4"
                        disabled={respondMutation.isPending}
                        aria-label={`Rejeitar convite para ${invitation.spaceName}`}
                        onClick={() => setInvitationToDecline(invitation)}
                      >
                        <X size={16} aria-hidden="true" />
                        Rejeitar
                      </Button>
                    </Flex>
                  )}
                </Box>
                <Box flexShrink="0" textAlign={{ base: "left", lg: "right" }}>
                  <Text fontSize="xs" color="fg.muted">Recebido em {formatDateTime(invitation.createdAt)}</Text>
                  <Text fontSize="xs" color="fg.muted" mt="1">
                    {invitation.acceptedAt ? `Aceito em ${formatDate(invitation.acceptedAt)}` : `Validade: ${formatDate(invitation.expiresAt)}`}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          ))}
        </Box>
      )}
      <ConfirmationModal
        open={invitationToDecline !== null}
        title="Rejeitar convite"
        description={<>Deseja rejeitar o convite para <strong>{invitationToDecline?.spaceName}</strong>? Para participar depois, será necessário receber um novo convite.</>}
        confirmLabel="Rejeitar convite"
        cancelLabel="Voltar"
        loadingText="Rejeitando..."
        destructive
        isLoading={respondMutation.isPending}
        onOpenChange={(open) => {
          if (!open && !respondMutation.isPending) {
            setInvitationToDecline(null);
            respondMutation.reset();
          }
        }}
        onConfirm={() => {
          if (invitationToDecline && !respondMutation.isPending) {
            respondMutation.mutate(
              { id: invitationToDecline.id, decision: "decline" },
              { onSuccess: () => setInvitationToDecline(null) },
            );
          }
        }}
      />
    </Box>
  );
}
