import { api } from "./api";

export interface SaveInvitationRequest {
  email: string;
  role: "EDITOR" | "VIEWER";
  expiresAt: string;
}

export interface InvitationResponse {
  id: number;
  spaceId: number;
  invitedByUserId: number;
  email: string | null;
  token: string;
  role: "EDITOR" | "VIEWER";
  status: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function createInvitation(spaceId: string, values: SaveInvitationRequest) {
  const { data } = await api.post<InvitationResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/invitations`,
    values,
  );
  return data;
}

export async function getInvitations(spaceId: string, signal?: AbortSignal) {
  const { data } = await api.get<InvitationResponse[]>(
    `/spaces/${encodeURIComponent(spaceId)}/invitations`,
    { signal },
  );
  return data;
}

export async function deleteInvitation(spaceId: string, invitationId: number) {
  await api.delete(`/spaces/${encodeURIComponent(spaceId)}/invitations/${invitationId}`);
}

export async function revokeInvitation(spaceId: string, invitationId: number) {
  const { data } = await api.post<InvitationResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/invitations/${invitationId}/revoke`,
  );
  return data;
}

export interface ReceivedInvitationResponse {
  id: number;
  spaceId: number;
  spaceName: string;
  invitedByName: string;
  role: "EDITOR" | "VIEWER";
  status: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export async function getReceivedInvitations(signal?: AbortSignal) {
  const { data } = await api.get<ReceivedInvitationResponse[]>("/invitations/received", { signal });
  return data;
}

export type InvitationDecision = "accept" | "decline";

export interface InvitationDecisionResponse {
  id: number;
  spaceId: number;
  status: "ACCEPTED" | "DECLINED";
  acceptedAt: string | null;
}

export async function respondToInvitation(id: number, decision: InvitationDecision) {
  const { data } = await api.post<InvitationDecisionResponse>(`/invitations/received/${id}/${decision}`);
  return data;
}
