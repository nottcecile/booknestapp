'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs } from 'firebase/firestore';
import Sidebar from '../Sidebar';
import Image from 'next/image';

type FavoriteBook = {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  thumbnail?: string;
  previewLink?: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const favRef = collection(db, 'users', user.uid, 'favorites');
      const snap = await getDocs(favRef);
      const books = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<FavoriteBook, 'id'>) }));
      setFavorites(books);
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-purple-50">
      <Sidebar
        userEmail={user?.email || 'user@example.com'}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 p-8 relative">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-purple-500 text-white"
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

        <h1 className="text-3xl font-bold text-purple-700 mb-6">💜 Your Favorites</h1>

        {favorites.length === 0 ? (
          <p className="text-gray-600">No favorite books yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((book) => (
              <div key={book.id} className="bg-white shadow rounded p-4 flex flex-col">
                {book.thumbnail && (
                  <Image
                    src={book.thumbnail}
                    alt={book.title}
                    width={192}
                    height={192}
                    className="mb-3 object-contain"
                  />
                )}
                <h2 className="text-lg font-semibold text-purple-700">{book.title}</h2>
                <p className="text-sm italic text-gray-600">
                  {book.authors?.join(', ')}
                </p>
                <p className="mt-2 line-clamp-3 text-gray-700">
                  {book.description || 'No description available.'}
                </p>
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-purple-600 hover:underline"
                >
                  Preview
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
