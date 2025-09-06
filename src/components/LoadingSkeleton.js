import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-thumbnail">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-title">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="skeleton-meta">
              <div className="skeleton-channel">
                <div className="skeleton-avatar">
                  <div className="skeleton-shimmer"></div>
                </div>
                <div className="skeleton-channel-name">
                  <div className="skeleton-shimmer"></div>
                </div>
              </div>
              <div className="skeleton-stats">
                <div className="skeleton-stat">
                  <div className="skeleton-shimmer"></div>
                </div>
                <div className="skeleton-stat">
                  <div className="skeleton-shimmer"></div>
                </div>
              </div>
            </div>
            <div className="skeleton-description">
              <div className="skeleton-shimmer"></div>
              <div className="skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
