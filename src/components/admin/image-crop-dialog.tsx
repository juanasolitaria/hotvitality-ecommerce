"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageCropDialogProps {
  /** The file to crop. Passing null closes the dialog. */
  file: File | null;
  onCancel: () => void;
  onSkip: (file: File) => void;
  onConfirm: (croppedFile: File) => void;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Draws just the cropped region onto a same-size canvas and reads it back
// out as a file — the standard way to turn react-easy-crop's pixel
// coordinates into an actual image.
async function cropToFile(
  imageSrc: string,
  area: Area,
  fileName: string,
  fileType: string
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas isn't supported in this browser");

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, fileType, 0.92)
  );
  if (!blob) throw new Error("Couldn't generate the cropped image");

  return new File([blob], fileName, { type: blob.type });
}

// Lets the admin pan/zoom a just-selected photo into a square crop before
// it uploads — so what they see here is what shows up everywhere the
// product photo renders as a square (product cards, the gallery, etc).
export function ImageCropDialog({
  file,
  onCancel,
  onSkip,
  onConfirm,
}: ImageCropDialogProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  // Reset per-file so a new photo doesn't inherit the last one's pan/zoom.
  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleConfirm() {
    if (!file || !imageUrl || !croppedArea) return;
    setProcessing(true);
    try {
      const croppedFile = await cropToFile(
        imageUrl,
        croppedArea,
        file.name,
        file.type
      );
      onConfirm(croppedFile);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Dialog
      open={file !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust photo</DialogTitle>
          <DialogDescription>
            Drag to reposition, use the slider to zoom, so it crops in
            nicely as a square.
          </DialogDescription>
        </DialogHeader>

        {imageUrl && (
          <>
            <div className="relative h-80 w-full overflow-hidden rounded-lg bg-black">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, areaPixels) => setCroppedArea(areaPixels)}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label="Zoom"
              className="w-full accent-primary"
            />
          </>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => file && onSkip(file)}
            disabled={processing}
          >
            Use original
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={processing}>
            {processing ? "Saving..." : "Save crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
