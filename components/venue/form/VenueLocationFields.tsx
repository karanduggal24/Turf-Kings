'use client';

interface VenueLocationFieldsProps {
  location: string;
  city: string;
  state: string;
  phone: string;
  pricePerHour: string;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hidePrice?: boolean;
}

export default function VenueLocationFields({
  location,
  city,
  state,
  phone,
  pricePerHour,
  errors,
  onChange,
  onPhoneChange,
  hidePrice = false,
}: VenueLocationFieldsProps) {
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
            errors.location ? 'border-red-500' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. Sector 21, Near Mall"
          required
        />
        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
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
            errors.city ? 'border-red-500' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. Mumbai"
          required
        />
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
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
            errors.state ? 'border-red-500' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. Maharashtra"
          required
        />
        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
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
            errors.phone ? 'border-red-500' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. 9876543210"
          required
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        <p className="text-gray-500 text-xs">Enter 10-digit phone number</p>
      </div>

      {!hidePrice && (
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-200" htmlFor="pricePerHour">
            Price Per Hour (₹) <span className="text-primary">*</span>
          </label>
          <input
            type="number"
            id="pricePerHour"
            name="pricePerHour"
            value={pricePerHour}
            onChange={onChange}
            onWheel={(e) => e.currentTarget.blur()}
            min="1"
            max="100000"
            step="1"
            className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
              errors.pricePerHour ? 'border-red-500' : 'border-primary/20'
            } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
            placeholder="e.g. 1500"
            required
          />
          {errors.pricePerHour && <p className="text-red-500 text-xs mt-1">{errors.pricePerHour}</p>}
        </div>
      )}
    </div>
  );
}
