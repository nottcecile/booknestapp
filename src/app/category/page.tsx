// src/app/categories/[category]/page.tsx
"use client";

import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);

  return (
    <main className="p-8 min-h-screen bg-pink-50">
      <h1 className="text-3xl font-bold text-pink-700 font-serif mb-4">
        Category: {category}
      </h1>
      <p className="text-gray-700 text-lg">
        Books for the <strong>{category}</strong> category will appear here.
      </p>
    </main>
  );
}
