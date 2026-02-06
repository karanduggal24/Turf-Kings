interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  const isSuccess = message.includes('Check your email');

  return (
    <div
      className={`mb-6 p-4 rounded-lg border ${
        isSuccess
          ? 'bg-primary/10 border-primary/30 text-primary'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-xl flex-shrink-0">
          {isSuccess ? 'check_circle' : 'error'}
        </span>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
