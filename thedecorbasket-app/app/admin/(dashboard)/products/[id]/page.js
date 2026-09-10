import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("*").order("display_order"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <ProductForm product={product} categories={categories || []} />
    </div>
  );
}
