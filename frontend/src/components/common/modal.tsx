import { useEffect, useRef } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  widthClass = "sm:w-[450px] lg:w-[520px] w-[90%] max-w-[95%] rounded-xl",
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isOpen]);

  // Focus modal when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => modalRef.current?.focus(), 80);
    }
  }, [isOpen]);

  return (
    <div
      aria-hidden={!isOpen}
      className="fixed inset-0 z-40 pointer-events-none"
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
          isOpen 
            ? "bg-black/70 opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-4 bottom-4 right-4 ${widthClass} ${className} 
          transform transition-all duration-500 ease-in-out pointer-events-auto 
          bg-[#0e1014] border border-white/[0.08] rounded-xl shadow-2xl
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          {title && (
            <div className="p-5 sm:p-6 flex items-start justify-between border-b border-white/[0.07]">
              <div className="text-xl sm:text-2xl font-semibold text-[#e8eaf0]">
                {title}
              </div>
              <button
                aria-label="Close modal"
                onClick={onClose}
                className="text-[#6b7280] hover:text-[#e8eaf0] text-2xl leading-none transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-[#e8eaf0]">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-5 sm:p-6 border-t border-white/[0.07] flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;