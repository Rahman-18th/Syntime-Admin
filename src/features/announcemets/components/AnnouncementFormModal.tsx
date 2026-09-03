import {
  useState
} from 'react';

import {
  X,
} from 'lucide-react';

import type {
  Announcement,
  AnnouncementFormPayload,
  AnnouncementPriority,
} from '../types/announcement.types';

interface AnnouncementFormModalProps {
  open: boolean;
  announcement?: Announcement | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    payload: AnnouncementFormPayload,
  ) => Promise<void>;
}

const initialForm: AnnouncementFormPayload = {
  title: '',
  message: '',
  priority: 'normal',
  isPublished: false,
};

export default function AnnouncementFormModal({
  open,
  announcement,
  isSubmitting,
  onClose,
  onSubmit,
}: AnnouncementFormModalProps) {
  const [form, setForm] =
  useState<AnnouncementFormPayload>(() => {
    if (announcement) {
      return {
        title: announcement.title,
        message: announcement.message,
        priority: announcement.priority,
        isPublished: announcement.isPublished,
      };
    }

    return initialForm;
  });



  if (!open) {
    return null;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit({
      title: form.title.trim(),
      message: form.message.trim(),
      priority: form.priority,
      isPublished: form.isPublished,
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Communication
            </p>

            <h2>
              {announcement
                ? 'Edit Announcement'
                : 'New Announcement'}
            </h2>

            <p>
              Create an announcement for
              SynTime employees.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="form-stack"
          onSubmit={handleSubmit}
        >
          <label className="form-field">
            <span>Title</span>

            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title:
                    event.target.value,
                }))
              }
              placeholder="e.g. Monthly Office Meeting"
              required
            />
          </label>

          <label className="form-field">
            <span>Message</span>

            <textarea
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  message:
                    event.target.value,
                }))
              }
              placeholder="Write the announcement message..."
              rows={6}
              required
            />
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>Priority</span>

              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priority:
                      event.target
                        .value as AnnouncementPriority,
                  }))
                }
              >
                <option value="normal">
                  Normal
                </option>

                <option value="important">
                  Important
                </option>

                <option value="urgent">
                  Urgent
                </option>
              </select>
            </label>

            <label className="publish-field">
              <input
                type="checkbox"
                checked={
                  form.isPublished
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isPublished:
                      event.target
                        .checked,
                  }))
                }
              />

              <span>
                Publish immediately
              </span>
            </label>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : announcement
                  ? 'Save Changes'
                  : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}