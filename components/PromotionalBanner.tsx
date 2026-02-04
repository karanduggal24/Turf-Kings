export default function PromotionalBanner() {
  const avatarUrls = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCAY2PkBckVjfEMnV4zmrlNZSGRSKOwTDlDkZuc6WiGK3RaqF6Map8Po3TRtDGd3DLMaWBTiFO4vfHSNjFg3SccHD3ZVZz_X6ogXXQyEc4H15b0ZY4tNxhWEQjZM6ISBX0EPHmpGIElhgAOftA9WhgXIzw84HHtGVGE_DNBAmpjGre46rhLEPm46rACCNB22STsrTz8c0ovNENLT8Byr_PyhiA71dU_NjwCuM0AnFFFkNPPer6zcZpn8ZMRUefjvbH746ji-CVCv3Y",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA48tas4UtLbovLPoKuZWhPny0ToLJdbPfuH08PNdQm0aFQrw6tMOzQgFJ0R9uiNoU3FVsYuWcVfzaArEj2kHwTddltRlwWR_bthwAvGZEeIABfeq2INezMddINjtgJR_UkPhVqbM_tWJ0ZQf82UYko5nuWDroF--X0FMtmaaxv0Ech2bH157I8IXMyuYxZ8ZrDvZr-B07UWqLtWtYNAGNCqXClChDnQLrLHUvLqWrfR2fxVd5d4yP0aTH2ezMRaoJ41qMKrUZw60I",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA8sXHN7dUcxlla-PMOsMdXwTDPmAYT2gAnOC2-vZ0xSZRVePsMTe8aNcjesRJVACOfdb4abf9il45Or5Pj1a493ehEKI4GOY8uYsjLxS0UMMWTBJjA-jHVv9jgb0RnIjIx9vITGjcxd0Fr5e1rcpeHhYeSkJHNmr0zpN_KS1EnML8-TiPVVPdQByRdVkTFTGtdgIKTRQo_k4xK1drgIC-azKccL93rDQ5OrbdRcHu_9NtZGv7iAFG1CJFs2zYixZBkZp1TUQDCuSI"
  ];

  return (
    <section className="py-16 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/25 to-primary/5 border border-primary/40 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 neon-glow">
        
        {/* Ad Content */}
        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-widest uppercase">
            Limited Time Offer
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Level Up Your <span className="text-primary">Game Play.</span>
          </h2>
          <p className="text-gray-300 max-w-md text-lg md:text-xl leading-relaxed">
            Don't just play—dominate. Book your next 3 sessions now and <span className="text-white font-bold underline decoration-primary">save 20% instantly.</span> 
          </p>
          <button className="mt-4 bg-primary text-black hover:scale-105 active:scale-95 px-10 py-5 rounded-2xl font-black transition-all duration-300 inline-flex items-center gap-3 text-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
            CLAIM DISCOUNT
            <span className="material-symbols-outlined font-bold">bolt</span>
          </button>
        </div>
        
        {/* Visual Flair */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none hidden md:block"></div>
        
        {/* Social Proof / Trust Section */}
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="flex -space-x-4">
            {avatarUrls.map((url, index) => (
              <img 
                key={index}
                alt={`User ${index + 1}`}
                className="w-16 h-16 rounded-full border-4 border-black shadow-2xl transition-transform hover:-translate-y-2" 
                src={url}
              />
            ))}
            <div className="w-16 h-16 rounded-full border-4 border-black bg-zinc-900 flex items-center justify-center text-sm font-black text-primary shadow-2xl">
              +5k
            </div>
          </div>
          <p className="text-primary font-medium text-sm tracking-tighter">TRUSTED BY 5,000+ PLAYERS</p>
        </div>

      </div>
    </section>
  );
}