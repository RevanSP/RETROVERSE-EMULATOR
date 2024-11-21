import React, { useEffect, useRef } from 'react';

const LogoSlider: React.FC = () => {
    const sliderContentRef = useRef<HTMLDivElement | null>(null);
    const sliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const sliderContent = sliderContentRef.current;
        const slider = sliderRef.current;

        if (sliderContent && slider) {
            const fadeIn = () => {
                slider.classList.add('fade-in');
                slider.classList.remove('fade-out');
            };

            const fadeOut = () => {
                slider.classList.add('fade-out');
                slider.classList.remove('fade-in');
            };

            let lastScrollPosition = 0;
            const checkScroll = () => {
                const scrollPosition = sliderContent.scrollLeft;
                if (scrollPosition < lastScrollPosition) {
                    fadeIn();
                } else {
                    fadeOut();
                }
                lastScrollPosition = scrollPosition;
            };

            sliderContent.addEventListener('scroll', checkScroll);

            return () => {
                sliderContent.removeEventListener('scroll', checkScroll);
            };
        }
    }, []);

    return (
        <div className="logo-slider" ref={sliderRef}>
            <div className="slider-content" ref={sliderContentRef}>
                <div className="slider-items">
                    <img src="img/Atari-Logo.svg" alt="Atari Logo" className="rounded-lg rounded-5 img-fluid" />
                    <img src="img/Nintendo.svg" alt="Nintendo Logo" className="rounded-lg rounded-pill img-fluid" />
                    <img src="img/SEGA_logo.svg" alt="SEGA Logo" className="img-fluid" />
                    <img src="img/Atari-Logo.svg" alt="Atari Logo" className="rounded-lg rounded-5 img-fluid" />
                    <img src="img/Nintendo.svg" alt="Nintendo Logo" className="rounded-lg rounded-pill img-fluid" />
                    <img src="img/SEGA_logo.svg" alt="SEGA Logo" className="img-fluid" />
                </div>
            </div>
        </div>
    );
};

export default LogoSlider;
