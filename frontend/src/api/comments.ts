import apiClient from "./client";
import type { Comment } from "../types/api";

export async function getComments(contentType: number, objectId: number): Promise<Comment[]> {
  const { data } = await apiClient.get<Comment[]>("/comments/", {
    params: { content_type: contentType, object_id: objectId },
  });
  return data;
}

export async function createComment(payload: Partial<Comment>): Promise<Comment> {
  const { data } = await apiClient.post<Comment>("/comments/", payload);
  return data;
}
