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

export interface CreateSpaceRequest {
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export async function createSpace(values: CreateSpaceRequest) {
  const { data } = await api.post<SpaceResponse>("/spaces", values);
  return data;
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
