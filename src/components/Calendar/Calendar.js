import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { weekNames, monthNames } from '../../utils/strings'
import { fetchEvents } from '../../utils/api-config';
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
    return events.find(event => {
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
          imageSrc = ''; // Fallback?
        }
      }
      
      return (
        <div key={event.id} className="event">
          <img src={imageSrc} className="poster" alt={event.title} />
        </div>
      );
    });
  };

  // Function to render expanded event details
  const renderExpandedEventDetails = (event) => {

    let imageSrcFull;
    try {
      imageSrcFull = imageContext(`./${event.imageFilenameFull}.webp`);
    } catch (webpError) {
      try {
        imageSrcFull = imageContext(`./${event.imageFilenameFull}.jpeg`);
      } catch (jpegError) {
        console.error(`Could not find image: ./${event.imageFilenameFull}`);
        imageSrcFull = ''; // Fallback?
      }
    }

    return (
      <div className="expanded-event-details">
        <img src={imageSrcFull} alt={event.title} className="expanded-event-image" />
        <div className="expanded-event-text">
          <h3>{event.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: event.summary}}></p>
          <p>Available: {new Date(event.launchDate).toLocaleDateString()}</p>
          <a href={event.learnMoreLink} target="_blank" rel="noopener noreferrer">Learn More</a>
          <a href={event.purchaseLink} target="_blank" rel="noopener noreferrer">Pre Order Now</a>
        </div>
      </div>
    );
  };

  const renderWeeks = () => {
    const totalDays = firstDayOfMonth + calendarDays.length;
    const numberOfWeeks = Math.ceil(totalDays / 7);
    const weeks = [];
  
    for (let week = 0; week < numberOfWeeks; week++) {
      const days = [];
      let hasEventInWeek = false;
      let weekEvent;
  
      for (let day = 0; day < 7; day++) {
        const dateIndex = week * 7 + day - firstDayOfMonth;
        const date = calendarDays[dateIndex];
  
        if (date) {
          const event = hasEventsOnDate(date);

          if (event && !hasEventInWeek) {
            hasEventInWeek = true;
            weekEvent = event;
          }
  
          days.push(
            <div key={date.toString()} className={`date-cell ${event ? 'event-day' : ''}`}>
              <span 
                className="date-number"
                onClick={() => {
                  if (event) {
                    setExpandedEventId(expandedEventId === event.id ? null : event.id);
                  }
                }}              >
                {date.getDate()}
              </span>
              <div className="events">
                {renderEventsForDate(date)}
              </div>
            </div>
          );
        } else {
          // Fill in the blanks for the first and last weeks
          days.push(<div key={`empty-${week}-${day}`} className="date-cell empty"></div>);
        }
      }
  
      weeks.push(<div key={`week-${week}`} className="week-row">{days}</div>);
  
      // Render the expanded event details if there's an event in the week and its expanded
      if (expandedEventId && weekEvent && expandedEventId === weekEvent.id) {
        weeks.push(
          <div key={`details-${week}`} className="event-details-row">
            {renderExpandedEventDetails(weekEvent)}
          </div>
        );
      }
    }
  
    return weeks;
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
        {renderWeeks()}
      </div>
    </div>
  );
};

export default Calendar;
