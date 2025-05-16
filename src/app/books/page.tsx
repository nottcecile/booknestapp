'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../Sidebar';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

type Book = {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  thumbnail?: string;
  previewLink?: string;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [queryTerm, setQueryTerm] = useState('nigerian folktales');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useAuthState(auth);

  const fetchBooks = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchTerm
        )}&key=${API_KEY}&maxResults=12`
      );
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        setBooks([]);
        setMessage('No books found.');
      } else {
        const mapped = data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || [],
          description: item.volumeInfo.description,
          thumbnail:
            item.volumeInfo.imageLinks?.thumbnail ||
            item.volumeInfo.imageLinks?.smallThumbnail,
          previewLink: item.volumeInfo.previewLink,
        }));
        setBooks(mapped);
        setMessage('');
      }
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setMessage('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(queryTerm);
  }, []);

  const addToFavorites = async (book: Book) => {
    if (!user) return alert('Please login first.');
    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', book.id);
      await setDoc(favRef, book);
      alert('Added to favorites!');
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Sidebar */}
      <Sidebar
        userEmail={user?.email || 'Guest'}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 p-8 relative">
        {/* Hamburger toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-pink-500 text-white"
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
            <path d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M3 12h18M3 6h18M3 18h18'} />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-pink-700 mb-6">📖 Discover Books</h1>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search books..."
            value={queryTerm}
            onChange={(e) => setQueryTerm(e.target.value)}
            className="p-2 border rounded flex-grow"
          />
          <button
            onClick={() => fetchBooks(queryTerm)}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : message ? (
          <p className="text-red-500">{message}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white shadow rounded p-4 flex flex-col"
              >
                {book.thumbnail && (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="mb-3 h-48 object-contain"
                  />
                )}
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p className="text-sm italic text-gray-600">
                  {book.authors.join(', ')}
                </p>
                <p className="mt-2 line-clamp-3 text-gray-700">
                  {book.description || 'No description available.'}
                </p>
                <div className="mt-auto flex gap-2 pt-2">
                  <a
                    href={book.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline"
                  >
                    Preview
                  </a>
                  <button
                    onClick={() => addToFavorites(book)}
                    className="ml-auto bg-pink-500 text-white px-2 py-1 rounded text-sm hover:bg-pink-600"
                  >
                    ❤️ Favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blur overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}


