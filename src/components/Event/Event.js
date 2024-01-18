import React from 'react';
import imageLoader from '../../utils/imageLoader';

const Event = ({ event, imageContext }) => {
  const imageSrc = imageLoader(imageContext, event.imageFilenameThumb);
  console.log(event.id)
  return (
    <div key={event.id} className="event">
      <img src={imageSrc} className="poster" alt={event.title} />
    </div>
  );
};

export default Event;
