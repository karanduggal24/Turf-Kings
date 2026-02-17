import Button from './Button';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK'
}: AlertModalProps) {
  if (!isOpen) return null;

  const typeStyles = {
    success: {
      icon: 'check_circle',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    error: {
      icon: 'error',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    warning: {
      icon: 'warning',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    info: {
      icon: 'info',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
  };

  const style = typeStyles[type];

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-primary/20 rounded-2xl max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full ${style.bgColor} border ${style.borderColor} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined text-2xl ${style.iconColor}`}>
                {style.icon}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary/10 px-6 py-4 flex justify-end">
          <Button onClick={onClose} variant="primary">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
