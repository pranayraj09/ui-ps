import React from 'react';
import './Header.scss';

const Header = ({ monthName, year, goToPreviousMonth, goToNextMonth }) => {
  return (
    <div className="header">
      <button onClick={goToPreviousMonth} className="chevron chevron-prev" />
      <h2>{`${monthName} ${year}`}</h2>
      <button onClick={goToNextMonth} className="chevron chevron-next" />
    </div>
  );
};
  
export default Header;
  