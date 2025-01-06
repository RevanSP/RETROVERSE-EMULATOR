
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}
const ATARI7800: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/atari-7800/asteroids-atari-7800-cover-340x483.jpg", imgAlt: "asteroids", modalId: "asteroids" },
        { imgSrc: "img/covers/atari-7800/ms-pac-man-atari-7800-cover-340x483.jpg", imgAlt: "mspacman", modalId: "mspacman" },
        { imgSrc: "img/covers/atari-7800/pole-position-2-atari-7800-cover-340x483.jpg", imgAlt: "poleposition2", modalId: "poleposition2" },
        { imgSrc: "img/covers/atari-7800/summer-games-atari-7800-cover-340x483.jpg", imgAlt: "summergames", modalId: "summergames" },
        { imgSrc: "img/covers/atari-7800/winter-games-atari-7800-cover-340x483.jpg", imgAlt: "wintergames", modalId: "wintergames" },
    ];

    const gameModals = [
        {
            id: "asteroids",
            title: `Asteroids`,
            developer: `Atari`,
            releaseDate: `1987-01-01`,
            genre: `Shooter`,
            videoSrc: `https://www.youtube.com/embed/oub8iDbawZg?si=Wt5LU-6ooJO-xnrN`,
            description: `Asteroids is a classic arcade game where players
                                    control a spaceship navigating through an asteroid field. The objective is to shoot
                                    and destroy asteroids and enemy saucers while avoiding collisions. The game features
                                    vector graphics and was originally released by Atari Games. It was ported to the
                                    Atari 7800, bringing the classic gameplay to home consoles with updated graphics and
                                    controls.`,
        },
        {
            id: "mspacman",
            title: `Ms. Pacman`,
            developer: `Namco`,
            releaseDate: `1987-01-01`,
            genre: `Maze`,
            videoSrc: `https://www.youtube.com/embed/LXhDLfNkY7Q?si=KQ0TAT9zTI_bbQqg`,
            description: `Ms. Pac-Man is a classic arcade game and a sequel to
                                    the original Pac-Man. In this game, players guide Ms. Pac-Man through a maze, eating
                                    pellets and avoiding ghosts. The game introduces new maze designs and features that
                                    differentiate it from the original. Released for the Atari 7800, it retains the
                                    engaging gameplay of the arcade version while adapting it for home consoles.`,
        },
        {
            id: "poleposition2",
            title: `Pole Position 2`,
            developer: `Namco`,
            releaseDate: `1987-01-01`,
            genre: `Racing`,
            videoSrc: `https://www.youtube.com/embed/GQCKCdLlbhQ?si=IXo9oK0koQ17xwiy`,
            description: `Pole Position II is a racing game and a sequel to the
                                    original Pole Position. In this game, players compete in a Formula 1-style race,
                                    navigating a series of tracks and avoiding obstacles. The game features improved
                                    graphics and gameplay over its predecessor, with more tracks and better controls. It
                                    was released for the Atari 7800, bringing the arcade racing experience to home
                                    consoles with an enhanced racing simulation.`,
        },
        {
            id: "summergames",
            title: `Summer Games`,
            developer: `Epyx`,
            releaseDate: `1987-01-01`,
            genre: `Sports`,
            videoSrc: `https://www.youtube.com/embed/FeQetPLUN40?si=_upxEn3znJfDx77g`,
            description: `Summer Games is a sports video game that simulates
                                    various Olympic-style events. Players can compete in multiple athletic disciplines,
                                    including track and field, swimming, and gymnastics. The game features a range of
                                    events and challenges that test players' reflexes and timing. Released for the Atari
                                    7800, it brings the competitive spirit of the Summer Olympics to home consoles with
                                    engaging gameplay and simple controls.`,
        },
        {
            id: "wintergames",
            title: `Winter Games`,
            developer: `Epyx`,
            releaseDate: `1987-01-01`,
            genre: `Sports`,
            videoSrc: `https://www.youtube.com/embed/IEEMhMezaxQ?si=q2ViyKwY0kJuxDGN`,
            description: `Winter Games is a sports video game that simulates
                                    various winter Olympic events. Players can compete in disciplines such as skiing,
                                    bobsledding, and figure skating. The game offers a range of winter sports challenges
                                    that test players' skill and timing. Released for the Atari 7800, it brings the
                                    excitement of winter sports to home consoles with engaging gameplay and competitive
                                    events.`,
        },
    ];

    return (
        <div id="7800" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>ATARI 7800</h1>
            <p>
                The Atari 7800 is a home video game console that was released by Atari Corporation in 1986. It was
                designed
                to be backward compatible with the Atari 2600, allowing it to play a wide range of classic games. The
                7800
                offered improved graphics and sound capabilities compared to its predecessor, and it featured a
                selection of
                arcade-quality games. Despite its potential, the Atari 7800 faced stiff competition from other consoles
                like
                the Nintendo Entertainment System and Sega Master System, which ultimately limited its success in the
                market.
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
                                        to={`/atari7800/game/${game.modalId}`}
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

export default ATARI7800;
