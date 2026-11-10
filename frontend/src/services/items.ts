import { api } from "./api";

export interface SaveItemRequest {
  locationId: number;
  name: string;
  description: string | null;
  quantity: number;
  notes: string | null;
  categoryId: number | null;
}

export interface ItemResponse extends SaveItemRequest {
  id: number;
  spaceId: number;
  createdByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export type ItemSort = "recent" | "oldest" | "name-asc" | "name-desc";

export interface ListItemsRequest {
  locationId: number;
  page: number;
  pageSize: number;
  sort: ItemSort;
  search: string;
}

export interface ItemsPageResponse {
  items: ItemResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export async function getItems(spaceId: string, params: ListItemsRequest, signal?: AbortSignal) {
  const { data } = await api.get<ItemsPageResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/items`,
    { params, signal },
  );
  return data;
}

export async function createItem(spaceId: string, values: SaveItemRequest) {
  const { data } = await api.post<ItemResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/items`,
    values,
  );
  return data;
}

export async function deleteItem(spaceId: string, itemId: number) {
  await api.delete(`/spaces/${encodeURIComponent(spaceId)}/items/${itemId}`);
}

export async function updateItem(spaceId: string, itemId: number, values: SaveItemRequest) {
  const { data } = await api.put<ItemResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/items/${itemId}`,
    values,
  );
  return data;
}
