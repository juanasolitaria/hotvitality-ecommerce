"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { uploadProductImages } from "@/app/admin/products/actions";

interface ImageDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
}

// Drag-and-drop (or click to browse) multi-photo uploader. Dropped files
// go straight to Supabase Storage via a Server Action; we only keep the
// public URLs it returns here in the form's state.
export function ImageDropzone({ images, onChange }: ImageDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("files", file));
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
      uploadFiles(e.dataTransfer.files);
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
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
            if (e.target.files) uploadFiles(e.target.files);
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

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div
              key={src}
              className="group relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
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
    </div>
  );
}
