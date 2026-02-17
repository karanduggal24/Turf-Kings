import { VenueDetailsSectionProps } from './booking-types';

export default function VenueDetailsSection({
  turfName,
  venueName,
  location,
  city,
  state,
  phone,
}: VenueDetailsSectionProps & { venueName?: string }) {
  return (
    <section className="bg-white/5 border border-primary/10 rounded-xl p-6 print-section print-break-avoid">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-primary print-primary">stadium</span>
        <h3 className="font-bold text-lg text-white print-text">Venue Details</h3>
      </div>
      <div className="space-y-4">
        {venueName && (
          <div>
            <p className="text-gray-400 text-sm print-text-gray">Venue Name</p>
            <p className="font-medium text-white print-text">{venueName}</p>
          </div>
        )}
        <div>
          <p className="text-gray-400 text-sm print-text-gray">Turf/Pitch</p>
          <p className="font-medium text-white print-text">{turfName}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm print-text-gray">Address</p>
          <p className="font-medium text-sm text-white print-text">
            {location}, {city}, {state}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${location}, ${city}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary text-sm font-semibold mt-2 hover:underline no-print"
          >
            <span className="material-symbols-outlined text-sm mr-1">near_me</span>
            Get Directions
          </a>
        </div>
        <div>
          <p className="text-gray-400 text-sm print-text-gray">Contact</p>
          <p className="font-medium text-white print-text">{phone}</p>
        </div>
      </div>
    </section>
  );
}
