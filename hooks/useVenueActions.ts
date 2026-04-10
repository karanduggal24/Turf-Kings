import { useState } from 'react';
import { adminApi } from '@/lib/api';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export function useVenueActions() {
  const [actionLoading, setActionLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title: string, message: string, type: AlertState['type']) => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ ...alertModal, isOpen: false });
  };

  const approveVenue = async (venueId: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      await adminApi.updateVenue(venueId, { is_active: true, approval_status: 'approved' });
      showAlert('Venue Approved', 'The venue has been successfully approved and is now active.', 'success');
      return true;
    } catch (error: any) {
      showAlert('Approval Failed', error.message || 'Failed to approve venue. Please try again.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const rejectVenue = async (venueId: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      await adminApi.updateVenue(venueId, { is_active: false, approval_status: 'rejected' });
      showAlert('Venue Rejected', 'The venue has been rejected.', 'warning');
      return true;
    } catch (error: any) {
      showAlert('Rejection Failed', error.message || 'Failed to reject venue. Please try again.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteVenue = async (venueId: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      await adminApi.deleteVenue(venueId);
      showAlert('Venue Deleted', 'The venue has been permanently deleted.', 'success');
      return true;
    } catch (error: any) {
      showAlert('Deletion Failed', error.message || 'Failed to delete venue. Please try again.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    alertModal,
    closeAlert,
    approveVenue,
    rejectVenue,
    deleteVenue
  };
}
