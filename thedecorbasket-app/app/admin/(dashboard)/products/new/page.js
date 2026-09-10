import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("display_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
      <ProductForm categories={categories || []} />
    </div>
  );
}
