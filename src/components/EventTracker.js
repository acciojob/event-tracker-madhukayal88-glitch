import React, { useState, useCallback, useMemo } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Popup from 'react-popup';
import EventPopup from './EventPopup';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles.css';

const localizer = momentLocalizer(moment);

function EventTracker() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Handle date click - opens create event popup
  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsPopupOpen(true);
  }, []);

  // Handle event click - opens edit/delete popup
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsPopupOpen(true);
  }, []);

  // Add new event
  const handleAddEvent = useCallback((eventData) => {
    const newEvent = {
      id: Date.now(),
      title: eventData.title,
      location: eventData.location,
      start: new Date(selectedDate),
      end: new Date(selectedDate),
      allDay: false,
      isPast: moment(selectedDate).isBefore(moment(), 'day'),
    };
    setEvents(prev => [...prev, newEvent]);
    setIsPopupOpen(false);
  }, [selectedDate]);

  // Edit existing event
  const handleEditEvent = useCallback((eventData) => {
    setEvents(prev => prev.map(event => 
      event.id === selectedEvent.id 
        ? { 
            ...event, 
            title: eventData.title,
            location: eventData.location,
            isPast: moment(event.start).isBefore(moment(), 'day')
          }
        : event
    ));
    setIsPopupOpen(false);
  }, [selectedEvent]);

  // Delete event
  const handleDeleteEvent = useCallback(() => {
    setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
    setIsPopupOpen(false);
  }, [selectedEvent]);

  // Filter events
  const filteredEvents = useMemo(() => {
    const now = moment();
    switch(filter) {
      case 'past':
        return events.filter(event => moment(event.start).isBefore(now, 'day'));
      case 'upcoming':
        return events.filter(event => moment(event.start).isAfter(now, 'day') || moment(event.start).isSame(now, 'day'));
      default:
        return events;
    }
  }, [events, filter]);

  // Event style getter
  const eventStyleGetter = useCallback((event) => {
    const isPast = moment(event.start).isBefore(moment(), 'day');
    return {
      style: {
        backgroundColor: isPast ? '#de6987' : '#8cbd4c',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        padding: '2px 6px',
        fontWeight: '600',
        fontSize: '12px',
      }
    };
  }, []);

  return (
    <div className="event-tracker-container">
      <div className="header">
        <h1>📅 Event Tracker</h1>
        <div className="filter-buttons">
          <button 
            className={`btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
          <button 
            className={`btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
        </div>
      </div>

      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable={true}
          eventPropGetter={eventStyleGetter}
          popup={true}
          views={['month']}
          defaultView="month"
        />
      </div>

      {/* Popup for Create/Edit/Delete */}
      {isPopupOpen && (
        <Popup
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          closeOnOutsideClick={false}
        >
          <EventPopup
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            onAdd={handleAddEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setIsPopupOpen(false)}
          />
        </Popup>
      )}

      <div className="legend">
        <div className="legend-item">
          <span className="legend-color past"></span>
          Past Events
        </div>
        <div className="legend-item">
          <span className="legend-color upcoming"></span>
          Upcoming Events
        </div>
      </div>
    </div>
  );
}

export default EventTracker;
