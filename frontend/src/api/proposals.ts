import apiClient from "./client";
import type { EditProposal } from "../types/api";

export async function createFieldProposal(payload: Partial<EditProposal>): Promise<EditProposal> {
  const { data } = await apiClient.post<EditProposal>("/my/proposals/field-edit/", payload);
  return data;
}

export async function getMyProposals(): Promise<EditProposal[]> {
  const { data } = await apiClient.get<EditProposal[]>("/my/proposals/field-edit/");
  return data;
}

export async function getModerationProposals(status = "pending"): Promise<EditProposal[]> {
  const { data } = await apiClient.get<EditProposal[]>("/moderation/proposals/", {
    params: { status },
  });
  return data;
}

export async function approveProposal(id: number, notes = ""): Promise<void> {
  await apiClient.post(`/moderation/proposals/${id}/approve/`, { notes });
}

export async function rejectProposal(id: number, notes = ""): Promise<void> {
  await apiClient.post(`/moderation/proposals/${id}/reject/`, { notes });
}
