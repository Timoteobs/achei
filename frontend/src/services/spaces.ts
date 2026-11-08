import { api } from "./api";

export interface SpaceResponse {
  id: number;
  ownerUserId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveSpaceRequest {
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export async function createSpace(values: SaveSpaceRequest) {
  const { data } = await api.post<SpaceResponse>("/spaces", values);
  return data;
}

export async function updateSpace(spaceId: number, values: SaveSpaceRequest) {
  const { data } = await api.put<SpaceResponse>(`/spaces/${spaceId}`, values);
  return data;
}

export async function deleteSpace(spaceId: number) {
  await api.delete(`/spaces/${spaceId}`);
}

export async function getSpaces(signal?: AbortSignal) {
  const { data } = await api.get<SpaceResponse[]>("/spaces", { signal });
  return data;
}

export async function getSpace(spaceId: string, signal?: AbortSignal) {
  const { data } = await api.get<SpaceResponse>(
    `/spaces/${encodeURIComponent(spaceId)}`,
    { signal },
  );
  return data;
}
