import React, { useEffect } from 'react';

const Loader: React.FC = () => {
  useEffect(() => {
    const hasShownLoader = localStorage.getItem('hasShownLoader');
    if (hasShownLoader) {
      const content = document.getElementById('content');
      if (content) {
        content.style.display = 'block';
      }
      document.getElementById('loaderContainer')?.classList.add('hidden');
      return;
    }

    setTimeout(() => {
      const loaderContainer = document.getElementById('loaderContainer');
      if (loaderContainer) {
        loaderContainer.classList.add('fade-out');
        setTimeout(() => {
          loaderContainer.classList.add('hidden');
          const content = document.getElementById('content');
          if (content) {
            content.style.display = 'block';
          }
          localStorage.setItem('hasShownLoader', 'true');
        }, 500);
      }
    }, 2000);
  }, []);

  return (
    <div className="loader-container" id="loaderContainer">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
