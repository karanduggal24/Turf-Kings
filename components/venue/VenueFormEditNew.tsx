'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVenueForm } from '@/hooks/useVenueForm';
import VenueBasicInfoSection from './form/VenueBasicInfoSection';
import VenueLocationSection from './form/VenueLocationSection';
import VenueAmenities from './form/VenueAmenities';
import VenueImagesSection from './form/VenueImagesSection';
import TurfsList from './form/TurfsList';
import Button from '@/components/common/Button';
import AlertModal from '@/components/common/AlertModal';
import { adminApi } from '@/lib/api';

interface VenueFormEditNewProps {
  venue: any;
  redirectTo?: string;
}

export default function VenueFormEditNew({ venue, redirectTo = '/admin/venues' }: VenueFormEditNewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const {
    formData,
    turfs,
    errors,
    setFormData,
    setTurfs,
    handleInputChange,
    handlePhoneChange,
    handleAmenityToggle,
    handleImagesChange,
    handleAddTurf,
    handleRemoveTurf,
    handleUpdateTurf,
    validateForm,
  } = useVenueForm();

  // Initialize form with venue data
  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || '',
        description: venue.description || '',
        location: venue.location || '',
        city: venue.city || '',
        state: venue.state || '',
        phone: venue.phone || '',
        amenities: venue.amenities || [],
        images: venue.images || [],
      });

      if (venue.turfs && venue.turfs.length > 0) {
        setTurfs(venue.turfs.map((t: any) => ({
          id: t.id || crypto.randomUUID(),
          name: t.name || '',
          sportType: t.sport_type || 'football',
          pricePerHour: t.price_per_hour ? t.price_per_hour.toString() : '',
          openTime: t.open_time || '06:00',
          closeTime: t.close_time || '22:00',
        })));
      }
    }
  }, [venue, setFormData, setTurfs]);

  const onAddTurf = () => {
    const result = handleAddTurf();
    if (!result.success) {
      setAlertModal({
        isOpen: true,
        title: 'Maximum Limit Reached',
        message: result.message || 'Cannot add more turfs',
        type: 'warning'
      });
    }
  };

  const onRemoveTurf = (id: string) => {
    const result = handleRemoveTurf(id);
    if (!result.success) {
      setAlertModal({
        isOpen: true,
        title: 'Cannot Remove',
        message: result.message || 'Cannot remove turf',
        type: 'warning'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertModal({
        isOpen: true,
        title: 'Validation Error',
        message: 'Please fix the errors in the form before submitting',
        type: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      await adminApi.updateVenueById(venue.id, {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        phone: formData.phone,
        amenities: formData.amenities,
        images: formData.images,
      });

      const turfsForApi = turfs.map(t => ({
        id: t.id.length > 20 ? t.id : undefined,
        name: t.name,
        sport_type: t.sportType,
        price_per_hour: parseFloat(t.pricePerHour),
        open_time: t.openTime || '06:00',
        close_time: t.closeTime || '22:00',
      }));

      await adminApi.updateVenueTurfs(venue.id, turfsForApi);

      setAlertModal({ isOpen: true, title: 'Success', message: 'Venue updated successfully!', type: 'success' });
      setTimeout(() => router.push(redirectTo), 1500);
    } catch (error: any) {
      setAlertModal({ isOpen: true, title: 'Error', message: error.message || 'Failed to update venue. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-5xl">
        <div className="bg-white/5 border border-primary/10 rounded-2xl p-8 space-y-8">
          {/* Venue Information */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">location_city</span>
              Venue Information
            </h2>
            <div className="space-y-6">
              <VenueBasicInfoSection
                name={formData.name}
                description={formData.description}
                errors={errors}
                onChange={handleInputChange}
              />
              <VenueLocationSection
                location={formData.location}
                city={formData.city}
                state={formData.state}
                phone={formData.phone}
                errors={errors}
                onChange={handleInputChange}
                onPhoneChange={handlePhoneChange}
              />
            </div>
          </div>

          {/* Turfs */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">sports_soccer</span>
              Turfs
            </h2>
            <TurfsList 
              turfs={turfs}
              onAddTurf={onAddTurf}
              onRemoveTurf={onRemoveTurf}
              onUpdateTurf={handleUpdateTurf}
              errors={errors}
            />
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">star</span>
              Amenities
            </h2>
            <VenueAmenities
              selectedAmenities={formData.amenities}
              onAmenityToggle={handleAmenityToggle}
            />
          </div>

          {/* Images */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">photo_camera</span>
              Venue Images
            </h2>
            <VenueImagesSection
              images={formData.images}
              errors={errors}
              onImagesChange={handleImagesChange}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-primary/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(redirectTo)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              Update Venue
            </Button>
          </div>
        </div>
      </form>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  );
}
