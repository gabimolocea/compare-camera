import { createContext, useContext } from "react";

export interface TrayCamera {
  slug: string;
  name: string;
  image: string | null;
}

export interface CompareTrayContextValue {
  cameras: TrayCamera[];
  slugs: string[];
  toggle: (camera: TrayCamera) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isSelected: (slug: string) => boolean;
  isFull: boolean;
}

export const CompareTrayContext = createContext<CompareTrayContextValue | null>(null);

export function useCompareTray() {
  const ctx = useContext(CompareTrayContext);
  if (!ctx) throw new Error("useCompareTray must be used within CompareTrayProvider");
  return ctx;
}
