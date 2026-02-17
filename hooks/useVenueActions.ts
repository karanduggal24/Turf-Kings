import { useState } from 'react';

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
      const response = await fetch('/api/admin/venues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: venueId,
          is_active: true,
          approval_status: 'approved',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert('Approval Failed', data.error || 'Failed to approve venue. Please try again.', 'error');
        return false;
      }

      showAlert('Venue Approved', 'The venue has been successfully approved and is now active.', 'success');
      return true;
    } catch (error) {
      showAlert('Error', 'An unexpected error occurred. Please try again.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const rejectVenue = async (venueId: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/admin/venues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: venueId,
          is_active: false,
          approval_status: 'rejected',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert('Rejection Failed', data.error || 'Failed to reject venue. Please try again.', 'error');
        return false;
      }

      showAlert('Venue Rejected', 'The venue has been rejected.', 'warning');
      return true;
    } catch (error) {
      showAlert('Error', 'An unexpected error occurred. Please try again.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteVenue = async (venueId: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/admin/venues', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: venueId }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert('Deletion Failed', data.error || 'Failed to delete venue. Please try again.', 'error');
        return false;
      }

      showAlert('Venue Deleted', 'The venue has been permanently deleted.', 'success');
      return true;
    } catch (error) {
      showAlert('Error', 'An unexpected error occurred. Please try again.', 'error');
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
