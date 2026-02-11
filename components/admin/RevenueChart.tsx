'use client';

export default function RevenueChart() {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-8 rounded-2xl flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-xl font-bold text-white">Revenue Analytics</h4>
          <p className="text-sm text-gray-400">Net earnings compared to previous month</p>
        </div>
        <select className="bg-primary/5 border border-primary/20 text-xs font-bold text-gray-300 rounded-lg px-3 py-1.5 focus:ring-primary outline-none">
          <option>Last 30 Days</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex-1 relative flex items-end gap-2 px-2">
        {/* Mockup Bar Chart */}
        <div className="absolute inset-0 flex items-end justify-between pb-4 opacity-50">
          {[60, 40, 80, 55, 70, 95, 85].map((height, i) => (
            <div
              key={i}
              className={`w-full bg-gradient-to-t from-primary/20 to-transparent rounded-t-lg mx-1 ${
                i === 5 ? 'border-t-2 border-primary' : ''
              }`}
              style={{ height: `${height}%`, filter: i === 5 ? 'drop-shadow(0 0 8px rgba(51, 242, 13, 0.4))' : 'none' }}
            ></div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/5"></div>
        <div className="absolute inset-x-0 top-1/4 h-[1px] bg-white/5"></div>
        <div className="absolute inset-x-0 top-2/4 h-[1px] bg-white/5"></div>
        <div className="absolute inset-x-0 top-3/4 h-[1px] bg-white/5"></div>
      </div>
    </div>
  );
}
