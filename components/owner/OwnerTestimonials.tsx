'use client';

export default function OwnerTestimonials() {
  return (
    <section className="py-24 border-y border-primary/10 bg-surface-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3 text-center lg:text-left">
            <h2 className="text-4xl font-black mb-6 uppercase italic tracking-tighter text-white">
              From <span className="text-primary">Our Owners</span>
            </h2>
            <p className="text-gray-400">
              Real stories from entrepreneurs who built successful sports venues with TurfKings.
            </p>
          </div>

          <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
            <div className="bg-surface-dark border border-primary/5 p-8 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-800 shrink-0">
                  <img
                    alt="Owner Portrait"
                    className="w-full h-full rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlJP750HoqfaQWtF9qr4qitHfQsL_fl5EoAEqlHdJd-BrERIvTZUcmaKCU_GiQVXQn6mjcExXkGlPWrRaM3shmYnk1s7Sechhv6JinjnQLBJg53ItVeEVu8idCQ_BSCg-XcypO0wK5tFONJTqAGzBzkTsSK6H3UgfwCSahEEl6Bx6Qx2j6hPX0C8uIiE9UgjRCQkj3g8BK1bQMZfJa1jSpc9Ay2CEe9kukJNX5WFQL3YY-KtIHOWfw-GMq9cbTTIkh8eHaUtGhTZQ"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-white">Rajesh Kumar</h5>
                  <p className="text-xs text-primary font-semibold uppercase tracking-widest">
                    Mumbai Sports Arena
                  </p>
                </div>
              </div>
              <p className="text-gray-300 italic font-light leading-relaxed">
                "Before TurfKings, I was managing bookings via WhatsApp and spreadsheets. I lost hours every day. Now, everything is on autopilot. My revenue jumped by 40% in the first quarter alone."
              </p>
            </div>

            <div className="bg-surface-dark border border-primary/5 p-8 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-800 shrink-0">
                  <img
                    alt="Owner Portrait"
                    className="w-full h-full rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2yOvTp8xATz21hfyKhxvcqEqE58FnmSbaCXPlrc3NHOe5zzvARzPiyQ3h2uTFywrWC59pokGxIDAEk4njJqvwxZGyvCOyRRVITz9o61M1WpeSbD2tIYR0I7BjcOLhrTTxE1o9zlBNyzVjnOBX-nU7ZthqygyWrPFSu_TjSbxHffreoS0g6sqwF6P3fzT2tWQ8GemD2hyoP4cilthbnJs3dwBZ_O9U-GADQ1nnvOGHkd6840-wBuAwsngr11FrhoOs0Gn3516Sxtc"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-white">Priya Sharma</h5>
                  <p className="text-xs text-primary font-semibold uppercase tracking-widest">
                    Delhi Cricket Club
                  </p>
                </div>
              </div>
              <p className="text-gray-300 italic font-light leading-relaxed">
                "The automated payment feature changed the game for us. No more chasing payments or late cancellations. The platform pays for itself ten times over."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
