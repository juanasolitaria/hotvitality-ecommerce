"use client";

import { useState, type ReactElement } from "react";

import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  images: [] as string[],
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ProductFormDialogProps {
  /** Pass an existing product to edit it, or omit to create a new one. */
  product?: Product;
  onSave: (product: Product) => void;
  trigger: ReactElement;
}

export function ProductFormDialog({
  product,
  onSave,
  trigger,
}: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() =>
    product
      ? {
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description,
          price: String(product.price),
          images: product.images,
        }
      : EMPTY_FORM
  );

  const isEditing = Boolean(product);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    // Reset the form back to the product's current values (or blank for
    // "create") each time the dialog is reopened, so leftover edits from
    // a cancelled attempt don't stick around.
    if (nextOpen) {
      setForm(
        product
          ? {
              name: product.name,
              shortDescription: product.shortDescription,
              description: product.description,
              price: String(product.price),
              images: product.images,
            }
          : EMPTY_FORM
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.images.length === 0) {
      toast.error("Add at least one photo");
      return;
    }

    const price = Number(form.price);
    const savedProduct: Product = {
      id: product?.id ?? crypto.randomUUID(),
      slug: product?.slug ?? slugify(form.name),
      name: form.name,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Number.isFinite(price) ? price : 0,
      images: form.images,
    };

    onSave(savedProduct);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit product" : "Add product"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update this product's details."
                : "Fill in the details for the new product."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="shortDescription">Short description</Label>
              <Input
                id="shortDescription"
                required
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Full description</Label>
              <Textarea
                id="description"
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Photos</Label>
              <ImageDropzone
                images={form.images}
                onChange={(images) =>
                  setForm((prev) => ({ ...prev, images }))
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">
              {isEditing ? "Save changes" : "Add product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
