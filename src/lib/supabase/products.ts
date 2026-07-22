import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

// Shape of a row as it comes back from the `products` table (snake_case).
// We map it to our app's `Product` type (camelCase) so components don't
// need to know about the DB's column naming.
interface ProductRow {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  price: number;
  images: string[];
}

const PRODUCT_COLUMNS =
  "id, slug, name, short_description, description, price, images";

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    price: row.price,
    images: row.images,
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProduct(data) : null;
}
