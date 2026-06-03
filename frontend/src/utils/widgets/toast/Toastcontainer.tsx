
import Toast from './Toast';
import { useToastStore } from './Toaststore';

export function ToastContainer() {
  const { toasts, hide } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <>
      {/* Progress bar keyframe — injected once */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-2.5 w-full max-w-[340px]">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            {...t}
            onClose={hide}
          />
        ))}
      </div>
    </>
  );
}