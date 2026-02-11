'use client';

export default function OwnerFeatures() {
  return (
    <section className="py-24 bg-surface-dark/30" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter italic leading-tight text-white">
              Elite Tools for <br/>
              <span className="text-primary">Venue Management</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded bg-primary shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-black font-bold">check</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-white">Admin Dashboard</h4>
                  <p className="text-gray-400 font-light">
                    Get a bird's-eye view of your entire operation, from staff rosters to financial reports.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded bg-primary shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-black font-bold">check</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-white">Automated Payments</h4>
                  <p className="text-gray-400 font-light">
                    Secure escrow system ensures you get paid even if customers are a no-show.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded bg-primary shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-black font-bold">check</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-white">24/7 Expert Support</h4>
                  <p className="text-gray-400 font-light">
                    Our dedicated account managers are available around the clock to assist your venue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-4 lg:p-8">
              <img
                alt="Dashboard Preview"
                className="rounded-xl shadow-2xl border border-primary/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBsNSn6dd-jewfSGj6qURC_qtE0xiqD7bKzIBPlqCYmMz1tnlp0q9ByuMgVl98pyOPZNfq2NPYer5ItF7iTZY-xh6HtwHA-Wc_gbdD7yFkZi7vU8EI8qRj6R1AwDhE-sS5423K3tXtyJjCkkuBaDAJbx7OX2sBS2JK2BUmJhd5MKaG2knOgkFV4SVUhnHpa5Gy7lqy95foECH28ZtUb3pND8ODkyaSMFRoMW7JzJfHJOfsUWygVpGqKCnOtaZeZtFe2qiqtJgaKNw"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-black p-6 rounded-2xl shadow-xl">
                <p className="text-3xl font-black italic">98%</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Higher Retention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
