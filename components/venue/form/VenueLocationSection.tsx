'use client';

interface VenueLocationSectionProps {
  location: string;
  city: string;
  state: string;
  phone: string;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VenueLocationSection({
  location,
  city,
  state,
  phone,
  errors,
  onChange,
  onPhoneChange,
}: VenueLocationSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-200" htmlFor="location">
          Address <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
            errors.location ? 'border-red-500 ring-2 ring-red-500/20' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. Sector 21, Near Mall"
        />
        {errors.location && (
          <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errors.location}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-200" htmlFor="city">
          City <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={city}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
            errors.city ? 'border-red-500 ring-2 ring-red-500/20' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. Mumbai"
        />
        {errors.city && (
          <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errors.city}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-200" htmlFor="state">
          State <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={state}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
            errors.state ? 'border-red-500 ring-2 ring-red-500/20' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. Maharashtra"
        />
        {errors.state && (
          <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errors.state}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-200" htmlFor="phone">
          Contact Phone <span className="text-primary">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={onPhoneChange}
          maxLength={10}
          className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
            errors.phone ? 'border-red-500 ring-2 ring-red-500/20' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. 9876543210"
        />
        {errors.phone ? (
          <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errors.phone}</span>
          </div>
        ) : (
          <p className="text-gray-500 text-xs">Enter 10-digit phone number</p>
        )}
      </div>
    </div>
  );
}
