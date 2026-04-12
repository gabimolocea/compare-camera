import apiClient from "./client";
import type { Camera, CameraDetail, PaginatedResponse, CompareResult, SamplePhoto } from "../types/api";

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

export async function compareCameras(slugs: string[]): Promise<CompareResult> {
  const { data } = await apiClient.get<CompareResult>("/compare/", {
    params: { slugs: slugs.join(",") },
  });
  return data;
}

export interface SamplePhotoFilters {
  lens?: string;
  focal_length?: string;
  shutter_speed?: string;
  aperture?: string;
  iso?: string;
}

export async function getSamplePhotos(cameraSlug: string, filters: SamplePhotoFilters = {}): Promise<SamplePhoto[]> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
  );
  const { data } = await apiClient.get<SamplePhoto[]>(`/cameras/${cameraSlug}/sample-photos/`, { params });
  return data;
}

export async function submitSamplePhoto(formData: FormData): Promise<SamplePhoto> {
  const { data } = await apiClient.post<SamplePhoto>("/sample-photos/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
