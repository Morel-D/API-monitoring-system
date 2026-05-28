import React from "react";
import { type Service, type ServiceFormValues } from "../../../types";
import { Input } from "../../../components/ui/input";
import { useServiceForm } from "../UseServiceForm";

interface ServiceFormProps {
  initial?: Service;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initial, onSubmit, onCancel }) => {
  const { values, set, touch, isValid, fieldError } = useServiceForm(initial);
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isValid()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setServerError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-2">
      {/* Name */}
      <Field label="Service name" error={fieldError("name")}>
        <Input
          placeholder="Auth API"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => touch("name")}
          hasError={!!fieldError("name")}
        />
      </Field>

      {/* URL */}
      <Field label="Endpoint URL" error={fieldError("url")}>
        <Input
          type="url"
          placeholder="https://api.example.com/health"
          value={values.url}
          onChange={(e) => set("url", e.target.value)}
          onBlur={() => touch("url")}
          hasError={!!fieldError("url")}
        />
      </Field>



      {/* Server error */}
      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
          {serverError}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Add service"}
        </button>
      </div>
    </div>
  );
};

// ── Small helper ──────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}