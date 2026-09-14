import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  Building2,
  Clock3,
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
  createShift,
  getCompanies,
  getDepartments,
  getOffices,
  getShifts,
  updateCompany,
  updateDepartment,
  updateOffice,
  updateShift,
} from '../api/master-data.api';

import CompanyFormModal
  from '../components/CompanyFormModal';

import DepartmentFormModal
  from '../components/DepartmentFormModal';

import OfficeFormModal
  from '../components/OfficeFormModal';

import ShiftFormModal
  from '../components/ShiftFormModal';

import type {
  Company,
  CompanyPayload,
  Department,
  DepartmentPayload,
  Office,
  OfficePayload,
  Shift,
  ShiftPayload,
} from '../types/master-data.types';

import {
  useToast,
} from '../../../components/toast/useToast';

type Tab =
  | 'companies'
  | 'departments'
  | 'offices'
  | 'shifts';

export default function MasterDataPage() {
  const { showToast } =
    useToast();

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

  const [shifts, setShifts] =
    useState<Shift[]>([]);

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

  const [
    selectedShift,
    setSelectedShift,
  ] = useState<Shift | null>(null);

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
        shiftData,
      ] =
        await Promise.all([
          getCompanies(),
          getDepartments(),
          getOffices(),
          getShifts(),
        ]);

      setCompanies(companyData);
      setDepartments(departmentData);
      setOffices(officeData);
      setShifts(shiftData);
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
    setSelectedShift(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCompany(null);
    setSelectedDepartment(null);
    setSelectedOffice(null);
    setSelectedShift(null);
  }

  async function saveCompany(
    payload: CompanyPayload,
  ) {
    setIsSubmitting(true);

    try {
      const isEditing =
        Boolean(selectedCompany);

      await (
        selectedCompany
          ? updateCompany(
              selectedCompany.id,
              payload,
            )
          : createCompany(payload)
      );

      closeModal();
      await loadData();

      showToast({
        type: 'success',
        title: isEditing
          ? 'Company updated'
          : 'Company created',
        message: isEditing
          ? 'Company information was updated successfully.'
          : 'New company was created successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Company save failed',
        message: getErrorMessage(
          error,
          'Failed to save company.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveDepartment(
    payload: DepartmentPayload,
  ) {
    setIsSubmitting(true);

    try {
      const isEditing =
        Boolean(selectedDepartment);

      await (
        selectedDepartment
          ? updateDepartment(
              selectedDepartment.id,
              payload,
            )
          : createDepartment(
              payload,
            )
      );

      closeModal();
      await loadData();

      showToast({
        type: 'success',
        title: isEditing
          ? 'Department updated'
          : 'Department created',
        message: isEditing
          ? 'Department information was updated successfully.'
          : 'New department was created successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Department save failed',
        message: getErrorMessage(
          error,
          'Failed to save department.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveOffice(
    payload: OfficePayload,
  ) {
    setIsSubmitting(true);

    try {
      const isEditing =
        Boolean(selectedOffice);

      await (
        selectedOffice
          ? updateOffice(
              selectedOffice.id,
              payload,
            )
          : createOffice(payload)
      );

      closeModal();
      await loadData();
      showToast({
        type: 'success',
        title: isEditing
          ? 'Office updated'
          : 'Office created',
        message: isEditing
          ? 'Office information was updated successfully.'
          : 'New office was created successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Office save failed',
        message: getErrorMessage(
          error,
          'Failed to save office.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveShift(
    payload: ShiftPayload,
  ) {
    setIsSubmitting(true);

    try {
      const isEditing =
        Boolean(selectedShift);

      await (
        selectedShift
          ? updateShift(
              selectedShift.id,
              payload,
            )
          : createShift(payload)
      );

      closeModal();
      await loadData();

      showToast({
        type: 'success',
        title: isEditing
          ? 'Shift updated'
          : 'Shift created',
        message: isEditing
          ? 'Shift information was updated successfully.'
          : 'New shift was created successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Shift save failed',
        message: getErrorMessage(
          error,
          'Failed to save shift.',
        ),
      });
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
              : tab === 'offices'
                ? 'New Office'
                : 'New Shift'}
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

        <StatCard
          icon={<Clock3 size={18} />}
          label="Shifts"
          value={shifts.length}
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

          <TabButton
            active={tab === 'shifts'}
            onClick={() =>
              setTab('shifts')
            }
          >
            Shifts
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
          ) : tab === 'offices' ? (
            <OfficeTable
              items={offices}
              onEdit={(office) => {
                setSelectedOffice(
                  office,
                );

                setModalOpen(true);
              }}
            />
          ) : (
            <ShiftTable
              items={shifts}
              onEdit={(shift) => {
                setSelectedShift(
                  shift,
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

      {modalOpen &&
        tab === 'shifts' && (
          <ShiftFormModal
            key={
              selectedShift
                ? selectedShift.id
                : 'new-shift'
            }
            shift={selectedShift}
            companies={companies}
            isSubmitting={
              isSubmitting
            }
            onClose={closeModal}
            onSubmit={saveShift}
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

function ShiftTable({
  items,
  onEdit,
}: {
  items: Shift[];
  onEdit: (
    item: Shift,
  ) => void;
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Shift</th>
            <th>Company</th>
            <th>Start</th>
            <th>End</th>
            <th>Break</th>
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
                {formatShiftTime(
                  item.startTime,
                )}
              </td>

              <td>
                {formatShiftTime(
                  item.endTime,
                )}
              </td>

              <td>
                {item.breakStart &&
                item.breakEnd
                  ? `${formatShiftTime(
                      item.breakStart,
                    )} - ${formatShiftTime(
                      item.breakEnd,
                    )}`
                  : '-'}
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

function formatShiftTime(
  value: string,
) {
  const date =
    new Date(value);

  const hours =
    date
      .getUTCHours()
      .toString()
      .padStart(2, '0');

  const minutes =
    date
      .getUTCMinutes()
      .toString()
      .padStart(2, '0');

  return `${hours}:${minutes}`;
}