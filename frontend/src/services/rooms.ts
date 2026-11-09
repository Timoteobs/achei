import { api } from "./api";

export interface RoomResponse {
  id: number;
  spaceId: number;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  boxesCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function getRooms(spaceId: string, signal?: AbortSignal) {
  const { data } = await api.get<RoomResponse[]>(
    `/spaces/${encodeURIComponent(spaceId)}/rooms`,
    { signal },
  );
  return data;
}
