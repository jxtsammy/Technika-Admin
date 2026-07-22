import { useState } from 'react';
import './ReportModal.css';

export default function OperationReportModal({
  isOpen,
  onClose,
  report,
  allReports = [],
  currentIndex = 0,
  onPrev,
  onNext
}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isViewerMode, setIsViewerMode] = useState(false);

  if (!isOpen || !report) return null;

  const isFirstReport = currentIndex === 0;
  const isLastReport = currentIndex === allReports.length - 1;

  const mediaList = report.photoEvidences || report.images || [];
  const totalMediaCount = mediaList.length;

  const isFirstMedia = activeMediaIndex === 0;
  const isLastMedia = activeMediaIndex === totalMediaCount - 1;

  const handleOpenViewer = () => {
    if (totalMediaCount > 0) {
      setActiveMediaIndex(0);
      setIsViewerMode(true);
    }
  };

  const handlePrevMedia = () => {
    setActiveMediaIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextMedia = () => {
    setActiveMediaIndex((prev) => Math.min(totalMediaCount - 1, prev + 1));
  };

  const handleCloseViewer = () => {
    setIsViewerMode(false);
  };

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Top Header Navigation */}
        <header className="report-modal-nav">
          {isViewerMode ? (
            <button className="report-nav-action-btn" onClick={handleCloseViewer}>
              <i className="fas fa-arrow-left"></i> Back to Report
            </button>
          ) : (
            <button className="report-nav-action-btn" onClick={onClose}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
          )}

          {/* Navigation Controls in Header (Swaps between Report & Image navigation) */}
          <div className="report-profile-nav-group">
            {isViewerMode ? (
              totalMediaCount > 1 && (
                <>
                  <button
                    className={`report-nav-action-btn ${isFirstMedia ? 'report-disabled' : ''}`}
                    onClick={handlePrevMedia}
                    disabled={isFirstMedia}
                  >
                    <i className="fas fa-chevron-left"></i> Previous Image
                  </button>
                  <button
                    className={`report-nav-action-btn ${isLastMedia ? 'report-disabled' : ''}`}
                    onClick={handleNextMedia}
                    disabled={isLastMedia}
                  >
                    Next Image <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )
            ) : (
              <>
                <button
                  className={`report-nav-action-btn ${isFirstReport ? 'report-disabled' : ''}`}
                  onClick={onPrev}
                  disabled={isFirstReport}
                >
                  <i className="fas fa-chevron-left"></i> Previous Report
                </button>
                <button
                  className={`report-nav-action-btn ${isLastReport ? 'report-disabled' : ''}`}
                  onClick={onNext}
                  disabled={isLastReport}
                >
                  Next Report <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}
          </div>
        </header>

        {!isViewerMode ? (
          <div className="report-modal-content report-fade-in">

            {/* Left Column: Operation Details & Client Info */}
            <div className="report-left-column">
              <section className="report-section">
                <h3 className="report-section-title">Field Operation Details</h3>
                <div className="report-details-grid">

                  <div className="report-verification-photo-card">
                    <img
                      src={report.technicianAvatar || "https://via.placeholder.com/200?text=Technician"}
                      alt={report.technicianName || 'Technician'}
                      className="report-verification-img"
                    />
                  </div>

                  <div className="report-details-fields-group">
                    <div className="report-field-item">
                      <span className="report-field-label">Field Technician</span>
                      <p className="report-field-value">{report.technicianName || 'N/A'}</p>
                    </div>

                    <div className="report-field-item">
                      <span className="report-field-label">Field Operation Title</span>
                      <p className="report-field-value">{report.operationTitle || 'N/A'}</p>
                    </div>

                    <div className="report-field-item">
                      <span className="report-field-label">Operations Description</span>
                      <p className="report-field-value">{report.operationDescription || 'N/A'}</p>
                    </div>

                    <div className="report-field-item">
                      <span className="report-field-label">Priority Level</span>
                      <p className="report-field-value report-priority-badge">{report.priorityLevel || 'Medium'}</p>
                    </div>
                  </div>

                </div>
              </section>

              <section className="report-section">
                <h3 className="report-section-title">Location & Client</h3>
                <div className="report-location-row-grid">
                  <div className="report-field-item">
                    <span className="report-field-label">Name of Company</span>
                    <p className="report-field-value">{report.companyName || 'N/A'}</p>
                  </div>
                  <div className="report-field-item">
                    <span className="report-field-label">Operation Location</span>
                    <p className="report-field-value">{report.operationLocation || 'N/A'}</p>
                  </div>
                  <div className="report-field-item">
                    <span className="report-field-label">Phone of Client</span>
                    <p className="report-field-value">{report.clientPhone || 'N/A'}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="report-right-column">
              <section className="report-section">
                <h3 className="report-section-title">Photo Evidences</h3>
                <div
                  className={`report-evidence-attachment-card ${totalMediaCount === 0 ? 'report-disabled' : ''}`}
                  onClick={handleOpenViewer}
                >
                  <div className="report-evidence-icon-wrapper">
                    <i className="fas fa-camera-retro"></i>
                  </div>
                  <div className="report-evidence-info">
                    <span className="report-evidence-title">Attached Evidences</span>
                    <span className="report-evidence-count">
                      {totalMediaCount} {totalMediaCount === 1 ? 'file' : 'files'}
                    </span>
                  </div>
                  {totalMediaCount > 0 && (
                    <i className="fas fa-chevron-right report-evidence-arrow"></i>
                  )}
                </div>
              </section>

              <section className="report-section report-full-height-report">
                <h3 className="report-section-title">Technician Report</h3>
                <div className="report-text-container">
                  <p>{report.summary || report.reportText || 'No report detailed for this task.'}</p>
                </div>
              </section>
            </div>

          </div>
        ) : (
          /* Image Gallery Viewer Mode */
          <div className="report-media-viewer-container report-fade-in">
            <div className="report-media-viewport">
              {mediaList.length > 0 ? (
                <img
                  src={mediaList[activeMediaIndex]}
                  alt={`Evidence ${activeMediaIndex + 1}`}
                  className="report-active-media-element"
                />
              ) : (
                <p className="report-no-media-text">No evidence photos attached.</p>
              )}
            </div>

            {totalMediaCount > 0 && (
              <div className="report-media-counter-badge">
                Image {activeMediaIndex + 1} of {totalMediaCount}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}