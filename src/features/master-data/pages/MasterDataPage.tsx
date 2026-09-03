import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  Building2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  UsersRound,
} from 'lucide-react';

import {
  createCompany,
  createDepartment,
  createOffice,
  getCompanies,
  getDepartments,
  getOffices,
  updateCompany,
  updateDepartment,
  updateOffice,
} from '../api/master-data.api';

import CompanyFormModal
  from '../components/CompanyFormModal';

import DepartmentFormModal
  from '../components/DepartmentFormModal';

import OfficeFormModal
  from '../components/OfficeFormModal';

import type {
  Company,
  CompanyPayload,
  Department,
  DepartmentPayload,
  Office,
  OfficePayload,
} from '../types/master-data.types';

type Tab =
  | 'companies'
  | 'departments'
  | 'offices';

export default function MasterDataPage() {
  const [tab, setTab] =
    useState<Tab>('companies');

  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [
    departments,
    setDepartments,
  ] =
    useState<Department[]>([]);

  const [offices, setOffices] =
    useState<Office[]>([]);

  const [
    selectedCompany,
    setSelectedCompany,
  ] =
    useState<Company | null>(null);

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] =
    useState<Department | null>(
      null,
    );

  const [
    selectedOffice,
    setSelectedOffice,
  ] =
    useState<Office | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [
        companyData,
        departmentData,
        officeData,
      ] =
        await Promise.all([
          getCompanies(),
          getDepartments(),
          getOffices(),
        ]);

      setCompanies(companyData);
      setDepartments(departmentData);
      setOffices(officeData);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to load master data.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function openCreate() {
    setSelectedCompany(null);
    setSelectedDepartment(null);
    setSelectedOffice(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCompany(null);
    setSelectedDepartment(null);
    setSelectedOffice(null);
  }

  async function saveCompany(
    payload: CompanyPayload,
  ) {
    setIsSubmitting(true);

    try {
      if (selectedCompany) {
        await updateCompany(
          selectedCompany.id,
          payload,
        );
      } else {
        await createCompany(
          payload,
        );
      }

      closeModal();
      await loadData();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to save company.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveDepartment(
    payload: DepartmentPayload,
  ) {
    setIsSubmitting(true);

    try {
      if (selectedDepartment) {
        await updateDepartment(
          selectedDepartment.id,
          payload,
        );
      } else {
        await createDepartment(
          payload,
        );
      }

      closeModal();
      await loadData();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to save department.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveOffice(
    payload: OfficePayload,
  ) {
    setIsSubmitting(true);

    try {
      if (selectedOffice) {
        await updateOffice(
          selectedOffice.id,
          payload,
        );
      } else {
        await createOffice(
          payload,
        );
      }

      closeModal();
      await loadData();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to save office.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Organization
          </p>

          <h1>Master Data</h1>

          <p>
            Manage companies,
            departments, and office
            locations.
          </p>
        </div>

        <button
          type="button"
          className="primary-button button-with-icon"
          onClick={openCreate}
        >
          <Plus size={16} />

          {tab === 'companies'
            ? 'New Company'
            : tab === 'departments'
              ? 'New Department'
              : 'New Office'}
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

      <section className="master-data-stats">
        <StatCard
          icon={<Building2 size={18} />}
          label="Companies"
          value={companies.length}
        />

        <StatCard
          icon={<UsersRound size={18} />}
          label="Departments"
          value={departments.length}
        />

        <StatCard
          icon={<MapPin size={18} />}
          label="Offices"
          value={offices.length}
        />
      </section>

      <section className="panel-card">
        <div className="master-data-tabs">
          <TabButton
            active={tab === 'companies'}
            onClick={() =>
              setTab('companies')
            }
          >
            Companies
          </TabButton>

          <TabButton
            active={
              tab === 'departments'
            }
            onClick={() =>
              setTab('departments')
            }
          >
            Departments
          </TabButton>

          <TabButton
            active={tab === 'offices'}
            onClick={() =>
              setTab('offices')
            }
          >
            Offices
          </TabButton>

          <button
            type="button"
            className="ghost-button button-with-icon master-refresh"
            onClick={loadData}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div className="panel-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>
                Loading master data...
              </p>
            </div>
          ) : tab === 'companies' ? (
            <CompanyTable
              items={companies}
              onEdit={(company) => {
                setSelectedCompany(
                  company,
                );

                setModalOpen(true);
              }}
            />
          ) : tab ===
            'departments' ? (
            <DepartmentTable
              items={departments}
              onEdit={(department) => {
                setSelectedDepartment(
                  department,
                );

                setModalOpen(true);
              }}
            />
          ) : (
            <OfficeTable
              items={offices}
              onEdit={(office) => {
                setSelectedOffice(
                  office,
                );

                setModalOpen(true);
              }}
            />
          )}
        </div>
      </section>

      {modalOpen &&
        tab === 'companies' && (
          <CompanyFormModal
            key={
              selectedCompany
                ? selectedCompany.id
                : 'new-company'
            }
            company={selectedCompany}
            isSubmitting={
              isSubmitting
            }
            onClose={closeModal}
            onSubmit={saveCompany}
          />
        )}

      {modalOpen &&
        tab === 'departments' && (
          <DepartmentFormModal
            key={
              selectedDepartment
                ? selectedDepartment.id
                : 'new-department'
            }
            department={
              selectedDepartment
            }
            companies={companies}
            isSubmitting={
              isSubmitting
            }
            onClose={closeModal}
            onSubmit={
              saveDepartment
            }
          />
        )}

      {modalOpen &&
        tab === 'offices' && (
          <OfficeFormModal
            key={
              selectedOffice
                ? selectedOffice.id
                : 'new-office'
            }
            office={selectedOffice}
            companies={companies}
            isSubmitting={
              isSubmitting
            }
            onClose={closeModal}
            onSubmit={saveOffice}
          />
        )}
    </div>
  );
}

function CompanyTable({
  items,
  onEdit,
}: {
  items: Company[];
  onEdit: (
    item: Company,
  ) => void;
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>
                  {item.name}
                </strong>
              </td>

              <td>
                {item.address ?? '-'}
              </td>

              <td>
                {item.email ?? '-'}
              </td>

              <td>
                {item.phone ?? '-'}
              </td>

              <td>
                <EditButton
                  onClick={() =>
                    onEdit(item)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DepartmentTable({
  items,
  onEdit,
}: {
  items: Department[];
  onEdit: (
    item: Department,
  ) => void;
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Company</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>
                  {item.name}
                </strong>
              </td>

              <td>
                {item.company?.name ??
                  '-'}
              </td>

              <td>
                {item.description ??
                  '-'}
              </td>

              <td>
                <EditButton
                  onClick={() =>
                    onEdit(item)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OfficeTable({
  items,
  onEdit,
}: {
  items: Office[];
  onEdit: (
    item: Office,
  ) => void;
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Office</th>
            <th>Company</th>
            <th>Address</th>
            <th>Radius</th>
            <th>Coordinates</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>
                  {item.name}
                </strong>
              </td>

              <td>
                {item.company?.name ??
                  '-'}
              </td>

              <td>
                {item.address ?? '-'}
              </td>

              <td>
                {item.allowedRadiusMeters}
                {' m'}
              </td>

              <td>
                {item.latitude ?? '-'}
                {', '}
                {item.longitude ?? '-'}
              </td>

              <td>
                <EditButton
                  onClick={() =>
                    onEdit(item)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="table-action-button"
      onClick={onClick}
    >
      <Pencil size={15} />
    </button>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? 'master-tab master-tab-active'
          : 'master-tab'
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <article className="mini-stat">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="mini-stat-icon">
        {icon}
      </div>
    </article>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (axios.isAxiosError(error)) {
    return (
      error.response
        ?.data
        ?.message ??
      fallback
    );
  }

  return fallback;
}