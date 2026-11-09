import { api } from "./api";

export interface CreateItemRequest {
  locationId: number;
  name: string;
  description: string | null;
  quantity: number;
  notes: string | null;
  categoryId: number | null;
}

export interface ItemResponse extends CreateItemRequest {
  id: number;
  spaceId: number;
  createdByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export async function createItem(spaceId: string, values: CreateItemRequest) {
  const { data } = await api.post<ItemResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/items`,
    values,
  );
  return data;
}
