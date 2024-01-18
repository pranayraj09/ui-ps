import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { weekNames, monthNames } from '../../utils/strings'
import { fetchEvents } from '../../utils/api-config';
import './Calendar.scss';

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const { year, month } = useParams();

  // Convert string params to numbers
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  // Validate year and month
  const isValidMonth = month >= 1 && month <= 12;
  const isValidYear = year >= 1;
  const isDateValid = isValidMonth && isValidYear;
  
  if (!isDateValid) {
    return <div>Invalid date. Please use a valid month (1-12) and year (e.g., /2019/1).</div>;
  }

  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents();
      console.log(eventsData);
      setEvents(eventsData);
    };

    getEvents();
  }, []);

  // Helper function to generate the days in the month
  const generateCalendarDays = (year, month) => {
    const date = new Date(year, month - 1, 1);
    const days = [];
    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // Generate the days for the current month
  const calendarDays = generateCalendarDays(year, month);

  // Get the first day of the month
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  const goToPreviousMonth = () => {
    const newYear = monthNum === 1 ? yearNum - 1 : yearNum;
    const newMonth = monthNum === 1 ? 12 : monthNum - 1;
    navigate(`/${newYear}/${newMonth}`);
  };

  const goToNextMonth = () => {
    const newYear = monthNum === 12 ? yearNum + 1 : yearNum;
    const newMonth = monthNum === 12 ? 1 : monthNum + 1;
    navigate(`/${newYear}/${newMonth}`);
  };

  // Function to render events for a given date
  const renderEventsForDate = (date) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.launchDate);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });

    return dayEvents.map(event => {
      return (
        <div key={event.id} className="event">
          <img src={require(`../../assets/${event.imageFilenameThumb}.webp`).default} alt={event.title} />
          <span>{event.title}</span>
        </div>
      );
    });
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <h2>{`${monthNames[monthNum - 1]} ${yearNum}`}</h2>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>
      <div className="days-of-week">
        {weekNames.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}
      </div>
      <div className="dates-grid">
        {/* Empty cells if the month does not start on Sunday */}
        {Array.from({ length: firstDayOfMonth }, (_, index) => (
          <div key={index} className="date-cell empty"></div>
        ))}
        {/* Days of the month */}
        {calendarDays.map(date => (
          <div key={date.toString()} className="date-cell">
            <span className="date-number">{date.getDate()}</span>
            <div className="events">
              {renderEventsForDate(date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
