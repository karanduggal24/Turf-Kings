'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/venue/ImageUpload';
import VenueBasicInfo from './form/VenueBasicInfo';
import VenueSportSelector from './form/VenueSportSelector';
import VenueLocationFields from './form/VenueLocationFields';
import VenueAmenities from './form/VenueAmenities';
import Button from '@/components/common/Button';

interface VenueFormProps {
  userId: string;
}

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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d\s+-]/g, '');
    setFormData((prev) => ({ ...prev, phone: cleaned }));
    if (validationErrors.phone) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleSportChange = (sport: string) => {
    setFormData((prev) => ({ ...prev, sportType: sport as any }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, images }));
    if (validationErrors.images) {
      setValidationErrors((prev) => {
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

      router.push(`/list-venue/success?id=${data.turf.id}`);
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

        <VenueBasicInfo
          name={formData.name}
          description={formData.description}
          errors={validationErrors}
          onChange={handleInputChange}
        />

        <VenueSportSelector selectedSport={formData.sportType} onSportChange={handleSportChange} />

        <VenueLocationFields
          location={formData.location}
          city={formData.city}
          state={formData.state}
          phone={formData.phone}
          pricePerHour={formData.pricePerHour}
          errors={validationErrors}
          onChange={handleInputChange}
          onPhoneChange={handlePhoneChange}
        />

        <VenueAmenities selectedAmenities={formData.amenities} onAmenityToggle={handleAmenityToggle} />

        <div className="space-y-2">
          <ImageUpload images={formData.images} onImagesChange={handleImagesChange} />
          {validationErrors.images && <p className="text-red-500 text-xs mt-1">{validationErrors.images}</p>}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-primary/10">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="ghost"
            icon="arrow_back"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            icon="arrow_forward"
            size="lg"
            className="uppercase tracking-wider shadow-[0_0_20px_rgba(51,242,13,0.3)]"
          >
            List Venue
          </Button>
        </div>
      </form>
    </div>
  );
}
