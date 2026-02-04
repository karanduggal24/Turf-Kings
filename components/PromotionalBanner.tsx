export default function PromotionalBanner() {
  const avatarUrls = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCAY2PkBckVjfEMnV4zmrlNZSGRSKOwTDlDkZuc6WiGK3RaqF6Map8Po3TRtDGd3DLMaWBTiFO4vfHSNjFg3SccHD3ZVZz_X6ogXXQyEc4H15b0ZY4tNxhWEQjZM6ISBX0EPHmpGIElhgAOftA9WhgXIzw84HHtGVGE_DNBAmpjGre46rhLEPm46rACCNB22STsrTz8c0ovNENLT8Byr_PyhiA71dU_NjwCuM0AnFFFkNPPer6zcZpn8ZMRUefjvbH746ji-CVCv3Y",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA48tas4UtLbovLPoKuZWhPny0ToLJdbPfuH08PNdQm0aFQrw6tMOzQgFJ0R9uiNoU3FVsYuWcVfzaArEj2kHwTddltRlwWR_bthwAvGZEeIABfeq2INezMddINjtgJR_UkPhVqbM_tWJ0ZQf82UYko5nuWDroF--X0FMtmaaxv0Ech2bH157I8IXMyuYxZ8ZrDvZr-B07UWqLtWtYNAGNCqXClChDnQLrLHUvLqWrfR2fxVd5d4yP0aTH2ezMRaoJ41qMKrUZw60I",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA8sXHN7dUcxlla-PMOsMdXwTDPmAYT2gAnOC2-vZ0xSZRVePsMTe8aNcjesRJVACOfdb4abf9il45Or5Pj1a493ehEKI4GOY8uYsjLxS0UMMWTBJjA-jHVv9jgb0RnIjIx9vITGjcxd0Fr5e1rcpeHhYeSkJHNmr0zpN_KS1EnML8-TiPVVPdQByRdVkTFTGtdgIKTRQo_k4xK1drgIC-azKccL93rDQ5OrbdRcHu_9NtZGv7iAFG1CJFs2zYixZBkZp1TUQDCuSI"
  ];

  return (
    <section className="py-16 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 neon-glow">
        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Join the League</h2>
          <p className="text-gray-300 max-w-md text-lg leading-relaxed">
            Sign up now and get 20% off your first 3 bookings. Host tournaments and track your stats.
          </p>
          <button className="mt-6 bg-primary text-black hover:bg-primary-hover px-8 py-4 rounded-2xl font-bold transition-all duration-300 inline-flex items-center gap-3 text-lg neon-glow-hover">
            Get Started 
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-primary/30 to-transparent pointer-events-none"></div>
        
        <div className="flex -space-x-4 z-10">
          {avatarUrls.map((url, index) => (
            <img 
              key={index}
              alt={`Player avatar ${index + 1}`}
              className="w-16 h-16 rounded-full border-4 border-black shadow-lg" 
              src={url}
            />
          ))}
          <div className="w-16 h-16 rounded-full border-4 border-black bg-surface-dark flex items-center justify-center text-sm font-bold text-primary shadow-lg">
            +2k
          </div>
        </div>
      </div>
    </section>
  );
}