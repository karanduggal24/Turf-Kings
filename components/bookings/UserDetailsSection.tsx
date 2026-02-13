import { UserDetailsSectionProps } from './booking-types';

export default function UserDetailsSection({
  fullName,
  email,
  phone,
}: UserDetailsSectionProps) {
  return (
    <section className="bg-white/5 border border-primary/10 rounded-xl p-6 print-section print-break-avoid">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-primary print-primary">person</span>
        <h3 className="font-bold text-lg text-white print-text">User Details</h3>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm print-text-gray">Customer Name</p>
          <p className="font-medium text-white print-text">{fullName}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm print-text-gray">Email</p>
          <p className="font-medium text-white print-text">{email}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm print-text-gray">Phone</p>
          <p className="font-medium text-white print-text">{phone || 'Not provided'}</p>
        </div>
      </div>
    </section>
  );
}
