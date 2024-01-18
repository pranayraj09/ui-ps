export const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long' };
  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);

  // Format the date as "Month Dayth"
  const monthDay = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date) + ` ${day}${ordinalSuffix}`;

  // Get the year
  const year = date.getFullYear();

  return `${monthDay} ${year}`;
};