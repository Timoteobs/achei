import { api } from "./api";

export interface BoxResponse {
  id: number;
  spaceId: number;
  roomId: number;
  roomName: string;
  name: string;
  description: string | null;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaveBoxRequest {
  name: string;
  description: string | null;
  roomId: number;
}

export async function getBoxes(spaceId: string, signal?: AbortSignal) {
  const { data } = await api.get<BoxResponse[]>(
    `/spaces/${encodeURIComponent(spaceId)}/boxes`,
    { signal },
  );
  return data;
}

export async function createBox(spaceId: string, values: SaveBoxRequest) {
  const { data } = await api.post<BoxResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/boxes`,
    values,
  );
  return data;
}

export async function deleteBox(spaceId: string, boxId: number) {
  await api.delete(`/spaces/${encodeURIComponent(spaceId)}/boxes/${boxId}`);
}

export async function updateBox(spaceId: string, boxId: number, values: SaveBoxRequest) {
  const { data } = await api.put<BoxResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/boxes/${boxId}`,
    values,
  );
  return data;
}
