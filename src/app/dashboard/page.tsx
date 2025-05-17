'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';

type FavoriteBook = {
  id: string;
  title?: string;
  author?: string;
  coverUrl?: string;
  userId?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);

        const favRef = collection(db, 'favorites');
        const q = query(favRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const favBooks: FavoriteBook[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<FavoriteBook, 'id'>),
        }));

     setFavorites(favBooks);
        setLoadingFavorites(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) return <p className="p-8">Loading...</p>;

  return (
    <main className="flex-grow p-8 overflow-y-auto bg-pink-50 min-h-[80vh] rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-pink-700 mb-4 font-serif">
        Welcome, {user.displayName || user.email?.split('@')[0] || 'Bookworm'}! 📚
      </h1>
      <p className="text-gray-700 text-lg mb-8 max-w-xl">
        Explore a world of stories — from the heart of Nigerian culture to the thrill of dark romance.
      </p>

      {/* Favorites Preview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-pink-600 mb-3">Your Favorites</h2>
        {loadingFavorites ? (
          <p>Loading favorites...</p>
        ) : favorites.length === 0 ? (
          <p className="text-gray-500 italic">You have no favorites yet. Start adding some!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {favorites.slice(0, 4).map((book) => (
              <div
                key={book.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={`Cover of ${book.title ?? 'book'}`}
                    width={300}
                    height={192}
                    className="rounded-md mb-3 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-pink-100 rounded-md mb-3 flex items-center justify-center text-pink-300">
                    No Image
                  </div>
                )}
                <h3 className="font-semibold text-pink-700 mb-2 truncate">{book.title || 'Untitled'}</h3>
                <p className="text-gray-600 text-sm truncate">{book.author || 'Unknown Author'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reading Vibes Section */}
      <section>
        <h2 className="text-2xl font-semibold text-pink-600 mb-3">Reading Vibes ✨</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { label: 'Sweet Romance', emoji: '💕' },
            { label: 'Nigerian Folklore', emoji: '🧚🏽‍♀️' },
            { label: 'Dark & Mysterious', emoji: '🌑' },
            { label: 'Magical Escapes', emoji: '✨' },
            { label: 'Cozy Reads', emoji: '🎀' },
            { label: 'Heartbreakers', emoji: '💔' },
            { label: 'Steamy Nights', emoji: '🔥' },
            { label: 'Slow Burns', emoji: '🌸' },
          ].map((vibe) => (
            <div
              key={vibe.label}
              className="bg-white shadow-sm hover:shadow-md transition rounded-xl p-4 text-center cursor-pointer hover:bg-pink-100"
            >
              <span className="text-3xl">{vibe.emoji}</span>
              <p className="mt-2 font-medium text-pink-700 text-sm">{vibe.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
