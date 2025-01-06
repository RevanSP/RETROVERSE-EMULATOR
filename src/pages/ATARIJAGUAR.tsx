
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const ATARIJAGUAR: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [activeModalId, setActiveModalId] = useState<string | null>(null);

    useEffect(() => {
        const handleShow = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target) setActiveModalId(target.getAttribute('data-bs-target')?.slice(1) || null);
        };

        const handleHide = () => {
            setActiveModalId(null);
        };

        document.addEventListener('show.bs.modal', handleShow);
        document.addEventListener('hide.bs.modal', handleHide);

        return () => {
            document.removeEventListener('show.bs.modal', handleShow);
            document.removeEventListener('hide.bs.modal', handleHide);
        };
    }, []);

    const games: Game[] = [
        { imgSrc: "img/covers/atari-jaguar/atarikarts.jpg", imgAlt: "atarikarts", modalId: "atarikarts" },
        { imgSrc: "img/covers/atari-jaguar/doom.jpg", imgAlt: "doom", modalId: "doom" },
        { imgSrc: "img/covers/atari-jaguar/doubledragon.jpg", imgAlt: "doubledragon", modalId: "doubledragon" },
        { imgSrc: "img/covers/atari-jaguar/nbajam.jpg", imgAlt: "nbajam", modalId: "nbajam" },
        { imgSrc: "img/covers/atari-jaguar/rayman.jpg", imgAlt: "rayman", modalId: "rayman" },
    ];

    const gameModals = [
        {
            id: "atarikarts",
            title: "Atari Karts",
            developer: "Miracle Designs",
            releaseDate: "1995-12-15",
            genre: "Racing",
            description: `Atari Karts is a kart racing game where players
                                    control one of several characters, including the famous Atari mascot, Bentley Bear,
                                    across various colorful tracks. The game features power-ups and obstacles, adding to
                                    the fun and challenge of the races.`,
            videoSrc: "https://www.youtube.com/embed/awsYwI3cpxA?si=zfSQOeBZurRWEIPE",
        },
        {
            id: "doom",
            title: `Doom`,
            developer: `ID SOFTWARE`,
            releaseDate: `1994-11-01`,
            genre: `First-Person Shooter`,
            videoSrc: `https://www.youtube.com/embed/AIUH2qUTEfw?si=ZazNbWnGmoOzRfc6`,
            description: ` DOOM is a pioneering first-person shooter game that brings the intense and
                                    fast-paced action of demon-slaying to the Atari Jaguar. Players take on the role of
                                    a space marine, fighting through hordes of demonic enemies in an effort to survive
                                    and stop the invasion. Featuring a variety of weapons, from the iconic shotgun to
                                    the powerful BFG 9000, DOOM challenges players with its labyrinthine levels and
                                    relentless enemies. The game's atmospheric graphics and sound design contribute to
                                    its enduring legacy as a landmark title in the first-person shooter genre.`,
        },
        {
            id: "doubledragon",
            title: `Double Dragon V: The Shadow Falls`,
            developer: `Leland Interactive Media`,
            releaseDate: `1994-08-10`,
            genre: `Fighting`,
            videoSrc: `https://www.youtube.com/embed/zAEfiCPyogs?si=KDvOgEov3nTZoxKR`,
            description: `Double Dragon V: The Shadow Falls is a fighting game
                                    based on the Double Dragon animated series. Players can choose from a variety of
                                    characters, each with unique moves and abilities, to battle through a tournament and
                                    defeat the Shadow Master. The game features both single-player and multiplayer
                                    modes.`,
        },
        {
            id: "nbajam",
            title: `NBA Jam`,
            developer: `ACCLAIM ENTERTAINMENT`,
            releaseDate: `1994-12-09`,
            genre: `Sports`,
            videoSrc: `https://www.youtube.com/embed/AizXssO7-6w?si=4iiSQyMcrETmpdAe`,
            description: `NBA Jam is an iconic sports game known for its fast-paced, arcade-style basketball
                                    gameplay. Players choose from a roster of real NBA teams and athletes, engaging in
                                    two-on-two matches filled with high-flying dunks, outrageous moves, and over-the-top
                                    commentary. The game stands out for its exaggerated physics and dynamic gameplay,
                                    offering an entertaining and thrilling basketball experience. Featuring both
                                    single-player and multiplayer modes, NBA Jam provides endless fun with its
                                    competitive matches and memorable catchphrases. As a popular title on the Atari
                                    Jaguar, it captures the excitement of basketball with a unique, fun twist.`,
        },
        {
            id: "rayman",
            title: `Rayman`,
            developer: `UBISOFT`,
            releaseDate: `1995-09-01`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/-paF4gxRRNM?si=XVCFjd4wTtCJ6fKw`,
            description: `Rayman is a classic platformer game that introduces players to the charming and
                                    limbless hero, Rayman. The game features beautifully animated 2D graphics and a
                                    whimsical world filled with quirky characters and imaginative landscapes. Players
                                    navigate through diverse levels, overcoming obstacles and enemies while collecting
                                    magical orbs called "Electoons" to progress. Known for its challenging gameplay and
                                    inventive design, Rayman requires players to utilize various abilities like
                                    punching, jumping, and gliding to rescue the Great Protoon and save Rayman's world
                                    from the evil Mr. Dark. As one of the standout titles on the Atari Jaguar, Rayman
                                    captivates players with its engaging story, vibrant visuals, and delightful music.`,
        },
    ];

    return (
        <div id="JAGUAR" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>ATARI JAGUAR</h1>
            <p>
                The Atari Jaguar, released in November 1993, is a home video game console developed by Atari Corporation.
                It
                was marketed as the first 64-bit gaming system, boasting superior graphics and processing power compared
                to
                its competitors at the time. The Jaguar featured a unique multi-chip architecture and a controller with
                a
                keypad, offering a different gaming experience. Despite its technological promise, the console struggled
                with a limited game library, poor third-party support, and a complicated programming environment, which
                ultimately led to its commercial failure and contributed to Atari's exit from the console market.
            </p>
            <div className="row">
                {games.map((game) => (
                    <div key={game.modalId} className="col-6 col-md-4 col-lg-2 mb-4 d-flex align-items-stretch">
                        <div className={`card ${isDarkMode ? 'card-dark-mode' : 'card-light-mode'}`}>
                            <div className="card-body d-flex flex-column">
                                <img src={game.imgSrc} alt={game.imgAlt} className="img-fluid rounded mb-4" />
                                <div className="d-flex justify-content-between mt-auto">
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${isDarkMode ? 'btn-dark-mode' : 'btn-light-mode'} flex-fill me-2`}
                                        data-bs-toggle="modal"
                                        data-bs-target={`#${game.modalId}`}
                                    >
                                        <i className="fa-solid fa-circle-info"></i>
                                        <span className="d-none d-lg-inline">&nbsp;&nbsp;Info</span>
                                    </button>
                                    <Link
                                        to={`/atarijaguar/game/${game.modalId}`}
                                        className={`btn btn-sm ${isDarkMode ? 'btn-dark-mode' : 'btn-light-mode'} flex-fill ms-2`}
                                    >
                                        <i className="fa-solid fa-play"></i>
                                        <span className="d-none d-lg-inline">&nbsp;&nbsp;Play</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="col-6 col-md-4 col-lg-2 mb-4 d-flex align-items-stretch">
                    <div className={`card ${isDarkMode ? 'card-dark-mode' : 'card-light-mode'} card-same-size`}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <span className="text-center"><strong><Link to="/customrom" className={isDarkMode ? 'rom-dark' : 'rom-light'}>+ Import ROM</Link></strong></span>
                        </div>
                    </div>
                </div>
            </div>
            <GamesInformation gameModals={gameModals} activeModalId={activeModalId} />
        </div>
    );
};

export default ATARIJAGUAR;
