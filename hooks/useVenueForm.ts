import { useState, useEffect } from 'react';

interface TurfData {
  id: string;
  name: string;
  sportType: string;
  pricePerHour: string;
}

interface VenueFormData {
  name: string;
  description: string;
  location: string;
  city: string;
  state: string;
  phone: string;
  amenities: string[];
  images: string[];
}

interface UseVenueFormProps {
  initialData?: Partial<VenueFormData>;
  initialTurfs?: TurfData[];
}

export function useVenueForm({ initialData, initialTurfs }: UseVenueFormProps = {}) {
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    description: '',
    location: '',
    city: '',
    state: '',
    phone: '',
    amenities: [],
    images: [],
    ...initialData,
  });

  const [turfs, setTurfs] = useState<TurfData[]>(
    initialTurfs || [{
      id: crypto.randomUUID(),
      name: '',
      sportType: 'football',
      pricePerHour: '',
    }]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData(prev => ({ ...prev, amenities: newAmenities }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleAddTurf = () => {
    if (turfs.length >= 10) {
      return { success: false, message: 'You can add a maximum of 10 turfs per venue' };
    }
    setTurfs([...turfs, {
      id: crypto.randomUUID(),
      name: '',
      sportType: 'football',
      pricePerHour: '',
    }]);
    return { success: true };
  };

  const handleRemoveTurf = (id: string) => {
    if (turfs.length === 1) {
      return { success: false, message: 'At least one turf is required' };
    }
    setTurfs(turfs.filter(t => t.id !== id));
    return { success: true };
  };

  const handleUpdateTurf = (id: string, field: keyof TurfData, value: string) => {
    setTurfs(turfs.map(t => t.id === id ? { ...t, [field]: value } : t));
    const turfIndex = turfs.findIndex(t => t.id === id);
    if (turfIndex !== -1) {
      const errorKey = `turf_${turfIndex}_${field === 'name' ? 'name' : field === 'pricePerHour' ? 'price' : field}`;
      if (errors[errorKey]) {
        setErrors(prev => ({ ...prev, [errorKey]: '' }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Venue name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (turfs.length === 0) {
      newErrors.turfs = 'At least one turf is required';
    }

    turfs.forEach((turf, index) => {
      if (!turf.name.trim()) {
        newErrors[`turf_${index}_name`] = 'Turf name is required';
      }
      const price = parseFloat(turf.pricePerHour);
      if (isNaN(price) || price <= 0 || price > 100000) {
        newErrors[`turf_${index}_price`] = 'Price must be between ₹1 and ₹100,000';
      }
    });

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    turfs,
    errors,
    setFormData,
    setTurfs,
    setErrors,
    handleInputChange,
    handlePhoneChange,
    handleAmenityToggle,
    handleImagesChange,
    handleAddTurf,
    handleRemoveTurf,
    handleUpdateTurf,
    validateForm,
  };
}
