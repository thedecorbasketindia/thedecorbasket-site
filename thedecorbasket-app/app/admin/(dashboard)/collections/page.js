"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createCollection } from "./actions";
import { createClient } from "@/lib/supabase/client";

export default function CollectionsListPage() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase.from("collections").select("*").order("display_order");
    setCollections(data || []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    await createCollection({ name });
    setName("");
    setCreating(false);
    refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Collections</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection name, e.g. Festive"
          className="border rounded px-3 py-2 text-sm flex-1 max-w-sm"
        />
        <button disabled={creating} className="bg-[#7C0E2A] text-white rounded px-4 py-2 text-sm">
          + Add Collection
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((c) => (
          <Link key={c.id} href={`/admin/collections/${c.id}`} className="bg-white rounded-md shadow-sm p-4">
            <p className="font-medium text-sm">{c.name}</p>
            <p className="text-xs text-gray-400">{c.enabled ? "Enabled" : "Hidden"}</p>
          </Link>
        ))}
      </div>
      {!collections.length && <p className="text-gray-500 text-sm">No collections yet.</p>}
    </div>
  );
}
