"use client";

import { useRef, useState, type ReactElement } from "react";
import { Bold, List } from "lucide-react";

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
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
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

  // Wraps the selected text in the description textarea with `**`, or —
  // if nothing's selected — inserts an empty `****` pair with the cursor
  // in the middle, ready to type. `/product` renders `**text**` as bold
  // (see product-info.tsx), a lightweight stand-in for a full rich-text
  // editor.
  function toggleBold() {
    const el = descriptionRef.current;
    if (!el) return;

    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd);
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);

    const newValue = selected
      ? `${before}**${selected}**${after}`
      : `${before}****${after}`;
    const newStart = selectionStart + 2;
    const newEnd = selected ? selectionEnd + 2 : newStart;

    setForm((prev) => ({ ...prev, description: newValue }));

    // Wait for React to commit the new value before moving the cursor —
    // setSelectionRange on the old value would be immediately overwritten.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    });
  }

  // Toggles a `- ` bullet prefix on every line touched by the selection
  // (or just the current line, if nothing's selected) — adds it to lines
  // that don't have it yet, strips it from ones that do. `/product`
  // groups consecutive `- ` lines into a real <ul> (see product-info.tsx).
  function toggleBulletList() {
    const el = descriptionRef.current;
    if (!el) return;

    const { selectionStart, selectionEnd, value } = el;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const nextBreak = value.indexOf("\n", selectionEnd);
    const lineEnd = nextBreak === -1 ? value.length : nextBreak;

    const before = value.slice(0, lineStart);
    const after = value.slice(lineEnd);
    const newLines = value
      .slice(lineStart, lineEnd)
      .split("\n")
      .map((line) => (line.startsWith("- ") ? line.slice(2) : `- ${line}`))
      .join("\n");

    const newValue = before + newLines + after;
    setForm((prev) => ({ ...prev, description: newValue }));

    const newStart = lineStart;
    const newEnd = lineStart + newLines.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    });
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
              <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-input bg-muted/40 px-1.5 py-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleBold}
                  aria-label="Bold"
                >
                  <Bold className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleBulletList}
                  aria-label="Bullet list"
                >
                  <List className="size-4" />
                </Button>
              </div>
              <Textarea
                ref={descriptionRef}
                id="description"
                required
                rows={3}
                className="rounded-t-none"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Select text and click Bold to emphasize it, or click the
                list icon to turn the current line(s) into bullet points —
                both show up formatted on the product page.
              </p>
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
