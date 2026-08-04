import { useState, useMemo, useRef, useEffect } from "react";
import "./Technicians.css";
import Profile from "../../assets/profile.png";
import TechnicianDetailsModal from "./TechnicianDetails/TechnicianProfileModal";
import { usersApi, tasksApi, fullName, statusLabel } from "../../api/services";

function formatDob(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Map a backend technician + their tasks into the directory row / profile shape
function toTechRow(tech, tasks) {
    const techTasks = tasks.filter(
        (t) => t.assignedTo && t.assignedTo._id === tech._id,
    );
    const completed = techTasks.filter((t) => t.status === "completed");
    const active = techTasks.find((t) => t.status !== "completed");

    // Average completion time from acknowledgedAt -> completedAt
    const timed = completed.filter((t) => t.acknowledgedAt && t.completedAt);
    let avgCompletionTime = "—";
    if (timed.length > 0) {
        const avgMs =
            timed.reduce(
                (sum, t) =>
                    sum +
                    (new Date(t.completedAt) - new Date(t.acknowledgedAt)),
                0,
            ) / timed.length;
        avgCompletionTime = `${(avgMs / 3600000).toFixed(1)} hrs`;
    }

    return {
        id: tech._id,
        name: fullName(tech),
        email: tech.email,
        phone: tech.phoneNumber || "—",
        status: tech.isOnline ? "Active" : "Inactive",
        // Account-level enable/disable — distinct from `status` above, which is
        // presence (on/off shift), not whether the account can log in at all.
        accountActive: tech.isActive !== false,
        assignment: active ? active.title : "No Active Task",
        assignmentStatus: active ? statusLabel(active.status) : "",
        avatar: tech.profilePicture || null,
        gender: "—",
        dob: formatDob(tech.birthDate),
        nationality: "—",
        address: "—",
        city: "—",
        state: "—",
        country: "—",
        totalOperations: techTasks.length,
        completedOperations: completed.length,
        pendingOperations: techTasks.length - completed.length,
        avgCompletionTime,
    };
}

export default function Technicians() {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCriteria, setFilterCriteria] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Modal & Index Tracking State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTechIndex, setSelectedTechIndex] = useState(0);

    const ITEMS_PER_PAGE = 5;
    const menuRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const [techs, tasks] = await Promise.all([
                    usersApi.getTechnicians(),
                    tasksApi.list().catch(() => []),
                ]);
                if (!cancelled) {
                    setTechnicians(techs.map((t) => toTechRow(t, tasks)));
                }
            } catch (err) {
                console.error("Failed to load technicians:", err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [searchQuery, filterCriteria]);

    const filteredTechnicians = useMemo(() => {
        return technicians.filter((tech) => {
            const matchesSearch =
                tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tech.email.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;
            if (filterCriteria === "all") return true;
            if (filterCriteria === "name")
                return tech.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            if (filterCriteria === "email")
                return tech.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            if (filterCriteria === "Active" || filterCriteria === "Inactive")
                return tech.status === filterCriteria;

            return true;
        });
    }, [technicians, searchQuery, filterCriteria]);

    const totalItems = filteredTechnicians.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

    const paginatedTechnicians = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTechnicians.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE,
        );
    }, [filteredTechnicians, currentPage]);

    const activeCount = useMemo(
        () => technicians.filter((t) => t.status === "Active").length,
        [technicians],
    );
    const inActiveCount = useMemo(
        () => technicians.filter((t) => t.status === "Inactive").length,
        [technicians],
    );
    const onTaskCount = useMemo(
        () => technicians.filter((t) => t.assignmentStatus !== "").length,
        [technicians],
    );

    const handleToggleActive = async (tech) => {
        const activating = !tech.accountActive;
        const confirmMsg = activating
            ? "Reactivate this technician? They will be able to log in again."
            : "Deactivate this technician? They won't be able to log in until you reactivate them. Their task and chat history is kept.";

        if (!window.confirm(confirmMsg)) {
            setActiveMenuId(null);
            return;
        }
        try {
            const updated = await usersApi.updateTechnician(tech.id, {
                isActive: activating,
            });
            setTechnicians((prev) =>
                prev.map((t) =>
                    t.id === tech.id
                        ? { ...t, accountActive: updated.isActive }
                        : t,
                ),
            );
        } catch (err) {
            alert(
                `Failed to ${activating ? "reactivate" : "deactivate"} technician: ${err.message}`,
            );
        }
        setActiveMenuId(null);
    };

    // Open modal and compute selected index relative to filtered list
    const handleOpenDetailsModal = (tech) => {
        const index = filteredTechnicians.findIndex((t) => t.id === tech.id);
        setSelectedTechIndex(index !== -1 ? index : 0);
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    // Modal navigation callbacks
    const handlePrevProfile = () => {
        if (selectedTechIndex > 0) {
            setSelectedTechIndex((prev) => prev - 1);
        }
    };

    const handleNextProfile = () => {
        if (selectedTechIndex < filteredTechnicians.length - 1) {
            setSelectedTechIndex((prev) => prev + 1);
        }
    };

    return (
        <div className="technicians-screen">
            <header className="technicians-screen-header">
                <div>
                    <h2>Technicians</h2>
                    <p className="technicians-subtitle">
                        Manage your field workforce and operational status.
                    </p>
                </div>
            </header>

            <section className="technicians-summary-grid">
                <div className="technicians-summary-card">
                    <div>
                        <p className="technicians-summary-label">
                            Total Personnel
                        </p>
                        <h3 className="technicians-summary-value">
                            {technicians.length}
                        </h3>
                    </div>
                    <span className="technicians-summary-icon-circle technicians-blue-circle">
                        <i className="fas fa-users"></i>
                    </span>
                </div>
                <div className="technicians-summary-card">
                    <div>
                        <p className="technicians-summary-label">
                            Active Technicians
                        </p>
                        <h3 className="technicians-summary-value">
                            {activeCount}
                        </h3>
                    </div>
                    <span className="technicians-summary-icon-circle technicians-green-circle">
                        <i className="far fa-check-circle"></i>
                    </span>
                </div>
                <div className="technicians-summary-card">
                    <div>
                        <p className="technicians-summary-label">
                            Inactive Technicians
                        </p>
                        <h3 className="technicians-summary-value">
                            {inActiveCount}
                        </h3>
                    </div>
                    <span className="technicians-summary-icon-circle technicians-green-circle">
                        <i className="far fa-x-circle"></i>
                    </span>
                </div>
                <div className="technicians-summary-card">
                    <div>
                        <p className="technicians-summary-label">
                            On Active Task
                        </p>
                        <h3 className="technicians-summary-value">
                            {onTaskCount}
                        </h3>
                    </div>
                    <span className="technicians-summary-icon-circle technicians-gray-circle">
                        <i className="far fa-clock"></i>
                    </span>
                </div>
            </section>

            <main className="technicians-table-container-card">
                <div className="technicians-table-controls-header">
                    <h3>Personnel Directory</h3>
                    <div className="technicians-controls-group">
                        <div className="technicians-search-bar-wrapper">
                            <i className="fas fa-search technicians-search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="technicians-filter-select-wrapper">
                            <i className="fas fa-filter technicians-filter-icon"></i>
                            <select
                                value={filterCriteria}
                                onChange={(e) =>
                                    setFilterCriteria(e.target.value)
                                }
                            >
                                <option value="all">
                                    Filter: All Criteria
                                </option>
                                <option value="name">
                                    Criteria: Name Only
                                </option>
                                <option value="email">
                                    Criteria: Email Only
                                </option>
                                <option value="Active">Status: Active</option>
                                <option value="Inactive">
                                    Status: Inactive
                                </option>
                            </select>
                            <i className="fas fa-chevron-down technicians-select-arrow"></i>
                        </div>
                    </div>
                </div>

                <div className="technicians-responsive-table-wrapper">
                    <table className="technicians-directory-table">
                        <thead>
                            <tr>
                                <th>TECHNICIAN</th>
                                <th>CONTACT DETAILS</th>
                                <th>STATUS</th>
                                <th>CURRENT ASSIGNMENT</th>
                                <th className="technicians-text-right">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTechnicians.map((tech) => (
                                <tr key={tech.id}>
                                    <td>
                                        <div className="technicians-tech-profile-cell">
                                            <div className="technicians-profile-image-circle">
                                                <img
                                                    src={tech.avatar || Profile}
                                                    alt={tech.name}
                                                    className="technicians-avatar-img"
                                                />
                                            </div>
                                            <div>
                                                <p className="technicians-tech-name">
                                                    {tech.name}
                                                    {!tech.accountActive && (
                                                        <span
                                                            style={{
                                                                marginLeft: 8,
                                                                fontSize: 11,
                                                                fontWeight: 600,
                                                                color: "#B42318",
                                                                background:
                                                                    "#FEE4E2",
                                                                borderRadius: 6,
                                                                padding:
                                                                    "2px 8px",
                                                            }}
                                                        >
                                                            Deactivated
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="technicians-tech-id">
                                                    ID: {tech.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="technicians-contact-details-cell">
                                            <p>
                                                <i className="far fa-envelope"></i>{" "}
                                                {tech.email}
                                            </p>
                                            <p>
                                                <i className="fas fa-phone-alt"></i>{" "}
                                                {tech.phone}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className={`technicians-status-tag-badge technicians-status-${tech.status.toLowerCase()}`}
                                        >
                                            {tech.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="technicians-assignment-cell">
                                            <p className="technicians-assignment-title">
                                                {tech.assignment}{" "}
                                                {tech.assignmentStatus && (
                                                    <i className="fas fa-external-link-alt technicians-external-link"></i>
                                                )}
                                            </p>
                                            {tech.assignmentStatus && (
                                                <p className="technicians-assignment-status-desc">
                                                    <span
                                                        className={`technicians-indicator-dot technicians-indicator-${tech.assignmentStatus.toLowerCase().replace(" ", "-")}`}
                                                    ></span>
                                                    {tech.assignmentStatus}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="technicians-text-right technicians-position-relative">
                                        <button
                                            className="technicians-btn-actions-trigger"
                                            onClick={() =>
                                                setActiveMenuId(
                                                    activeMenuId === tech.id
                                                        ? null
                                                        : tech.id,
                                                )
                                            }
                                        >
                                            <i className="fas fa-ellipsis-v"></i>
                                        </button>

                                        {activeMenuId === tech.id && (
                                            <div
                                                className="technicians-actions-fade-menu"
                                                ref={menuRef}
                                            >
                                                <button
                                                    className="technicians-menu-action-item"
                                                    onClick={() =>
                                                        handleOpenDetailsModal(
                                                            tech,
                                                        )
                                                    }
                                                >
                                                    <i className="far fa-eye"></i>{" "}
                                                    View Details
                                                </button>
                                                <button
                                                    className="technicians-menu-action-item technicians-remove"
                                                    onClick={() =>
                                                        handleToggleActive(tech)
                                                    }
                                                >
                                                    <i
                                                        className={
                                                            tech.accountActive
                                                                ? "fas fa-user-slash"
                                                                : "fas fa-user-check"
                                                        }
                                                    ></i>{" "}
                                                    {tech.accountActive
                                                        ? "Deactivate"
                                                        : "Reactivate"}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {paginatedTechnicians.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="technicians-empty-state-cell"
                                    >
                                        {loading
                                            ? "Loading technicians…"
                                            : "No matching technicians located."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="technicians-table-pagination-footer">
                    <span className="technicians-showing-entries-text">
                        Showing <strong>{paginatedTechnicians.length}</strong>{" "}
                        of <strong>{totalItems}</strong> technicians
                    </span>
                    <div className="technicians-pagination-nav-controls">
                        <button
                            className="technicians-nav-arrow-btn"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    className={`technicians-page-num-btn ${currentPage === pageNumber ? "technicians-active" : ""}`}
                                    onClick={() => setCurrentPage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            className="technicians-nav-arrow-btn"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages),
                                )
                            }
                        >
                            Next
                        </button>
                    </div>
                </footer>
            </main>

            <footer className="technicians-policy-reminder-alert">
                <div className="technicians-reminder-icon-wrapper">
                    <i className="far fa-clock"></i>
                </div>
                <div>
                    <h4>Operational Policy Reminder</h4>
                    <p>
                        Technicians marked as "Inactive" for more than 14 days
                        without an approved leave request should be reviewed for
                        deactivation. Ensure all contact information is kept
                        up-to-date for emergency dispatch protocols.
                    </p>
                </div>
            </footer>

            {/* External Details Modal with Profile Navigation */}
            <TechnicianDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                technician={filteredTechnicians[selectedTechIndex]}
                allTechnicians={filteredTechnicians}
                currentIndex={selectedTechIndex}
                onPrev={handlePrevProfile}
                onNext={handleNextProfile}
                defaultAvatar={Profile}
            />
        </div>
    );
}
