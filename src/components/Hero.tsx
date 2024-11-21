/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';

interface HeroProps {
    isDarkMode: boolean;
}

const socialMediaLinks = [
    {
        href: 'https://www.facebook.com/profile.php?id=100082958149027',
        icon: 'bi-facebook',
        title: 'Facebook'
    },
    {
        href: 'https://github.com/RevanSP',
        icon: 'bi-github',
        title: 'GitHub'
    },
    {
        href: 'https://instagram.com/m9nokuro',
        icon: 'bi-instagram',
        title: 'Instagram'
    }
];

const Hero: React.FC<HeroProps> = ({ isDarkMode }) => {
    useEffect(() => {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach((tooltip) => {
            new (window as any).bootstrap.Tooltip(tooltip);
        });
    }, []);

    return (
        <div className={`py-5 container-fluid color-transition text-light mt-5 ${isDarkMode ? 'hero-dark-mode' : 'hero-light-mode'}`}>
            <div className="container-fluid">
                <h1 className="display-5 fw-bold">
                    <i className="bi bi-lightning text-small"></i>&nbsp;RETROVERSE
                </h1>
                <p className="col-md-8 fs-4">
                    At RETROVERSE, I offer a wide range of emulators and games from various platforms. Dive into the world of classic gaming with an extensive library and experience the nostalgia of your favorite retro titles.
                </p>
                <a
                    href="#"
                    className={`btn btn-sm rounded-5 mx-1 float-start mt-2 ${isDarkMode ? 'btn-dark-mode' : 'btn-light-mode'}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Solo Developer"
                >
                    <i className="bi bi-person-circle"></i>
                    <strong>&nbsp;&nbsp;ReiivanTheOnlyOne .</strong>
                </a>
                {socialMediaLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        className={`btn btn-sm rounded-5 mx-1 float-end mt-2 ${isDarkMode ? 'btn-dark-mode' : 'btn-light-mode'}`}
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title={link.title}
                    >
                        <i className={`bi ${link.icon}`}></i>
                    </a>
                ))}
            </div>
            <br />
        </div>
    );
};

export default Hero;
