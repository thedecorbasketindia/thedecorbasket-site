"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

/**
 * Uploads directly to the Supabase Storage "media" bucket from the browser,
 * then calls onUploaded(publicUrl) with the resulting link.
 */
export default function ImageUploader({ onUploaded, folder = "uploads", label = "Upload image" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  async function handleFiles(files) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setPreview(data.publicUrl);
      onUploaded(data.publicUrl, file.name);
    }
    setUploading(false);
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-sm"
    >
      {preview && (
        <div className="w-24 h-24 relative mx-auto mb-2 rounded overflow-hidden">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <p className="text-gray-500 mb-2">{uploading ? "Uploading…" : label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="border border-gray-300 rounded px-3 py-1.5 text-xs"
      >
        Choose file(s)
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
      <p className="text-gray-400 text-xs mt-2">or drag and drop an image here</p>
    </div>
  );
}
