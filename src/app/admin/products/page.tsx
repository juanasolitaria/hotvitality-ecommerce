import { getProducts } from "@/lib/supabase/products";
import { ProductsTable } from "@/components/admin/products-table";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return <ProductsTable initialProducts={products} />;
}
