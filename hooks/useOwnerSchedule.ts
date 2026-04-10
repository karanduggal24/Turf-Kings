import { useState, useEffect } from 'react';
import { ownerApi } from '@/lib/api';

const ALL_TIME_SLOTS = [
  '06:00','07:00','08:00','09:00','10:00','11:00',
  '12:00','13:00','14:00','15:00','16:00','17:00',
  '18:00','19:00','20:00','21:00','22:00','23:00',
];

export interface Turf {
  id: string;
  name: string;
  sport_type: string;
  venue_id: string;
  venue_name: string;
  open_time?: string;
  close_time?: string;
}

export interface Block {
  id: string;
  start_time: string;
  end_time: string;
  block_type: string;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  user?: { full_name: string; phone?: string };
}

export const fmt12 = (t: string) => {
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
};

export const endTime = (start: string) => {
  const [h, m] = start.split(':');
  return `${String(parseInt(h) + 1).padStart(2, '0')}:${m}`;
};

const norm = (t: string) => t.slice(0, 5);

export function useOwnerSchedule() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false, message: '', type: 'success',
  });

  // Load turfs on mount
  useEffect(() => {
    ownerApi.getVenues().then((data: any) => {
      const all: Turf[] = [];
      (data.venues || []).forEach((v: any) => {
        (v.turfs || []).forEach((t: any) => {
          if (t.is_active) all.push({
            id: t.id, name: t.name, sport_type: t.sport_type,
            venue_id: v.id, venue_name: v.name,
            open_time: t.open_time || '06:00',
            close_time: t.close_time || '22:00',
          });
        });
      });
      setTurfs(all);
      if (all.length > 0) setSelectedTurf(all[0]);
    }).catch(() => {});
  }, []);

  // Load schedule when turf or date changes
  useEffect(() => {
    if (!selectedTurf) return;
    setLoadingSchedule(true);
    ownerApi.getSchedule(selectedTurf.id, selectedDate)
      .then((data: any) => {
        setBlocks(data.blocks || []);
        setBookings(data.bookings || []);
      })
      .catch(() => {})
      .finally(() => setLoadingSchedule(false));
  }, [selectedTurf?.id, selectedDate]);

  const refreshSchedule = async () => {
    if (!selectedTurf) return;
    const data: any = await ownerApi.getSchedule(selectedTurf.id, selectedDate);
    setBlocks(data.blocks || []);
    setBookings(data.bookings || []);
  };

  // Slots within turf's operating hours
  const timeSlots = selectedTurf
    ? ALL_TIME_SLOTS.filter(slot => {
        const h = parseInt(slot.split(':')[0]);
        const open = parseInt((selectedTurf.open_time || '06:00').split(':')[0]);
        const close = parseInt((selectedTurf.close_time || '22:00').split(':')[0]);
        return h >= open && h <= close;
      })
    : ALL_TIME_SLOTS;

  const isSlotPast = (slot: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate !== today) return false;
    return parseInt(slot.split(':')[0]) <= new Date().getHours();
  };

  const getSlotStatus = (slot: string) => {
    const slotEnd = endTime(slot);
    const booking = bookings.find(b => norm(b.start_time) <= slot && norm(b.end_time) >= slotEnd);
    if (booking) return { type: 'booking' as const, data: booking };
    const block = blocks.find(b => norm(b.start_time) <= slot && norm(b.end_time) >= slotEnd);
    if (block) return { type: 'block' as const, data: block };
    return null;
  };

  const isDayFullyBlocked = timeSlots.length > 0 && timeSlots.every(slot => {
    const s = getSlotStatus(slot);
    return s?.type === 'block' && (s.data as Block).block_type === 'blocked';
  });

  const createBlock = async (payload: Record<string, any>) => {
    if (!selectedTurf) return;
    setSaving(true);
    try {
      await ownerApi.createBlock(payload);
      await refreshSchedule();
      showAlert(payload.block_type === 'manual_booking' ? 'Manual booking added.' : 'Slot blocked.', 'success');
    } catch (err: any) {
      showAlert(err.message || 'Failed to save.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteBlock = async (blockId: string) => {
    if (!selectedTurf) return;
    try {
      await ownerApi.deleteBlock(blockId, selectedTurf.venue_id);
      setBlocks(prev => prev.filter(b => b.id !== blockId));
      showAlert('Slot unblocked.', 'success');
    } catch (err: any) {
      showAlert(err.message || 'Failed to unblock.', 'error');
    }
  };

  const blockDay = async () => {
    if (!selectedTurf) return;
    setSaving(true);
    try {
      await ownerApi.blockDay(selectedTurf.id, selectedTurf.venue_id, selectedDate);
      await refreshSchedule();
      showAlert('Entire day blocked.', 'success');
    } catch (err: any) {
      showAlert(err.message || 'Failed to block day.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const unblockDay = async () => {
    if (!selectedTurf) return;
    setSaving(true);
    try {
      await ownerApi.unblockDay(selectedTurf.id, selectedTurf.venue_id, selectedDate);
      await refreshSchedule();
      showAlert('Day unblocked.', 'success');
    } catch (err: any) {
      showAlert(err.message || 'Failed to unblock day.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showAlert = (message: string, type: 'success' | 'error') =>
    setAlert({ open: true, message, type });

  return {
    turfs, selectedTurf, setSelectedTurf,
    selectedDate, setSelectedDate,
    blocks, bookings, loadingSchedule, saving,
    timeSlots, isSlotPast, getSlotStatus, isDayFullyBlocked,
    createBlock, deleteBlock, blockDay, unblockDay,
    alert, setAlert,
    endTime, fmt12,
  };
}
