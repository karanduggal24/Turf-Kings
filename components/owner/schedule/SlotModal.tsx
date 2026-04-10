'use client';

import { fmt12, endTime } from '@/hooks/useOwnerSchedule';

interface SlotModalProps {
  slot: string;
  mode: 'block' | 'manual';
  customerName: string;
  customerPhone: string;
  notes: string;
  saving: boolean;
  onModeChange: (mode: 'block' | 'manual') => void;
  onCustomerNameChange: (v: string) => void;
  onCustomerPhoneChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function SlotModal({
  slot, mode, customerName, customerPhone, notes, saving,
  onModeChange, onCustomerNameChange, onCustomerPhoneChange, onNotesChange,
  onSave, onClose,
}: SlotModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-dark border border-primary/20 rounded-2xl p-6 w-full max-w-md space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {fmt12(slot)} – {fmt12(endTime(slot))}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-primary/20">
          {(['block', 'manual'] as const).map(m => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
                mode === m ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {m === 'block' ? '🚫 Block Slot' : '📋 Manual Booking'}
            </button>
          ))}
        </div>

        {mode === 'manual' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={e => onCustomerNameChange(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 rounded-lg bg-black/40 border border-primary/20 text-white outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => onCustomerPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="mt-1 w-full px-4 py-2.5 rounded-lg bg-black/40 border border-primary/20 text-white outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="10-digit number"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => onNotesChange(e.target.value)}
            rows={2}
            className="mt-1 w-full px-4 py-2.5 rounded-lg bg-black/40 border border-primary/20 text-white outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            placeholder="e.g. Maintenance, private event..."
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || (mode === 'manual' && !customerName.trim())}
            className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : mode === 'block' ? 'Block Slot' : 'Add Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
