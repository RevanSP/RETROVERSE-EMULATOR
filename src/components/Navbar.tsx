import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
    isDarkMode: boolean;
    handleModeToggle: () => void;
    onContentChange: (targetId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, handleModeToggle, onContentChange }) => {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    useEffect(() => {
        const savedFullscreen = localStorage.getItem('isFullscreen');
        if (savedFullscreen) {
            setIsFullscreen(JSON.parse(savedFullscreen));
            if (JSON.parse(savedFullscreen)) {
                document.documentElement.requestFullscreen();
            }
        }
    }, []);

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
            localStorage.setItem('isFullscreen', JSON.stringify(false));
        } else {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
            localStorage.setItem('isFullscreen', JSON.stringify(true));
        }
    };

    const menuItems = [
        { target: 'HOME', icon: 'bi bi-house-door-fill', label: 'HOME' },
        { target: '2600', icon: 'bi bi-joystick', label: 'ATARI 2600' },
        { target: '5200', icon: 'bi bi-joystick', label: 'ATARI 5200' },
        { target: '7800', icon: 'bi bi-joystick', label: 'ATARI 7800' },
        { target: 'JAGUAR', icon: 'bi bi-joystick', label: 'ATARI JAGUAR' },
        { target: 'LYNX', icon: 'bi bi-joystick', label: 'ATARI LYNX' },
        { target: 'N64', icon: 'bi bi-joystick', label: 'NINTENDO 64' },
        { target: 'NDS', icon: 'bi bi-joystick', label: 'NINTENDO DS' },
        { target: 'NES', icon: 'bi bi-joystick', label: 'NINTENDO ENTERTAINMENT SYSTEM' },
        { target: 'GBA', icon: 'bi bi-joystick', label: 'NINTENDO GAME BOY ADVANCE' },
        { target: 'GB', icon: 'bi bi-joystick', label: 'NINTENDO GAME BOY' },
        { target: 'MS', icon: 'bi bi-joystick', label: 'SEGA MASTER SYSTEM' },
        { target: 'MD', icon: 'bi bi-joystick', label: 'SEGA MEGA DRIVE' },
        { target: 'SNES', icon: 'bi bi-joystick', label: 'SUPER NINTENDO ENTERTAINMENT SYSTEM' },
        { target: 'VBOY', icon: 'bi bi-joystick', label: 'VIRTUAL BOY' },

        { target: 'FULLSCREEN', icon: isFullscreen ? 'bi bi-fullscreen-exit' : 'bi bi-arrows-fullscreen', label: isFullscreen ? 'MINIMIZE' : 'FULLSCREEN', action: toggleFullscreen },
    ];

    return (
        <nav
            id="navbar"
            className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark-mode' : 'navbar-light-mode'} shadow p-2 fixed-top`}
        >
            <div className="container d-flex align-items-center">
                <button
                    id="modeToggle"
                    className={`btn btn-outline-dark btn-sm me-2 ${isDarkMode ? 'btn-toggle-dark-mode' : 'btn-toggle-light-mode'}`}
                    onClick={handleModeToggle}
                >
                    <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
                <Link to={'/'} className="navbar-brand mx-auto">
                    <i className="bi bi-lightning text-small"></i>&nbsp;RETROVERSE
                </Link>
                <div className="dropdown ms-2">
                    <button
                        className="btn btn-option btn-sm d-none d-md-block dropdown-toggle btn-outline-dark btn-toggle-light-mode"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span>CONSOLE</span>
                    </button>
                    <button
                        className="btn btn-option btn-sm d-md-none dropdown-toggle btn-outline-dark btn-toggle-light-mode"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-joystick"></i>
                    </button>
                    <ul
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="dropdownMenuButton"
                    >
                        {menuItems.map((item) => (
                            item.target === 'FULLSCREEN' ? (
                                <li key={item.target}>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={item.action}
                                    >
                                        <i className={item.icon}></i>&nbsp;&nbsp;{item.label}
                                    </a>
                                </li>
                            ) : (
                                <li key={item.target}>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => onContentChange(item.target)}
                                    >
                                        <i className={item.icon}></i>&nbsp;&nbsp;{item.label}
                                    </a>
                                </li>
                            )
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
