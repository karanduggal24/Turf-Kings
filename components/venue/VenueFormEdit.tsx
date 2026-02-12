'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/venue/ImageUpload';

interface VenueFormEditProps {
  turf: any;
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

export default function VenueFormEdit({ turf }: VenueFormEditProps) {
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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize form with turf data
  useEffect(() => {
    if (turf) {
      setFormData({
        name: turf.name || '',
        description: turf.description || '',
        location: turf.location || '',
        city: turf.city || '',
        state: turf.state || '',
        phone: turf.phone || '',
        pricePerHour: turf.price_per_hour?.toString() || '',
        sportType: turf.sport_type || 'football',
        amenities: turf.amenities || [],
        images: turf.images || [],
      });
    }
  }, [turf]);

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const validatePrice = (price: string): boolean => {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) && numPrice > 0 && numPrice <= 100000;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Venue name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Venue name must be at least 3 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Venue name must be less than 100 characters';
    }

    if (!formData.location.trim()) {
      errors.location = 'Address is required';
    } else if (formData.location.trim().length < 5) {
      errors.location = 'Address must be at least 5 characters';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city)) {
      errors.city = 'City name should only contain letters';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.state)) {
      errors.state = 'State name should only contain letters';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Contact phone is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.pricePerHour) {
      errors.pricePerHour = 'Price per hour is required';
    } else if (!validatePrice(formData.pricePerHour)) {
      errors.pricePerHour = 'Price must be between ₹1 and ₹100,000';
    }

    if (formData.images.length < 1) {
      errors.images = 'Please upload at least 1 image';
    } else if (formData.images.length > 10) {
      errors.images = 'Maximum 10 images allowed';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d\s+-]/g, '');
    setFormData(prev => ({ ...prev, phone: cleaned }));
    if (validationErrors.phone) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
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
    if (validationErrors.images) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/turfs/${turf.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          price_per_hour: parseFloat(formData.pricePerHour),
          sport_type: formData.sportType,
          amenities: formData.amenities,
          images: formData.images,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update venue');
      }

      // Redirect back to venues page
      router.push('/admin/venues');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-primary/10 rounded-xl shadow-xl p-8">
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
            className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
              validationErrors.name ? 'border-red-500' : 'border-primary/20'
            } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
            placeholder="e.g. Champions Arena Turf"
            required
          />
          {validationErrors.name && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
          )}
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
              className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
                validationErrors.location ? 'border-red-500' : 'border-primary/20'
              } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
              placeholder="e.g. Sector 21, Near Mall"
              required
            />
            {validationErrors.location && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
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
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
                validationErrors.city ? 'border-red-500' : 'border-primary/20'
              } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
              placeholder="e.g. Mumbai"
              required
            />
            {validationErrors.city && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
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
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
                validationErrors.state ? 'border-red-500' : 'border-primary/20'
              } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
              placeholder="e.g. Maharashtra"
              required
            />
            {validationErrors.state && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.state}</p>
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
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={15}
              className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
                validationErrors.phone ? 'border-red-500' : 'border-primary/20'
              } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
              placeholder="e.g. +91 98765 43210"
              required
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
            )}
            <p className="text-gray-500 text-xs">Enter 10-digit phone number</p>
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
              min="1"
              max="100000"
              step="1"
              className={`w-full px-4 py-3 rounded-lg bg-black/40 border ${
                validationErrors.pricePerHour ? 'border-red-500' : 'border-primary/20'
              } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white`}
              placeholder="e.g. 1500"
              required
            />
            {validationErrors.pricePerHour && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.pricePerHour}</p>
            )}
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
        <div className="space-y-2">
          <ImageUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
          />
          {validationErrors.images && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.images}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-primary/10">
          <button
            type="button"
            onClick={() => router.push('/admin/venues')}
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
            {loading ? 'Updating...' : 'Update Venue'}
            {!loading && <span className="material-symbols-outlined">check</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
