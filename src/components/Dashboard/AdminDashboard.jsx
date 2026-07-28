import { useState, useEffect } from 'react';
import { tasksApi, usersApi, fullName } from '../../api/services';
import { getStoredUser } from '../../api/client';
import './AdminDashboard.css';

const TASK_COLORS = ['#ec4899', '#3b82f6', '#0d9488', '#eab308', '#a855f7'];

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({ available: 0, completed: 0, pending: 0 });
  const [technicianCount, setTechnicianCount] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const currentUser = getStoredUser();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [taskStats, technicians, tasks, monthlyStats] = await Promise.all([
          tasksApi.stats(),
          usersApi.getTechnicians(),
          tasksApi.list(),
          tasksApi.monthlyStats(),
        ]);
        if (cancelled) return;

        setStats(taskStats);
        setTechnicianCount(technicians.length);
        setMonthly(monthlyStats);
        setAssignedTasks(
          tasks
            .filter((t) => t.assignedTo && t.status !== 'completed')
            .slice(0, 5)
            .map((t, idx) => ({
              taskTitle: t.title,
              technicianAssigned: fullName(t.assignedTo),
              color: TASK_COLORS[idx % TASK_COLORS.length],
            }))
        );
      } catch (err) {
        console.error('Failed to load dashboard data:', err.message);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const dayOfWeekLong = time.toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfWeekShort = time.toLocaleDateString('en-US', { weekday: 'short' });
  const dayOfMonth = time.getDate();
  const monthName = time.toLocaleDateString('en-US', { month: 'long' });

  const totalTasks = stats.available + stats.pending + stats.completed;

  // Monthly completed-task chart (last 6 months from the backend), rendered
  // into the existing pill-chart design. Tallest month gets the highlight.
  const maxCompleted = Math.max(1, ...monthly.map((m) => m.completed));
  const analyticsData = monthly.map((m, idx) => {
    const isMax = m.completed === maxCompleted && m.completed > 0;
    return {
      day: m.month,
      type: isMax ? 'active-mint' : m.completed > 0 ? 'solid-green' : 'striped',
      label: isMax ? `${m.completed}` : null,
      heightPct: Math.round((m.completed / maxCompleted) * 100),
      key: idx,
    };
  });

  const adminName = fullName(currentUser) || 'Admin';
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="exact-dashboard-wrapper">
      <header className="exact-header">
        <div className="header-title-block">
          <h1>Dashboard</h1>
          <p>Coordinate field dispatches and dispatch real-time maintenance routes</p>
        </div>

        <div className="header-profile-badge">
          <div className="profile-badge-avatar">
            <span role="img" aria-label="avatar">{initials}</span>
          </div>
          <div className="profile-badge-details">
            <span className="profile-badge-name">{adminName}</span>
            <span className="profile-badge-email">{currentUser?.email || ''}</span>
          </div>
        </div>
      </header>

      <div className="exact-grid-layout">
        <div className="left-content-segment">
          <div className="exact-metrics-row">
            <div className="m-card focus-green">
              <div className="m-card-header">
                <span className="m-title">Total Technicians</span>
                <span className="m-arrow">↗</span>
              </div>
              <h2 className="m-value">{technicianCount}</h2>
              <div className="m-footer">
                <span className="m-footer-txt">Registered technicians</span>
              </div>
            </div>

            <div className="m-card plain-white">
              <div className="m-card-header">
                <span className="m-title">Total Tasks</span>
                <span className="m-arrow dark">↗</span>
              </div>
              <h2 className="m-value">{totalTasks}</h2>
              <div className="m-footer">
                <span className="m-footer-txt">All operations</span>
              </div>
            </div>

            <div className="m-card plain-white">
              <div className="m-card-header">
                <span className="m-title">Completed</span>
                <span className="m-arrow dark">↗</span>
              </div>
              <h2 className="m-value">{stats.completed}</h2>
              <div className="m-footer">
                <span className="m-footer-txt">Finished operations</span>
              </div>
            </div>

            <div className="m-card plain-white">
              <div className="m-card-header">
                <span className="m-title">Pending Assignment</span>
                <span className="m-arrow dark">↗</span>
              </div>
              <h2 className="m-value">{stats.available}</h2>
              <div className="m-footer">
                <span className="m-footer-txt status-only">Awaiting start</span>
              </div>
            </div>
          </div>

          <div className="middle-split-row">
            <div className="panel-card flex-60">
              <h3>Work Analytics</h3>
              <div className="analytics-pill-chart spaced-graph">
                {analyticsData.map((item) => (
                  <div key={item.key} className="pill-chart-col">
                    <div className="pill-bar-track">
                      <div
                        className={`pill-bar-fill ${item.type}`}
                        style={{ height: `${Math.max(item.heightPct, 8)}%` }}
                      >
                        {item.label && (
                          <div className="pill-floating-tooltip">
                            {item.label}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="pill-axis-lbl">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-card flex-40 design-date-card centered-layout">
              <h3>Date</h3>
              <div className="date-card-body">
                <h1 className="date-large-day">{dayOfWeekShort}</h1>
                <p className="date-sub-details">{dayOfMonth} {monthName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="right-sidebar-segment">
          <div className="panel-card full-height-card dashboard-tasks-card">
            <div className="panel-header-with-btn">
              <h3>Assigned Tasks</h3>
            </div>

            <div className="sidebar-project-list tasks-container-wrapper">
              {assignedTasks.length === 0 ? (
                <div className="no-tasks-placeholder">
                  <i className="fa-regular fa-clipboard"></i>
                  <p>No Tasks Assigned</p>
                </div>
              ) : (
                assignedTasks.map((task, idx) => (
                  <div key={idx} className="sidebar-proj-row">
                    <div className="proj-icon-box" style={{ background: `${task.color}20`, color: task.color, padding: '8px', borderRadius: '50%' }}>
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="proj-metadata">
                      <h4>{task.taskTitle}</h4>
                      <p>Assigned to: <span>{task.technicianAssigned}</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel-card abstract-time-tracker">
            <h3>Time Tracker</h3>
            <div className="tracker-row-elements">
              <h2>{timeString}</h2>
              <div className="tracker-day-display">
                {dayOfWeekLong}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}