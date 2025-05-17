"use client";

import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Image from "next/image";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

type Book = {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  thumbnail?: string;
  previewLink?: string;
};

// Type for the Google Books API response item
type GoogleBookItem = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    previewLink?: string;
  };
};

export default function CategoriesPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=romance&key=${API_KEY}&maxResults=12`
        );
        const data = await res.json();
        const mapped =
          data.items?.map((item: GoogleBookItem) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            description: item.volumeInfo.description,
            thumbnail:
              item.volumeInfo.imageLinks?.thumbnail ||
              item.volumeInfo.imageLinks?.smallThumbnail,
            previewLink: item.volumeInfo.previewLink,
          })) || [];
        setBooks(mapped);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Sidebar */}
      <Sidebar
        userEmail="user@example.com"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 p-8 relative">
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-pink-500 text-white"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path
              d={
                sidebarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M3 12h18M3 6h18M3 18h18"
              }
            />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-pink-700 mb-6">
          📚 All Book Categories
        </h1>

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white shadow rounded p-4 flex flex-col"
              >
                {book.thumbnail && (
                  <Image
                    src={book.thumbnail}
                    alt={book.title}
                    width={128}
                    height={192}
                    className="mb-3 object-contain"
                  />
                )}
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p className="text-sm italic text-gray-600">
                  {book.authors.join(", ")}
                </p>
                <p className="mt-2 line-clamp-3 text-gray-700">
                  {book.description || "No description available."}
                </p>
                {book.previewLink && (
                  <a
                    href={book.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-pink-600 hover:underline"
                  >
                    Preview
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
