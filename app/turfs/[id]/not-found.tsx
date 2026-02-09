import Link from 'next/link';

export default function TurfNotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <span className="material-symbols-outlined text-8xl text-primary">sports_soccer</span>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Turf Not Found</h1>
        <p className="text-gray-400 text-lg">
          The turf you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/turfs"
          className="inline-block bg-primary text-black px-8 py-4 rounded-xl font-bold uppercase tracking-tighter neon-glow-hover transition-all hover:scale-105"
        >
          Browse All Turfs
        </Link>
      </div>
    </div>
  );
}
