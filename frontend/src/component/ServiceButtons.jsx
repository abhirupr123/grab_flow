import React from 'react';

export default function ServiceButtons({ services, onServiceClick }) {
  return (
    <div className="gfa-services">
      {services.map(service => (
        <button
          key={service}
          onClick={() => onServiceClick(service)}
          className="gfa-service-btn"
          aria-label={`Suggest integration for ${service}`}
        >
          {service}
        </button>
      ))}
    </div>
  );
}