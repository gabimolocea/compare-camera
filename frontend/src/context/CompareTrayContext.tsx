import { useState, type ReactNode } from "react";
import { CompareTrayContext, type TrayCamera } from "./useCompareTray";

const MAX = 4;

export function CompareTrayProvider({ children }: { children: ReactNode }) {
  const [cameras, setCameras] = useState<TrayCamera[]>([]);

  const toggle = (camera: TrayCamera) => {
    setCameras((prev) => {
      const exists = prev.some((c) => c.slug === camera.slug);
      if (exists) return prev.filter((c) => c.slug !== camera.slug);
      if (prev.length >= MAX) return prev;
      return [...prev, camera];
    });
  };

  const remove = (slug: string) =>
    setCameras((prev) => prev.filter((c) => c.slug !== slug));

  const clear = () => setCameras([]);

  const isSelected = (slug: string) => cameras.some((c) => c.slug === slug);

  const slugs = cameras.map((c) => c.slug);

  return (
    <CompareTrayContext.Provider
      value={{ cameras, slugs, toggle, remove, clear, isSelected, isFull: cameras.length >= MAX }}
    >
      {children}
    </CompareTrayContext.Provider>
  );
}
