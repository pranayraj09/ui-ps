import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { weekNames, monthNames } from '../../utils/strings'
import { fetchEvents } from '../../utils/apiConfig';
import Header from '../Header/Header';
import ExpandedEventDetails from '../ExpandedEventDetails/ExpandedEventDetails';
import Event from '../Event/Event';
import './Calendar.scss';

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const imageContext = require.context('../../assets', true, /\.(webp|jpeg|jpg)$/i);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const { year, month } = useParams();

  // Convert string params to numbers
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  // Validate year and month
  const isValidMonth = month >= 1 && month <= 12;
  const isValidYear = year >= 1;
  const isDateValid = isValidMonth && isValidYear;

  useEffect(() => {
    if (!isDateValid) {
      // Current year and month
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      // Redirecting to current year and month
      navigate(`${process.env.PUBLIC_URL}/${currentYear}/${currentMonth}`);
    } else {
      // Fetching events if the date is valid
      const getEvents = async () => {
        const eventsData = await fetchEvents();
        console.log(eventsData);
        setEvents(eventsData);
      };

      getEvents();
    }
  }, [year, month, isDateValid, navigate]);

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

  const getEventsOnDate = (date) => {
    return events.filter(event => {
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

  const goToPreviousMonth = () => {
    const newYear = monthNum === 1 ? yearNum - 1 : yearNum;
    const newMonth = monthNum === 1 ? 12 : monthNum - 1;
    navigate(`${process.env.PUBLIC_URL}/${newYear}/${newMonth}`);
  };

  const goToNextMonth = () => {
    const newYear = monthNum === 12 ? yearNum + 1 : yearNum;
    const newMonth = monthNum === 12 ? 1 : monthNum + 1;
    navigate(`${process.env.PUBLIC_URL}/${newYear}/${newMonth}`);
  };

  const renderWeeks = () => {
    const totalCells = Math.ceil((firstDayOfMonth + calendarDays.length) / 7) * 7;
    const weeks = [];
    let weekDays = [];
    let weekEvents = [];
  
    for (let cell = 0; cell < totalCells; cell++) {
      const dateIndex = cell - firstDayOfMonth;
      const date = calendarDays[dateIndex];
  
      if (date) {
        const dayEvents = getEventsOnDate(date);
        const hasEvent = dayEvents.length > 0;
        if (hasEvent) {
          weekEvents.push(dayEvents[0]);
        }
  
        weekDays.push(
          <div key={date.toString()} className={`date-cell ${hasEvent ? 'event-day' : ''}`} 
            onClick={() => {
              if (hasEvent) {
                setExpandedEventId(expandedEventId === dayEvents[0].id ? null : dayEvents[0].id);
              }
            }}
          >
            <span className="date-number">
              {date.getDate()}
            </span>
            <div className="events">
              {dayEvents.map(event => (
                <div key={event.id} className="event">
                  {dayEvents.map(event => (
                    <Event key={event.id} event={event} imageContext={imageContext} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        weekDays.push(<div key={`empty-${cell}`} className="date-cell empty"></div>);
      }
  
      // Check if the week is complete, or if we're at the end of the calendar cells
      if ((cell + 1) % 7 === 0 || cell === totalCells - 1) {
        weeks.push(<div key={`week-${weeks.length}`} className="week-row">{weekDays}</div>);
        weekEvents.forEach((event) => {
          if (expandedEventId === event.id) {
            weeks.push(
              <div key={`details-${event.id}`} className="event-details-row">
                <ExpandedEventDetails event={event} imageContext={imageContext} />
              </div>
            );
          }
        });
  
        // Reset for the next week
        weekDays = [];
        weekEvents = [];
      }
    }
  
    return weeks;
  };

  return (
    <div className="calendar">
      <Header
        monthName={monthNames[monthNum - 1]} 
        year={yearNum}
        goToPreviousMonth={goToPreviousMonth} 
        goToNextMonth={goToNextMonth} 
      />
      <div className="days-of-week">
        {weekNames.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}
      </div>
      <div className="dates-grid">
        {renderWeeks()}
      </div>
    </div>
  );
};

export default Calendar;
