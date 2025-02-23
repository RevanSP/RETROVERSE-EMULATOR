import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
      setIsContentVisible(true); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div
        className={`${
          isContentVisible
            ? "opacity-100 transition-opacity duration-1000 ease-out"
            : "opacity-0"
        }`}
      >
        <Component {...pageProps} />
      </div>
    </>
  );
}