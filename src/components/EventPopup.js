import React, { useState, useEffect } from 'react';
import moment from 'moment';

function EventPopup({ selectedDate, selectedEvent, onAdd, onEdit, onDelete, onClose }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || '');
      setLocation(selectedEvent.location || '');
      setIsEditMode(true);
    } else {
      setTitle('');
      setLocation('');
      setIsEditMode(false);
    }
  }, [selectedEvent]);

  const handleSubmit = () => {
    if (!title.trim() || !location.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (isEditMode) {
      onEdit({ title, location });
    } else {
      onAdd({ title, location });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete();
    }
  };

  const dateDisplay = selectedDate 
    ? moment(selectedDate).format('MMMM D, YYYY')
    : selectedEvent 
      ? moment(selectedEvent.start).format('MMMM D, YYYY')
      : '';

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h2>{isEditMode ? '✏️ Edit Event' : '📝 Create Event'}</h2>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>

      <div className="popup-body">
        <div className="popup-date">
          <strong>📅 Date:</strong> {dateDisplay}
        </div>

        <div className="popup-field">
          <label>Event Title</label>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="popup-input"
          />
        </div>

        <div className="popup-field">
          <label>Location</label>
          <input
            type="text"
            placeholder="Event Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="popup-input"
          />
        </div>
      </div>

      <div className="popup-footer">
        <div className="popup-footer-left">
          {isEditMode && (
            <button 
              className="mm-popup__btn mm-popup__btn--danger"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}
        </div>
        <div className="popup-footer-right">
          <button 
            className="mm-popup__btn mm-popup__btn--info"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="mm-popup__btn"
            onClick={handleSubmit}
          >
            💾 Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventPopup;
