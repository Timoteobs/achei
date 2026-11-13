import { api } from "./api";

export interface ActivityResponse {
  id: number;
  spaceId: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: number | null;
  metadata: string | null;
  createdAt: string;
}

export interface ListActivitiesRequest {
  page: number;
  pageSize: number;
}

export interface ActivitiesPageResponse {
  items: ActivityResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export async function getActivities(spaceId: string, params: ListActivitiesRequest, signal?: AbortSignal) {
  const { data } = await api.get<ActivitiesPageResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/activities`,
    { params, signal },
  );
  return data;
}

export interface ActivityIndicatorsResponse {
  spaceId: number;
  periodStart: string;
  periodEnd: string;
  totalActivities: number;
  itemsAdded: number;
  itemsUpdated: number;
  itemsRemoved: number;
}

export async function getActivityIndicators(spaceId: string, signal?: AbortSignal) {
  const { data } = await api.get<ActivityIndicatorsResponse>(
    `/spaces/${encodeURIComponent(spaceId)}/activities/indicators`,
    { signal },
  );
  return data;
}
