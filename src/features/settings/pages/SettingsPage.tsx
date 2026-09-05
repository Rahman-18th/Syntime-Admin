import {
  Building2,
  Clock3,
  MapPin,
  Save,
  Settings2,
} from "lucide-react";

import axios from "axios";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCompanies,
  getOffices,
} from "../../master-data/api/master-data.api";

import type {
  Company,
  Office,
} from "../../master-data/types/master-data.types";

import {
  getSettings,
  updateSettings,
} from "../api/settings.api";

import type {
  SystemSettings,
} from "../types/settings.types";

import {
  useToast,
} from "../../../components/toast/useToast";

export default function SettingsPage() {
  const { showToast } = useToast();

  const [
    settings,
    setSettings,
  ] =
    useState<SystemSettings>({
      timezone: "Asia/Jakarta",
      default_company_id: "",
      default_office_id: "",
      default_attendance_radius:
        "150",
      system_name: "SynTime",
    });

  const [
    companies,
    setCompanies,
  ] = useState<Company[]>([]);

  const [
    offices,
    setOffices,
  ] = useState<Office[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [settingsData, companyData, officeData] =
          await Promise.all([
            getSettings(),
            getCompanies(),
            getOffices(),
          ]);

        if (!isMounted) {
          return;
        }

        setSettings(settingsData);
        setCompanies(companyData);
        setOffices(officeData);
      } catch (error) {
        if (isMounted) {
          setError(
            getErrorMessage(
              error,
              "Failed to load settings.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOffices =
    useMemo(() => {
      if (
        !settings.default_company_id
      ) {
        return offices;
      }

      return offices.filter(
        (office) =>
          String(
            office.companyId
          ) ===
          settings.default_company_id
      );
    }, [
      offices,
      settings.default_company_id,
    ]);

  function updateField(
    field:
      keyof SystemSettings,
    value: string
  ) {
    setSettings(
      (current) => ({
        ...current,
        [field]: value,
      })
    );

  }

  function handleCompanyChange(
    companyId: string
  ) {
    setSettings(
      (current) => ({
        ...current,
        default_company_id:
          companyId,
        default_office_id: "",
      })
    );

  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    try {
      const updated =
        await updateSettings(
          settings
        );

      setSettings(updated);

      showToast({
        type: "success",
        title: "Settings saved",
        message:
          "System settings were updated successfully.",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Save failed",
        message: getErrorMessage(
          error,
          "Failed to save settings."
        ),
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />

        <p>
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            System
          </p>

          <h1>
            Settings
          </h1>

          <p>
            Configure core SynTime
            system preferences.
          </p>
        </div>

        <button
          type="button"
          className="primary-button button-with-icon"
          disabled={isSaving}
          onClick={() =>
            void handleSave()
          }
        >
          <Save size={16} />

          {isSaving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </section>

      {error && (
        <div className="error-banner">
          <span>{error}</span>

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

      <div className="settings-grid">
        <section className="panel-card">
          <div className="panel-heading">
            <div>
              <p className="page-eyebrow">
                General
              </p>

              <h2>
                System Identity
              </h2>

              <p>
                Basic application
                configuration.
              </p>
            </div>

            <Settings2
              size={20}
            />
          </div>

          <div className="settings-form">
            <label className="form-field">
              <span>
                System Name
              </span>

              <input
                value={
                  settings.system_name
                }
                onChange={(event) =>
                  updateField(
                    "system_name",
                    event.target.value
                  )
                }
                placeholder="SynTime"
              />
            </label>

            <label className="form-field">
              <span>
                Timezone
              </span>

              <select
                value={
                  settings.timezone
                }
                onChange={(event) =>
                  updateField(
                    "timezone",
                    event.target.value
                  )
                }
              >
                <option value="Asia/Jakarta">
                  Asia/Jakarta
                </option>

                <option value="Asia/Makassar">
                  Asia/Makassar
                </option>

                <option value="Asia/Jayapura">
                  Asia/Jayapura
                </option>

                <option value="UTC">
                  UTC
                </option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel-card">
          <div className="panel-heading">
            <div>
              <p className="page-eyebrow">
                Organization
              </p>

              <h2>
                Default Workplace
              </h2>

              <p>
                Set the default
                company and office.
              </p>
            </div>

            <Building2
              size={20}
            />
          </div>

          <div className="settings-form">
            <label className="form-field">
              <span>
                Default Company
              </span>

              <select
                value={
                  settings.default_company_id
                }
                onChange={(event) =>
                  handleCompanyChange(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select company
                </option>

                {companies.map(
                  (company) => (
                    <option
                      key={
                        company.id
                      }
                      value={
                        company.id
                      }
                    >
                      {
                        company.name
                      }
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="form-field">
              <span>
                Default Office
              </span>

              <select
                value={
                  settings.default_office_id
                }
                onChange={(event) =>
                  updateField(
                    "default_office_id",
                    event.target.value
                  )
                }
                disabled={
                  !settings.default_company_id
                }
              >
                <option value="">
                  Select office
                </option>

                {filteredOffices.map(
                  (office) => (
                    <option
                      key={
                        office.id
                      }
                      value={
                        office.id
                      }
                    >
                      {
                        office.name
                      }
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
        </section>

        <section className="panel-card">
          <div className="panel-heading">
            <div>
              <p className="page-eyebrow">
                Attendance
              </p>

              <h2>
                Location Policy
              </h2>

              <p>
                Configure the
                default attendance
                radius.
              </p>
            </div>

            <MapPin size={20} />
          </div>

          <div className="settings-form">
            <label className="form-field">
              <span>
                Default Radius
                (meters)
              </span>

              <input
                type="number"
                min="1"
                value={
                  settings.default_attendance_radius
                }
                onChange={(event) =>
                  updateField(
                    "default_attendance_radius",
                    event.target.value
                  )
                }
              />
            </label>

            <div className="settings-info-card">
              <Clock3 size={16} />

              <div>
                <strong>
                  Current timezone
                </strong>

                <span>
                  {
                    settings.timezone
                  }
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    axios.isAxiosError(error)
  ) {
    return (
      error.response?.data
        ?.message ??
      fallback
    );
  }

  return fallback;
}