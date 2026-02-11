'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/venue/ImageUpload';

interface VenueFormProps {
  userId: string;
}

const SPORTS = [
  { id: 'cricket', label: 'Cricket', icon: 'sports_cricket' },
  { id: 'football', label: 'Football', icon: 'sports_soccer' },
  { id: 'badminton', label: 'Badminton', icon: 'sports_tennis' },
  { id: 'multi', label: 'Multi-Sport', icon: 'sports_kabaddi' },
];

const AMENITIES = [
  { id: 'washroom', label: 'Washroom', icon: 'wc' },
  { id: 'parking', label: 'Parking', icon: 'local_parking' },
  { id: 'floodlights', label: 'Floodlights', icon: 'lightbulb' },
  { id: 'changing_room', label: 'Changing Room', icon: 'checkroom' },
  { id: 'drinking_water', label: 'Drinking Water', icon: 'water_drop' },
];

export default function VenueForm({ userId }: VenueFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    city: '',
    state: '',
    phone: '',
    pricePerHour: '',
    sportType: 'football' as 'cricket' | 'football' | 'badminton' | 'multi',
    amenities: [] as string[],
    images: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSportChange = (sport: string) => {
    setFormData(prev => ({ ...prev, sportType: sport as any }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.location || !formData.city || !formData.state || !formData.pricePerHour || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.images.length < 1) {
        throw new Error('Please upload at least 1 image');
      }

      const response = await fetch('/api/turfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price_per_hour: parseFloat(formData.pricePerHour),
          sport_type: formData.sportType,
          owner_id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create venue');
      }

      // Redirect to success page or turf detail
      router.push(`/turfs/${data.turf.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-dark/50 border border-primary/10 rounded-xl shadow-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Venue Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-200" htmlFor="name">
            Venue Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white"
            placeholder="e.g. Champions Arena Turf"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-200" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white resize-none"
            placeholder="Describe your venue..."
          />
        </div>

        {/* Sports Offered */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-200">
            Sport Type <span className="text-primary">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SPORTS.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={() => handleSportChange(sport.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  formData.sportType === sport.id
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-dark hover:border-primary/50'
                }`}
              >
                <span className={`material-symbols-outlined mb-2 text-2xl ${
                  formData.sportType === sport.id ? 'text-primary' : 'text-gray-400'
                }`}>
                  {sport.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  {sport.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-200" htmlFor="location">
              Address <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white"
              placeholder="e.g. Sector 21, Near Mall"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-200" htmlFor="city">
              City <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white"
              placeholder="e.g. Mumbai"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-200" htmlFor="state">
              State <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white"
              placeholder="e.g. Maharashtra"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-200" htmlFor="phone">
              Contact Phone <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white"
              placeholder="e.g. +91 98765 43210"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-200" htmlFor="pricePerHour">
              Price Per Hour (₹) <span className="text-primary">*</span>
            </label>
            <input
              type="number"
              id="pricePerHour"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white"
              placeholder="e.g. 1500"
              required
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-200">
            Amenities Available
          </label>
          <div className="flex flex-wrap gap-3">
            {AMENITIES.map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => handleAmenityToggle(amenity.id)}
                className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 transition-all ${
                  formData.amenities.includes(amenity.id)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-primary/20 text-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-base">{amenity.icon}</span>
                {amenity.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <ImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-primary/10">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 rounded-lg bg-primary text-black font-black hover:shadow-[0_0_20px_rgba(51,242,13,0.3)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {loading ? 'Submitting...' : 'List Venue'}
            {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
