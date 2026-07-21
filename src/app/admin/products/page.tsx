"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { products as initialProducts } from "@/data/products";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { toast } from "sonner";

export default function AdminProductsPage() {
  // Seeded from the same mock catalog the storefront uses. There's no
  // database yet, so adds/edits/deletes here only live in this browser
  // tab and reset on refresh — but the UI behaves like the real thing.
  const [items, setItems] = useState<Product[]>(initialProducts);

  function handleSave(product: Product) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [...prev, product];
    });
    toast.success(`${product.name} saved`);
  }

  function handleDelete(product: Product) {
    setItems((prev) => prev.filter((p) => p.id !== product.id));
    toast.success(`${product.name} deleted`);
  }

  return (
    <div>
      {/* Stacks on mobile so the "Add product" button doesn't get
          squeezed next to the heading on narrow screens. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} products
          </p>
        </div>

        <ProductFormDialog
          onSave={handleSave}
          trigger={
            <Button className="w-fit">
              <Plus className="size-4" />
              Add product
            </Button>
          }
        />
      </div>

      <Card className="mt-6">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {product.shortDescription}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <ProductFormDialog
                        product={product}
                        onSave={handleSave}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />

                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Delete ${product.name}`}
                            />
                          }
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete {product.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This can&apos;t be undone. This will only
                              affect this browser tab since there&apos;s no
                              database yet.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
