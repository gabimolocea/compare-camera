import apiClient from "./client";
import type { Camera, CameraDetail, PaginatedResponse, CompareResult } from "../types/api";

export interface CameraFilters {
  brand?: string;
  category?: string;
  status?: string;
  price_min?: number;
  price_max?: number;
  release_year_min?: number;
  release_year_max?: number;
  search?: string;
  page?: number;
}

export async function getCameras(filters: CameraFilters = {}): Promise<PaginatedResponse<Camera>> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
  );
  const { data } = await apiClient.get<PaginatedResponse<Camera>>("/cameras/", { params });
  return data;
}

export async function getCamera(slug: string): Promise<CameraDetail> {
  const { data } = await apiClient.get<CameraDetail>(`/cameras/${slug}/`);
  return data;
}

export async function getSimilarCameras(slug: string): Promise<Camera[]> {
  const { data } = await apiClient.get<Camera[]>(`/cameras/${slug}/similar/`);
  return data;
}

export async function getBrands() {
  const { data } = await apiClient.get("/brands/");
  return data;
}

export async function compareCameras(left: string, right: string): Promise<CompareResult> {
  const { data } = await apiClient.get<CompareResult>("/compare/", {
    params: { left, right },
  });
  return data;
}
