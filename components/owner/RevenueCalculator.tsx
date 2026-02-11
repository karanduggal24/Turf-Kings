'use client';

import { useState } from 'react';

export default function RevenueCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [pricePerHour, setPricePerHour] = useState(500);

  // Calculate monthly revenue
  const monthlyRevenue = hoursPerDay * pricePerHour * 30;

  // Handle manual input for hours
  const handleHoursChange = (value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 1 && num <= 24) {
      setHoursPerDay(num);
    } else if (num > 24) {
      setHoursPerDay(24);
    } else if (value === '') {
      setHoursPerDay(1);
    }
  };

  // Handle manual input for price
  const handlePriceChange = (value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 0 && num <= 3000) {
      setPricePerHour(num);
    } else if (num > 3000) {
      setPricePerHour(3000);
    } else if (value === '') {
      setPricePerHour(0);
    }
  };

  return (
    <section className="py-24 bg-black" id="calculator">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-dark border-2 border-primary/30 rounded-4xl overflow-hidden shadow-2xl">
          <div className="p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tight text-white">
                Revenue <span className="text-primary">Calculator</span>
              </h2>
              <p className="text-gray-400">Estimate how much your facility could earn per month</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-10">
                {/* Input 1 - Hours */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end gap-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      Hours Booked Per Day
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={hoursPerDay}
                        onChange={(e) => handleHoursChange(e.target.value)}
                        className="w-20 bg-black/40 border border-primary/30 rounded-lg px-3 py-1 text-white text-center text-xl font-black focus:outline-none focus:border-primary"
                      />
                      <span className="text-xs text-primary font-bold">HRS</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Input 2 - Price */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end gap-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      Average Price Per Hour
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-white">₹</span>
                      <input
                        type="number"
                        min="0"
                        max="3000"
                        value={pricePerHour}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-24 bg-black/40 border border-primary/30 rounded-lg px-3 py-1 text-white text-center text-xl font-black focus:outline-none focus:border-primary"
                      />
                      <span className="text-xs text-primary font-bold">INR</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="bg-black/50 border border-primary/20 rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-3xl"></div>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Estimated Monthly Revenue
                </h4>
                <div className="text-6xl lg:text-7xl font-black text-primary italic tracking-tighter mb-4">
                  ₹{monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  *Based on 30 days of operation at selected rates
                </p>
                <button className="mt-8 w-full bg-primary py-4 rounded-xl text-black font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                  <a href="/list-venue" className="block">
                    Claim My Territory
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
