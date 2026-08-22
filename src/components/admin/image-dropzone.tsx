"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { uploadProductImages } from "@/app/admin/products/actions";
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";

interface ImageDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
}

// Drag-and-drop (or click to browse) multi-photo uploader. Each photo
// goes through a crop dialog first (so it fits the square frame it'll be
// shown in everywhere on the site), then straight to Supabase Storage via
// a Server Action — we only keep the public URLs it returns here.
export function ImageDropzone({ images, onChange }: ImageDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  // Index of the thumbnail currently being dragged to reorder the list —
  // separate from `dragging` above, which is only for files dropped from
  // outside the browser onto the upload box.
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function queueFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    setCropQueue((prev) => [...prev, ...imageFiles]);
  }

  async function uploadOne(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const urls = await uploadProductImages(formData);
      onChange([...images, ...urls]);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      queueFiles(e.dataTransfer.files);
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  // The first photo is what shows as the product's cover image everywhere
  // (product cards, the gallery's default view) — see product-gallery.tsx —
  // so letting the admin drag these into the order they want is what
  // actually controls that, not a separate "set as cover" toggle.
  function reorderImages(from: number, to: number) {
    if (from === to) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          dragging
            ? "border-primary bg-accent"
            : "border-input hover:bg-accent/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) queueFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {uploading ? (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="size-6 text-muted-foreground" />
        )}
        <p className="text-sm text-muted-foreground">
          {uploading
            ? "Uploading..."
            : "Drag photos here, or click to browse"}
        </p>
      </div>

      {images.length > 1 && (
        <p className="text-xs text-muted-foreground">
          Drag photos to reorder them — the first one is the cover image.
        </p>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div
              key={src}
              draggable
              onDragStart={() => setDraggedIndex(i)}
              onDragEnd={() => setDraggedIndex(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIndex !== null) reorderImages(draggedIndex, i);
                setDraggedIndex(null);
              }}
              className={cn(
                "group relative size-16 shrink-0 cursor-grab overflow-hidden rounded-lg bg-muted transition-opacity active:cursor-grabbing",
                draggedIndex === i && "opacity-40"
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[10px] font-medium text-white">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="Remove photo"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ImageCropDialog
        file={cropQueue[0] ?? null}
        onCancel={() => setCropQueue((prev) => prev.slice(1))}
        onSkip={(file) => {
          setCropQueue((prev) => prev.slice(1));
          uploadOne(file);
        }}
        onConfirm={(croppedFile) => {
          setCropQueue((prev) => prev.slice(1));
          uploadOne(croppedFile);
        }}
      />
    </div>
  );
}
