'use client';

import { useState } from 'react';
import { useOwnerSchedule, Block, Booking } from '@/hooks/useOwnerSchedule';
import SlotModal from '@/components/owner/schedule/SlotModal';
import AlertModal from '@/components/common/AlertModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import Dropdown from '@/components/common/Dropdown';
import DateSelector from '@/components/DateSelector';

const LEGEND = [
  { color: 'bg-white/5 border-white/10', label: 'Available' },
  { color: 'bg-primary/10 border-primary/30', label: 'Booked' },
  { color: 'bg-red-500/10 border-red-500/30', label: 'Blocked' },
  { color: 'bg-blue-500/10 border-blue-500/30', label: 'Walk-in' },
  { color: 'bg-black/20 border-white/5 opacity-40', label: 'Past' },
];

export default function OwnerScheduleClient() {
  const {
    turfs, selectedTurf, setSelectedTurf,
    selectedDate, setSelectedDate,
    loadingSchedule, saving,
    timeSlots, isSlotPast, getSlotStatus, isDayFullyBlocked,
    createBlock, deleteBlock, blockDay, unblockDay,
    alert, setAlert,
    endTime, fmt12,
  } = useOwnerSchedule();

  const [modal, setModal] = useState<{
    open: boolean; slot: string; mode: 'block' | 'manual';
    customerName: string; customerPhone: string; notes: string;
  }>({ open: false, slot: '', mode: 'block', customerName: '', customerPhone: '', notes: '' });

  const [unblockTarget, setUnblockTarget] = useState<Block | null>(null);

  const turfOptions = turfs.map(t => ({ value: t.id, label: `${t.venue_name} — ${t.name}` }));

  const openModal = (slot: string) => {
    if (getSlotStatus(slot)) return;
    setModal({ open: true, slot, mode: 'block', customerName: '', customerPhone: '', notes: '' });
  };

  const handleSave = async () => {
    if (!selectedTurf) return;
    await createBlock({
      turf_id: selectedTurf.id,
      venue_id: selectedTurf.venue_id,
      block_date: selectedDate,
      start_time: modal.slot,
      end_time: endTime(modal.slot),
      block_type: modal.mode === 'manual' ? 'manual_booking' : 'blocked',
      customer_name: modal.mode === 'manual' ? modal.customerName : null,
      customer_phone: modal.mode === 'manual' ? modal.customerPhone : null,
      notes: modal.notes || null,
    });
    setModal(m => ({ ...m, open: false }));
  };

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Schedule</h1>
        <p className="text-gray-400 mt-1">Block slots, manage availability, or add manual bookings</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        {turfOptions.length > 0 && (
          <Dropdown
            variant="select"
            options={turfOptions}
            value={selectedTurf?.id || ''}
            onChange={id => setSelectedTurf(turfs.find(t => t.id === id) || null)}
            label="Turf"
            className="sm:w-72"
          />
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-200">Date</label>
          <DateSelector valueStr={selectedDate} onChangeStr={setSelectedDate} placeholder="Select date" className="w-52" />
        </div>
        {selectedTurf && (
          isDayFullyBlocked ? (
            <button onClick={unblockDay} disabled={saving}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-base">lock_open</span>
              Unblock Day
            </button>
          ) : (
            <button onClick={blockDay} disabled={saving}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-base">block</span>
              Block Entire Day
            </button>
          )
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-medium">
        {LEGEND.map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded border ${l.color}`} />
            <span className="text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      {!selectedTurf ? (
        <div className="text-center py-16 text-gray-500">
          <span className="material-symbols-outlined text-5xl block mb-3 text-gray-600">sports_soccer</span>
          No turfs found. Add a venue first.
        </div>
      ) : loadingSchedule ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {timeSlots.map(s => <div key={s} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {timeSlots.map(slot => {
            const status = getSlotStatus(slot);
            const isPast = isSlotPast(slot);
            const isBooked = status?.type === 'booking';
            const isBlocked = status?.type === 'block' && (status.data as Block).block_type === 'blocked';
            const isManual = status?.type === 'block' && (status.data as Block).block_type === 'manual_booking';

            let cls = 'bg-white/5 border-white/10 hover:border-primary/40 cursor-pointer';
            if (isPast) cls = 'bg-black/20 border-white/5 cursor-not-allowed opacity-40';
            else if (isBooked) cls = 'bg-primary/10 border-primary/30 cursor-default';
            else if (isBlocked) cls = 'bg-red-500/10 border-red-500/30 cursor-pointer hover:border-red-400/60';
            else if (isManual) cls = 'bg-blue-500/10 border-blue-500/30 cursor-pointer hover:border-blue-400/60';

            return (
              <div key={slot} onClick={() => {
                if (isPast || isBooked) return;
                if (isBlocked || isManual) setUnblockTarget(status!.data as Block);
                else openModal(slot);
              }} className={`border rounded-xl p-3 transition-all select-none ${cls}`}>
                <p className="text-sm font-bold text-white">{fmt12(slot)}</p>
                <p className="text-xs text-gray-400 mt-0.5">– {fmt12(endTime(slot))}</p>
                {isPast && <p className="text-xs text-gray-600 mt-1">Past</p>}
                {!isPast && isBooked && <p className="text-xs text-primary mt-1 truncate">{(status!.data as Booking).user?.full_name || 'Booked'}</p>}
                {!isPast && isBlocked && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-red-400 text-xs">lock</span>
                    <p className="text-xs text-red-400">Blocked</p>
                  </div>
                )}
                {!isPast && isManual && (
                  <div>
                    <p className="text-xs text-blue-400 mt-1 truncate">{(status!.data as Block).customer_name || 'Manual'}</p>
                    <p className="text-xs text-blue-300/60">Walk-in</p>
                  </div>
                )}
                {!isPast && !status && <p className="text-xs text-gray-600 mt-1">Tap to block</p>}
              </div>
            );
          })}
        </div>
      )}

      {modal.open && (
        <SlotModal
          slot={modal.slot}
          mode={modal.mode}
          customerName={modal.customerName}
          customerPhone={modal.customerPhone}
          notes={modal.notes}
          saving={saving}
          onModeChange={mode => setModal(m => ({ ...m, mode }))}
          onCustomerNameChange={v => setModal(m => ({ ...m, customerName: v }))}
          onCustomerPhoneChange={v => setModal(m => ({ ...m, customerPhone: v }))}
          onNotesChange={v => setModal(m => ({ ...m, notes: v }))}
          onSave={handleSave}
          onClose={() => setModal(m => ({ ...m, open: false }))}
        />
      )}

      <ConfirmModal
        isOpen={!!unblockTarget}
        onClose={() => setUnblockTarget(null)}
        onConfirm={async () => { if (unblockTarget) { await deleteBlock(unblockTarget.id); setUnblockTarget(null); } }}
        title="Unblock Slot"
        message={unblockTarget?.block_type === 'manual_booking'
          ? `Remove manual booking for ${unblockTarget.customer_name || 'this customer'}?`
          : 'Unblock this slot? It will become available for bookings again.'}
        confirmText="Unblock"
        cancelText="Keep Blocked"
      />

      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert(a => ({ ...a, open: false }))}
        title={alert.type === 'success' ? 'Done' : 'Error'}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}
