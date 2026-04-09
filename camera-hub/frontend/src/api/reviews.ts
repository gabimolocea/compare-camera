import apiClient from "./client";
import type { Review, PaginatedResponse } from "../types/api";

export async function getReviews(cameraId?: number): Promise<PaginatedResponse<Review>> {
  const params = cameraId ? { camera: cameraId } : {};
  const { data } = await apiClient.get<PaginatedResponse<Review>>("/reviews/", { params });
  return data;
}

export async function createReview(payload: Partial<Review>): Promise<Review> {
  const { data } = await apiClient.post<Review>("/reviews/", payload);
  return data;
}

export async function voteReview(id: number): Promise<{ voted: boolean }> {
  const { data } = await apiClient.post<{ voted: boolean }>(`/reviews/${id}/vote/`);
  return data;
}
