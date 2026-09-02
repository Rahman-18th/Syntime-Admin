import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  UserRound,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Employees',
    value: '128',
    change: '+6 this month',
    icon: UserRound,
  },
  {
    label: 'Present Today',
    value: '112',
    change: '87.5% attendance',
    icon: CheckCircle2,
  },
  {
    label: 'Late Today',
    value: '9',
    change: '7.0% of workforce',
    icon: Clock3,
  },
  {
    label: 'Pending Requests',
    value: '7',
    change: 'Needs review',
    icon: CalendarClock,
  },
];

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Overview
          </p>

          <h1>
            Dashboard
          </h1>

          <p>
            Monitor your workforce,
            attendance, and employee
            activities in one place.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
        >
          Export Report
        </button>
      </section>

      <section className="stat-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="stat-card"
            >
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={20} />
                </div>

                <span className="stat-change">
                  {item.change}
                </span>
              </div>

              <div className="stat-label">
                {item.label}
              </div>

              <div className="stat-value">
                {item.value}
              </div>
            </article>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <h2>
                Attendance Overview
              </h2>

              <p>
                Daily employee attendance
                summary.
              </p>
            </div>

            <button
              type="button"
              className="ghost-button"
            >
              View attendance
            </button>
          </div>

          <div className="placeholder-chart">
            <div className="chart-bars">
              {[58, 76, 64, 88, 71, 92, 81].map(
                (height, index) => (
                  <div
                    key={index}
                    className="chart-bar-wrap"
                  >
                    <div
                      className="chart-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <div>
              <h2>
                Recent Activity
              </h2>

              <p>
                Latest workforce updates.
              </p>
            </div>
          </div>

          <div className="activity-list">
            <ActivityItem
              title="New leave request"
              subtitle="Rahman submitted annual leave"
              time="12 min ago"
            />

            <ActivityItem
              title="Attendance updated"
              subtitle="Employee clock-in recorded"
              time="28 min ago"
            />

            <ActivityItem
              title="Payslip published"
              subtitle="September payroll is available"
              time="1 hr ago"
            />

            <ActivityItem
              title="Announcement published"
              subtitle="Monthly office meeting"
              time="2 hrs ago"
            />
          </div>
        </article>
      </section>
    </div>
  );
}

function ActivityItem({
  title,
  subtitle,
  time,
}: {
  title: string;
  subtitle: string;
  time: string;
}) {
  return (
    <div className="activity-item">
      <div className="activity-dot" />

      <div className="activity-copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <span className="activity-time">
        {time}
      </span>
    </div>
  );
}