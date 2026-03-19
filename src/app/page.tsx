export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center animate-pageIn">
        <h1 className="font-heading text-5xl font-extrabold tracking-tight text-navy mb-4">
          Nova
          <span className="inline-block w-2 h-2 rounded-full bg-gold ml-1 -translate-y-4" />
        </h1>
        <p className="text-lg text-grayText max-w-md mx-auto leading-relaxed">
          Artisans certifiés, paiement sécurisé par séquestre.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button className="px-8 py-3 rounded-[14px] bg-gradient-to-br from-deepForest to-forest text-white font-bold shadow-lg hover:-translate-y-0.5 transition-transform">
            Trouver mon artisan
          </button>
          <button className="px-8 py-3 rounded-[14px] border border-border text-navy font-semibold hover:-translate-y-0.5 transition-transform">
            En savoir plus
          </button>
        </div>
      </div>
    </main>
  );
}
