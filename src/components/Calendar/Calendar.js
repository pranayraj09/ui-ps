import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { weekNames, monthNames } from '../../Utils/strings';
import './Calendar.scss';

const Calendar = () => {
  const navigate = useNavigate();
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
            {date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
