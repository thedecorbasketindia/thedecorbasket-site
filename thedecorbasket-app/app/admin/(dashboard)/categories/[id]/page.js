import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CategoryForm from "../CategoryForm";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("*").eq("id", id).single();
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
