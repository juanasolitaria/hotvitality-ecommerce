"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Admin writes use the service role key (bypasses Row Level Security)
// instead of the logged-in user's session, because the storefront's
// login page isn't wired up to real Supabase Auth yet — there's no
// `auth.uid()` to check against the `is_admin()` policies.
//
// NOTE: /admin has no login gate at all right now, so anyone who can
// reach this page can call these actions. Add real auth + a route guard
// before this goes live.
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface ProductInput {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  images: string[];
}

export async function saveProduct(input: ProductInput) {
  const supabase = adminClient();
  const { error } = await supabase.from("products").upsert({
    id: input.id,
    slug: input.slug,
    name: input.name,
    short_description: input.shortDescription,
    description: input.description,
    price: input.price,
    images: input.images,
  });

  if (error) throw new Error(error.message);

  // Both pages read the products table, so refresh their cached data.
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

// Uploads dragged/selected files to the `product-images` Storage bucket
// and returns their public URLs. Runs server-side (the service role key
// never reaches the browser) even though it's called from a Client
// Component form, same as `saveProduct` above.
export async function uploadProductImages(formData: FormData): Promise<string[]> {
  const supabase = adminClient();
  const files = formData.getAll("files") as File[];

  const urls: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

export async function deleteProduct(id: string) {
  const supabase = adminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/shop");
  revalidatePath("/admin/products");
}
