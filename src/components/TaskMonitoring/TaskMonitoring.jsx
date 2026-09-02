import { useState, useEffect, useCallback } from "react";
import "./TaskMonitoring.css";
import AddTaskModal from "./AddTask/AddTaskModal";
import {
    tasksApi,
    fullName,
    statusLabel,
    capitalize,
} from "../../api/services";

const DEFAULT_AVATAR =
    "https://ui-avatars.com/api/?background=e2e8f0&color=475569&name=";

export default function TechnikaTasks() {
    const [filterCriteria, setFilterCriteria] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        available: 0,
        pending: 0,
        completed: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [overridingId, setOverridingId] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const [taskList, taskStats] = await Promise.all([
                tasksApi.list(),
                tasksApi.stats(),
            ]);
            setTasks(
                taskList.map((t) => ({
                    id: t._id,
                    name: t.title,
                    location: t.location?.address || t.companyName || "—",
                    technician: t.assignedTo
                        ? fullName(t.assignedTo)
                        : "Unassigned",
                    avatar: `${DEFAULT_AVATAR}${encodeURIComponent(
                        t.assignedTo ? fullName(t.assignedTo) : "N A",
                    )}`,
                    priority: capitalize(t.priority),
                    status: statusLabel(t.status),
                    rawStatus: t.status,
                    disputeReason: t.disputeReason || "",
                })),
            );
            setStats(taskStats);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCreateTask = () => {
        loadData();
    };

    const handleOverride = async (taskId, taskName) => {
        const confirmed = window.confirm(
            `Mark "${taskName}" as completed without a verification code? This bypasses the technician's code entry.`,
        );
        if (!confirmed) return;

        setOverridingId(taskId);
        try {
            await tasksApi.override(taskId);
            await loadData();
        } catch (err) {
            alert(`Could not override: ${err.message}`);
        } finally {
            setOverridingId(null);
        }
    };

    const totalTasks = stats.available + stats.pending + stats.completed;

    const taskStats = [
        {
            label: "Total Tasks",
            value: totalTasks,
            sub: "All operations",
            icon: "fa-clipboard-list",
        },
        {
            label: "In Progress",
            value: stats.pending,
            sub: "Currently being worked on",
            icon: "fa-spinner",
        },
        {
            label: "Completed",
            value: stats.completed,
            sub: "Tasks finished",
            icon: "fa-circle-check",
        },
        {
            label: "Pending",
            value: stats.available,
            sub: "Awaiting technician start",
            icon: "fa-clock",
        },
    ];

    const getPriorityClass = (p) => {
        if (p === "High") return "prio-high";
        if (p === "Medium") return "prio-med";
        return "prio-low";
    };

    const getStatusClass = (s) => {
        if (s === "Completed") return "stat-done";
        if (s === "In Progress") return "stat-progress";
        return "stat-pending";
    };

    // Inline fallback colors for the two new states, since there's no existing
    // CSS class for them yet — safe to move into TaskMonitoring.css later.
    const getStatusInlineStyle = (rawStatus) => {
        if (rawStatus === "disputed") {
            return { backgroundColor: "#fee2e2", color: "#dc2626" };
        }
        if (rawStatus === "awaiting_verification") {
            return { backgroundColor: "#fef3c7", color: "#b45309" };
        }
        return undefined;
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        if (filterCriteria === "all") return matchesSearch;
        if (
            filterCriteria === "High" ||
            filterCriteria === "Medium" ||
            filterCriteria === "Low"
        ) {
            return task.priority === filterCriteria && matchesSearch;
        }
        return task.status === filterCriteria && matchesSearch;
    });

    return (
        <div className="technika-tasks-container">
            <header className="tasks-ui-header">
                <div className="header-text-group">
                    <h2>Operations Managment</h2>
                    <p>Manage and track all your Techncian Tasks</p>
                </div>
                <div className="header-control-buttons">
                    <div className="search-input-wrapper">
                        <i className="fa-solid fa-magnifying-glass search-field-icon"></i>
                        <input
                            type="text"
                            placeholder="Search task name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="tasks-search-field"
                        />
                    </div>
                    <div className="filter-select-wrapper">
                        <i className="fa-solid fa-sliders filter-field-icon"></i>
                        <select
                            className="filter-dropdown-select"
                            value={filterCriteria}
                            onChange={(e) => setFilterCriteria(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="Pending">Status: Pending</option>
                            <option value="In Progress">
                                Status: In Progress
                            </option>
                            <option value="Awaiting Code">
                                Status: Awaiting Code
                            </option>
                            <option value="Disputed">Status: Disputed</option>
                            <option value="Completed">Status: Completed</option>
                            <option value="High">Priority: High</option>
                            <option value="Medium">Priority: Medium</option>
                            <option value="Low">Priority: Low</option>
                        </select>
                    </div>
                    <button
                        className="btn-action-primary-green"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span>+ Create</span>
                    </button>
                </div>
            </header>

            <section className="tasks-dashboard-cards-grid">
                {taskStats.map((stat, i) => (
                    <div
                        key={i}
                        className="task-metric-card-box green-theme-card"
                    >
                        <div className="card-top-header-row">
                            <div className="card-lbl-with-icon">
                                <span className="card-emoji-icon">
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </span>
                                <span className="card-meta-label">
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                        <div className="card-central-numerical-row">
                            <h3 className="card-main-metric-value">
                                {stat.value}
                            </h3>
                        </div>
                        <p className="card-lower-descriptor-text">{stat.sub}</p>
                    </div>
                ))}
            </section>

            <main className="tasks-tabular-data-board">
                <table className="tasks-interactive-table">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Location</th>
                            <th>Assignee</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task) => (
                            <tr key={task.id}>
                                <td className="cell-task-name-text">
                                    {task.name}
                                </td>
                                <td className="cell-project-hub-text">
                                    {task.location}
                                </td>
                                <td className="cell-assignee-profile-badge">
                                    <div className="assignee-inner-capsule">
                                        <img
                                            src={task.avatar}
                                            alt={task.technician}
                                            className="assignee-round-avatar"
                                        />
                                        <span className="assignee-string-name">
                                            {task.technician}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className={`priority-pill-tag ${getPriorityClass(task.priority)}`}
                                    >
                                        {task.priority}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={`status-pill-tag ${getStatusClass(task.status)}`}
                                        style={getStatusInlineStyle(
                                            task.rawStatus,
                                        )}
                                        title={
                                            task.rawStatus === "disputed" &&
                                            task.disputeReason
                                                ? task.disputeReason
                                                : undefined
                                        }
                                    >
                                        {task.status}
                                    </span>
                                </td>
                                <td>
                                    {task.rawStatus === "disputed" && (
                                        <button
                                            className="btn-action-primary-green"
                                            style={{
                                                padding: "4px 10px",
                                                fontSize: 13,
                                            }}
                                            onClick={() =>
                                                handleOverride(
                                                    task.id,
                                                    task.name,
                                                )
                                            }
                                            disabled={overridingId === task.id}
                                        >
                                            {overridingId === task.id
                                                ? "Overriding…"
                                                : "Override & Complete"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredTasks.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="table-empty-fallback"
                                >
                                    {loading
                                        ? "Loading tasks…"
                                        : error
                                          ? `Could not load tasks: ${error}`
                                          : "No tasks match the active filters."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <footer className="table-pagination-footer-bar">
                    <span className="pagination-counter-legend">
                        Showing 1–{filteredTasks.length} of{" "}
                        {filteredTasks.length} tasks
                    </span>
                    <div className="pagination-navigation-actions-cluster">
                        <button className="pagination-arrow-step-btn" disabled>
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button className="pagination-numeric-indicator active-index-highlight">
                            1
                        </button>
                        <button className="pagination-arrow-step-btn" disabled>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </footer>
            </main>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateTask={handleCreateTask}
            />
        </div>
    );
}
