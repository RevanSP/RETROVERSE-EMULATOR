/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const ATARI5200: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/atari-5200/choplifter-atari-5200-front-cover.jpg", imgAlt: "choplifter", modalId: "choplifter" },
        { imgSrc: "img/covers/atari-5200/joust-atari-5200-front-cover.jpg", imgAlt: "joust", modalId: "joust" },
        { imgSrc: "img/covers/atari-5200/missilecommand.jpg", imgAlt: "missilecommand", modalId: "missilecommand" },
        { imgSrc: "img/covers/atari-5200/moonpatrol.jpg", imgAlt: "moonpatrol", modalId: "moonpatrol" },
        { imgSrc: "img/covers/atari-5200/realsports-tennis-atari-5200-front-cover.jpg", imgAlt: "realsportstennis", modalId: "realsportstennis" },
    ];

    const gameModals = [
        {
            id: "choplifter",
            title: "Choplifter",
            developer: "PARKER BROTHERS",
            releaseDate: "1984-11-01",
            genre: "Action",
            description: `Released on 1984-11-01, Choplifter is an action and
                                    rescue game developed by Parker Brothers for the Atari 5200. In this game, players
                                    pilot a helicopter tasked with rescuing hostages from enemy-held areas. The gameplay
                                    involves flying through hostile territory, avoiding or neutralizing enemy forces,
                                    and successfully picking up and transporting hostages to safety. The game is known
                                    for its engaging rescue missions and challenging gameplay, which requires strategic
                                    navigation and precise timing. Choplifter was well-received for its innovative
                                    concept and was a notable addition to the Atari 5200 library.`,
            videoSrc: "https://www.youtube.com/embed/g6OlmutUmxI?si=MctNb_XImaJNg5Yn",
        },
        {
            id: "joust",
            title: "Joust",
            developer: "Atari",
            releaseDate: "1983-12-12",
            genre: "Adventure",
            videoSrc: "https://www.youtube.com/embed/06VotTif2iE?si=d20alar3yl8ruv0Z",
            description: `Joust is an action game where players control a knight riding a flying ostrich. The
                                    goal is to defeat waves of enemy knights riding buzzards by colliding with them at a
                                    higher position, causing them to drop an egg that can be collected for points. The
                                    game was notable for its cooperative two-player mode, where players could either
                                    work together to defeat enemies or compete against each other. Its unique gameplay
                                    and distinctive visuals made it a classic title in the arcade era, later adapted for
                                    the Atari 5200.`,
        },
        {
            id: "missilecommand",
            title: "Missile Command",
            developer: "ATARI",
            releaseDate: "1981-11-01",
            genre: "Arcade",
            description: `         Missile Command is an arcade game where players take on the role of a commander
                                    tasked with defending six cities from incoming waves of ballistic missiles. Players
                                    control a crosshair to launch counter-missiles and intercept the enemy attacks
                                    before they reach the ground. The game is notable for its fast-paced, strategic
                                    gameplay and increasing difficulty, requiring quick reflexes and careful planning to
                                    protect the cities. Missile Command was a significant hit in the early 1980s and
                                    remains a classic example of the arcade genre.`,
            videoSrc: "https://www.youtube.com/embed/tF6inS6Lqtk?si=ClC0CP2frvSxose9",
        },
        {
            id: "moonpatrol",
            title: "Moon Patrol",
            developer: "IREM",
            releaseDate: "1982-09-01",
            genre: "Side-Scrolling Shooter",
            description: ` Moon Patrol is a side-scrolling shooter game where players control a moon buggy
                                    navigating the lunar surface. The game involves dodging and jumping over obstacles
                                    such as craters and mines, while also shooting enemies including UFOs and tanks.
                                    Moon Patrol is known for its innovative parallax scrolling background, which gave a
                                    sense of depth and movement. The game's combination of shooting, jumping, and timing
                                    challenges made it a popular and enduring title in the arcade and home console
                                    markets.`,
            videoSrc: "https://www.youtube.com/embed/5z7AipCSZQI?si=t-Jn6nzekrq5tGSj",
        },
        {
            id: "realsportstennis",
            title: "Real Sports Tennis",
            developer: "ATARI",
            releaseDate: "1983-11-01",
            genre: "Sports",
            description: ` RealSports Tennis is a sports simulation game where players can experience the
                                    thrill of tennis matches on their Atari 5200 console. The game offers both singles
                                    and doubles play modes, allowing for various match configurations. With intuitive
                                    controls and realistic gameplay mechanics, RealSports Tennis aims to capture the
                                    essence of tennis, providing an engaging and challenging experience for sports
                                    enthusiasts. Players can enjoy rallying, serving, and volleying, all presented with
                                    the graphics and sound capabilities of the Atari 5200.`,
            videoSrc: "https://www.youtube.com/embed/xZyQxzZK0NE?si=iu6t3sqXRsYy1yQF",
        },
    ];

    return (
        <div id="5200" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>ATARI 5200</h1>
            <p>
                The Atari 5200, released in November 1982, is a home video game console developed by Atari, Inc. It was designed as the successor to the popular Atari 2600 and aimed to compete with other second-generation consoles like the Intellivision and ColecoVision. The Atari 5200 featured improved graphics and sound capabilities compared to its predecessor, along with a unique analog joystick controller. Despite its technical advancements, the console faced challenges due to its incompatibility with Atari 2600 cartridges and competition from other gaming systems, which limited its commercial success.
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
                                        to={`/atari5200/game/${game.modalId}`}
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

export default ATARI5200;
