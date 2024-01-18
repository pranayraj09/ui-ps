import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { weekNames, monthNames } from '../../utils/strings'
import { fetchEvents } from '../../utils/api-config';
import './Calendar.scss';

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const imageContext = require.context('../../assets', true, /\.webp$/);
  const [expandedEventId, setExpandedEventId] = useState(null);
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

  // Generate the days in the month
  const generateCalendarDays = (year, month) => {
    const date = new Date(year, month - 1, 1);
    const days = [];
    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // Function to check if a date has events
  const hasEventsOnDate = (date) => {
    return events.some(event => {
      const eventDate = new Date(event.launchDate);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  };

  // Generate the days for the current month
  const calendarDays = generateCalendarDays(year, month);

  // Get the first day of the month
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  // Last day of the month
  const lastDayOfMonth = new Date(yearNum, monthNum, 0).getDay();
  const cellsToAdd = lastDayOfMonth === 6 ? 0 : 7 - (lastDayOfMonth + 1);

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
      let imageSrc;
      try {
        imageSrc = imageContext(`./${event.imageFilenameThumb}.webp`);
      } catch (webpError) {
        try {
          imageSrc = imageContext(`./${event.imageFilenameThumb}.jpeg`);
        } catch (jpegError) {
          console.error(`Could not find image: ./${event.imageFilenameThumb}`);
          imageSrc = ''; // Fallback image path
        }
      }
      
      return (
        <div key={event.id} className="event">
          <img src={imageSrc} className="poster" alt={event.title} />
        </div>
      );
    });
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={goToPreviousMonth} className="chevron chevron-prev"></button>
        <h2>{`${monthNames[monthNum - 1]} ${yearNum}`}</h2>
        <button onClick={goToNextMonth} className="chevron chevron-next"></button>
      </div>
      <div className="days-of-week">
        {weekNames.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}
      </div>
      <div className="dates-grid">
        {/* Empty cells to fill first week row */}
        {Array.from({ length: firstDayOfMonth }, (_, index) => (
          <div key={`empty-start-${index}`} className="date-cell empty"></div>
        ))}
        {/* Days of the month */}
        {calendarDays.map(date => {
          const hasEvent = hasEventsOnDate(date);
          return (
            <div key={date.toString()} className={`date-cell ${hasEvent ? 'event-day' : ''}`}>
              <span className="date-number">
                {date.getDate()}
              </span>
              <div className="events">
                {renderEventsForDate(date)}
              </div>
            </div>
          );
        })}
        {/* Empty cells to complete the last week row */}
        {Array.from({ length: cellsToAdd }, (_, index) => (
          <div key={`empty-end-${index}`} className="date-cell empty"></div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
