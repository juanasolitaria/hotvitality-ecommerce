"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { createClient as createSessionClient } from "@/lib/supabase/server";

// Admin writes use the service role key (bypasses Row Level Security)
// instead of the logged-in user's session, so they don't depend on the
// `is_admin()` RLS policies lining up — requireAdmin() below is what
// actually gates access.
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// `admin/layout.tsx` only gates the /admin *page* — Server Actions are
// reachable as their own endpoint regardless of which page rendered the
// button that called them, so each one needs its own check too. Same
// session + profiles.role lookup as the page guard and
// admin/orders/actions.ts's requireAdmin().
async function requireAdmin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Not authorized");
}

export interface ProductInput {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
}

export async function saveProduct(input: ProductInput) {
  await requireAdmin();

  const supabase = adminClient();

  // `input.id` is always a fresh crypto.randomUUID() for a brand-new
  // product (see product-form-dialog.tsx), so checking whether it already
  // exists is a reliable way to tell create from edit here — the upsert
  // itself can't tell us, and we need to know so new products get
  // appended to the end of display_order instead of defaulting to 0 (the
  // column's default) and jumping to the front of the homepage/shop.
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("id", input.id)
    .maybeSingle();

  let displayOrder: number | undefined;
  if (!existing) {
    const { data: last } = await supabase
      .from("products")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    displayOrder = (last?.display_order ?? -1) + 1;
  }

  const { error } = await supabase.from("products").upsert({
    id: input.id,
    slug: input.slug,
    name: input.name,
    short_description: input.shortDescription,
    description: input.description,
    price: input.price,
    images: input.images,
    stock: input.stock,
    // Omitted entirely on edit, so the existing order is left untouched
    // instead of being reset by the upsert.
    ...(displayOrder !== undefined ? { display_order: displayOrder } : {}),
  });

  if (error) throw new Error(error.message);

  // All three read the products table, so refresh their cached data.
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

// Persists a drag-and-drop reorder from /admin/products — `orderedIds` is
// the full product list in its new order, index becomes display_order.
export async function reorderProducts(orderedIds: string[]) {
  await requireAdmin();

  const supabase = adminClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("products").update({ display_order: index }).eq("id", id)
    )
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(failed.error.message);

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

// Uploads dragged/selected files to the `product-images` Storage bucket
// and returns their public URLs. Runs server-side (the service role key
// never reaches the browser) even though it's called from a Client
// Component form, same as `saveProduct` above.
export async function uploadProductImages(formData: FormData): Promise<string[]> {
  await requireAdmin();

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
  await requireAdmin();

  const supabase = adminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");
}
