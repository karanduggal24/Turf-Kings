'use client';

import ImageUpload from '../ImageUpload';

interface VenueImagesSectionProps {
  images: string[];
  errors: Record<string, string>;
  onImagesChange: (images: string[]) => void;
}

export default function VenueImagesSection({
  images,
  errors,
  onImagesChange,
}: VenueImagesSectionProps) {
  return (
    <div>
      <ImageUpload
        images={images}
        onImagesChange={onImagesChange}
      />
      {errors.images && (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{errors.images}</span>
        </div>
      )}
    </div>
  );
}
