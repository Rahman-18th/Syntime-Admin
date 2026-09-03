import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  Megaphone,
  Plus,
  RefreshCw,
} from 'lucide-react';

import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from '../api/announcement.api';

import AnnouncementFormModal
  from '../components/AnnouncementFormModal';

import AnnouncementTable
  from '../components/AnnouncementTable';

import type {
  Announcement,
  AnnouncementFormPayload,
} from '../types/announcement.types';

export default function AnnouncementPage() {
  const [items, setItems] =
    useState<Announcement[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    selectedAnnouncement,
    setSelectedAnnouncement,
  ] = useState<Announcement | null>(
    null,
  );

  useEffect(() => {
    void loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await getAnnouncements();

      setItems(data);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to load announcements.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setSelectedAnnouncement(null);
    setModalOpen(true);
  }

  function openEditModal(
    announcement: Announcement,
  ) {
    setSelectedAnnouncement(
      announcement,
    );

    setModalOpen(true);
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setModalOpen(false);
    setSelectedAnnouncement(null);
  }

  async function handleSubmit(
    payload: AnnouncementFormPayload,
  ) {
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedAnnouncement) {
        await updateAnnouncement(
          selectedAnnouncement.id,
          payload,
        );
      } else {
        await createAnnouncement(
          payload,
        );
      }

      setModalOpen(false);
      setSelectedAnnouncement(null);

      await loadAnnouncements();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to save announcement.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(
    announcement: Announcement,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${announcement.title}"?`,
      );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      await deleteAnnouncement(
        announcement.id,
      );

      await loadAnnouncements();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to delete announcement.',
        ),
      );
    }
  }

  const publishedCount =
    items.filter(
      (item) =>
        item.isPublished,
    ).length;

  const draftCount =
    items.length -
    publishedCount;

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Communication
          </p>

          <h1>
            Announcements
          </h1>

          <p>
            Create and manage
            company-wide employee
            announcements.
          </p>
        </div>

        <button
          type="button"
          className="primary-button button-with-icon"
          onClick={
            openCreateModal
          }
        >
          <Plus size={17} />

          New Announcement
        </button>
      </section>

      <section className="mini-stat-grid">
        <MiniStat
          label="Total"
          value={items.length}
          icon={
            <Megaphone
              size={18}
            />
          }
        />

        <MiniStat
          label="Published"
          value={publishedCount}
          tone="success"
        />

        <MiniStat
          label="Draft"
          value={draftCount}
          tone="neutral"
        />
      </section>

      {error && (
        <div className="error-banner">
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
          >
            ×
          </button>
        </div>
      )}

      <section className="panel-card">
        <div className="panel-header">
          <div>
            <h2>
              Announcement List
            </h2>

            <p>
              Manage publication status,
              content, and priority.
            </p>
          </div>

          <button
            type="button"
            className="ghost-button button-with-icon"
            onClick={
              loadAnnouncements
            }
            disabled={isLoading}
          >
            <RefreshCw
              size={15}
              className={
                isLoading
                  ? 'spin'
                  : ''
              }
            />

            Refresh
          </button>
        </div>

        <div className="panel-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />

              <p>
                Loading announcements...
              </p>
            </div>
          ) : (
            <AnnouncementTable
              items={items}
              onEdit={
                openEditModal
              }
              onDelete={
                handleDelete
              }
            />
          )}
        </div>
      </section>

      {modalOpen && (
        <AnnouncementFormModal
          key={
            selectedAnnouncement
              ? `edit-${selectedAnnouncement.id}`
              : 'create'
          }
          open={modalOpen}
          announcement={
            selectedAnnouncement
          }
          isSubmitting={
            isSubmitting
          }
          onClose={
            closeModal
          }
          onSubmit={
            handleSubmit
          }
        />
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
  tone = 'primary',
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  tone?:
    | 'primary'
    | 'success'
    | 'neutral';
}) {
  return (
    <article
      className={`mini-stat mini-stat-${tone}`}
    >
      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>
      </div>

      {icon && (
        <div className="mini-stat-icon">
          {icon}
        </div>
      )}
    </article>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    axios.isAxiosError(error)
  ) {
    return (
      error.response
        ?.data
        ?.message ??
      fallback
    );
  }

  return fallback;
}