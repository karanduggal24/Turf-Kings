'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setError('');
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-200">
        Venue Gallery <span className="text-primary">*</span>
      </label>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center bg-black/20 hover:border-primary/60 hover:bg-primary/5 transition-all group cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-primary text-3xl">
            {uploading ? 'hourglass_empty' : 'cloud_upload'}
          </span>
        </div>
        
        <p className="text-white font-bold">
          {uploading ? 'Uploading...' : 'Drag & drop photos here'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          or click to browse from your computer
        </p>
        <p className="text-primary/70 text-xs mt-4 font-medium uppercase tracking-widest">
          Minimum 1 high-quality photo required
        </p>
      </div>

      {/* Preview Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/20 group">
              <img
                src={url}
                alt={`Venue ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute top-1 right-1 bg-black/80 rounded-full p-1 text-white hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
          
          {/* Add More Button */}
          {images.length < 10 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border border-primary/10 bg-black/40 flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <span className="material-symbols-outlined text-gray-400 text-3xl">add_photo_alternate</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
