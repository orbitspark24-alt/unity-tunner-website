import type { Metadata } from "next";
import GalleryContent from "./GalleryContent";

export const metadata: Metadata = {
  title: "Builds & Gallery — Project Cars",
  description: "Project cars from the Unity workshop. Before/after specs, mods and dyno-verified numbers.",
};

export default function GalleryPage() {
  return <GalleryContent />;
}
