import React, { useEffect, useState } from 'react';

export interface ToastProps {
  id:        string;
  success:   boolean;
  message:   string;
  timestamp: string;
  duration?: number;
  onClose:   (id: string) => void;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return '';
  }
}

function formatMessage(msg: string): string {
  const map: Record<string, string> = {
    done:                  'Operation completed successfully.',
    Email_already_exists:  'This email is already registered.',
    bad_credentials:       'Incorrect email or password.',
    token_error:           'Session expired. Please sign in again.',
    server_error:          'An unexpected server error occurred.',
    service_reachable:     'Service is reachable and responding.',
  };
  return map[msg] ?? msg.replace(/_/g, ' ');
}

const Toast: React.FC<ToastProps> = ({
  id,
  success,
  message,
  timestamp,
  duration = 4000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount → slide in
    const enter = requestAnimationFrame(() => setVisible(true));

    // Auto-close
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(timer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`w-full transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      <div className={`
        relative flex items-start gap-3 rounded-xl px-4 py-3.5
        border shadow-2xl backdrop-blur-sm
        ${success
          ? 'bg-[#16191f] border-emerald-500/20'
          : 'bg-[#16191f] border-red-500/20'
        }
      `}>

        {/* Colored left bar */}
        <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${
          success ? 'bg-emerald-400' : 'bg-red-400'
        }`} />

        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
          success ? 'bg-emerald-500/10' : 'bg-red-500/10'
        }`}>
          {success ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 text-emerald-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pl-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${
              success ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {success ? 'Success' : 'Error'}
            </span>
            <span className="text-[9px] text-[#6b7280] font-mono">
              {formatTime(timestamp)}
            </span>
          </div>
          <p className="text-[12px] text-[#e8eaf0] leading-relaxed">
            {formatMessage(message)}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="flex-shrink-0 text-[#6b7280] hover:text-[#e8eaf0] transition-colors mt-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden`}>
          <div
            className={`h-full ${success ? 'bg-emerald-400/40' : 'bg-red-400/40'}`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;