'use client';import Link from 'next/link';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center text-white relative"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1740&q=80)',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 drop-shadow-lg">
          Welcome to BookNest
        </h1>
        <p className="text-lg md:text-xl mb-8 font-light drop-shadow-md">
          A cozy corner to read, unwind, and fall in love with stories.
        </p>
        <Link href="/signup">
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 rounded-full shadow-lg transition duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
