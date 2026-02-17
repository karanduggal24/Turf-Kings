'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVenueForm } from '@/hooks/useVenueForm';
import VenueBasicInfoSection from './form/VenueBasicInfoSection';
import VenueLocationSection from './form/VenueLocationSection';
import VenueImagesSection from './form/VenueImagesSection';
import VenueAmenities from './form/VenueAmenities';
import TurfsList from './form/TurfsList';
import Button from '@/components/common/Button';

interface VenueFormProps {
  userId: string;
}

export default function VenueFormNew({ userId }: VenueFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const {
    formData,
    turfs,
    errors,
    handleInputChange,
    handlePhoneChange,
    handleAmenityToggle,
    handleImagesChange,
    handleAddTurf,
    handleRemoveTurf,
    handleUpdateTurf,
    validateForm,
  } = useVenueForm();

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      const stepErrors: Record<string, string> = {};
      if (!formData.name.trim()) stepErrors.name = 'Venue name is required';
      if (!formData.location.trim()) stepErrors.location = 'Address is required';
      if (!formData.city.trim()) stepErrors.city = 'City is required';
      if (!formData.state.trim()) stepErrors.state = 'State is required';
      if (formData.phone.replace(/\D/g, '').length !== 10) stepErrors.phone = 'Phone number must be exactly 10 digits';
      if (formData.images.length === 0) stepErrors.images = 'At least one image is required';
      return Object.keys(stepErrors).length === 0;
    }
    return validateForm();
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venue: { ...formData, owner_id: userId },
          turfs: turfs.map(t => ({
            name: t.name,
            sport_type: t.sportType,
            price_per_hour: parseFloat(t.pricePerHour),
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create venue');

      router.push(`/list-venue/success?id=${data.venue.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-dark/50 border border-primary/10 rounded-xl shadow-xl p-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                step >= s ? 'border-primary bg-primary/10 text-primary' : 'border-surface-highlight text-gray-500'
              }`}>
                {step > s ? <span className="material-symbols-outlined text-lg">check</span> : <span className="font-bold">{s}</span>}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-primary' : 'bg-surface-highlight'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span className={step >= 1 ? 'text-primary font-medium' : 'text-gray-500'}>Venue Info</span>
          <span className={step >= 2 ? 'text-primary font-medium' : 'text-gray-500'}>Add Turfs</span>
          <span className={step >= 3 ? 'text-primary font-medium' : 'text-gray-500'}>Review</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500 text-sm mb-6">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <VenueBasicInfoSection name={formData.name} description={formData.description} errors={errors} onChange={handleInputChange} />
          <VenueLocationSection location={formData.location} city={formData.city} state={formData.state} phone={formData.phone} errors={errors} onChange={handleInputChange} onPhoneChange={handlePhoneChange} />
          <VenueAmenities selectedAmenities={formData.amenities} onAmenityToggle={handleAmenityToggle} />
          <VenueImagesSection images={formData.images} errors={errors} onImagesChange={handleImagesChange} />
        </div>
      )}

      {step === 2 && (
        <TurfsList turfs={turfs} onAddTurf={handleAddTurf} onRemoveTurf={handleRemoveTurf} onUpdateTurf={handleUpdateTurf} errors={errors} />
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-surface-dark border border-surface-highlight rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Venue Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400">Name:</span><p className="font-medium">{formData.name}</p></div>
              <div><span className="text-gray-400">Phone:</span><p className="font-medium">{formData.phone}</p></div>
              <div className="col-span-2"><span className="text-gray-400">Address:</span><p className="font-medium">{formData.location}, {formData.city}, {formData.state}</p></div>
              <div className="col-span-2"><span className="text-gray-400">Amenities:</span><p className="font-medium">{formData.amenities.join(', ') || 'None'}</p></div>
              <div className="col-span-2"><span className="text-gray-400">Images:</span><p className="font-medium">{formData.images.length} uploaded</p></div>
            </div>
          </div>
          <div className="bg-surface-dark border border-surface-highlight rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Turfs ({turfs.length})</h3>
            <div className="space-y-3">
              {turfs.map((turf, index) => (
                <div key={turf.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">#{index + 1}</span>
                    <div><p className="font-medium">{turf.name}</p><p className="text-sm text-gray-400 capitalize">{turf.sportType}</p></div>
                  </div>
                  <p className="font-bold text-primary">₹{turf.pricePerHour}/hr</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-primary/10 mt-8">
        <Button type="button" onClick={step === 1 ? () => router.back() : handleBack} variant="ghost" icon="arrow_back">
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={handleNext} icon="arrow_forward" size="lg" className="uppercase tracking-wider">Next</Button>
        ) : (
          <Button type="button" onClick={handleSubmit} loading={loading} icon="check" size="lg" className="uppercase tracking-wider shadow-[0_0_20px_rgba(51,242,13,0.3)]">Submit Venue</Button>
        )}
      </div>
    </div>
  );
}
