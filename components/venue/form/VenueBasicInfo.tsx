'use client';

interface VenueBasicInfoProps {
  name: string;
  description: string;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function VenueBasicInfo({ name, description, errors, onChange }: VenueBasicInfoProps) {
  return (
    <>
      {/* Venue Name */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-200" htmlFor="name">
          Venue Name <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
            errors.name ? 'border-red-500' : 'border-primary/20'
          } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
          placeholder="e.g. Champions Arena Turf"
          required
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-200" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white resize-none"
          placeholder="Describe your venue..."
        />
      </div>
    </>
  );
}
