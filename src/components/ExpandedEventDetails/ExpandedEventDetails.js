import React, { useState } from 'react';
import { formatDate } from "../../utils/formatDate";
import './ExpandedEventDetails.scss'
import imageLoader from '../../utils/imageLoader';

const Spinner = () => <div className="spinner"></div>;

const ExpandedEventDetails = ({ event, imageContext }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="expanded-event-details">
      {isLoading && <Spinner />}
      <img
        src={imageLoader(imageContext, event.imageFilenameFull)}
        alt={event.title}
        onLoad={() => setIsLoading(false)}
        className="expanded-event-image" />
      <div className="expanded-event-text">
        <h3>{event.title}</h3>
        <p dangerouslySetInnerHTML={{ __html: event.summary}}></p>
        <p>Available: {formatDate(event.launchDate)}</p>
        <a href={event.learnMoreLink} target="_blank" className='blue-btn' rel="noopener noreferrer">Learn More</a>
        <a href={event.purchaseLink} target="_blank" className='red-btn' rel="noopener noreferrer">Pre Order Now</a>
      </div>
    </div>
  );
};

export default ExpandedEventDetails;