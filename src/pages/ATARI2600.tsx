/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const ATARI2600: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/atari-2600/DigDug.jpg", imgAlt: "digdug", modalId: "digdug" },
        { imgSrc: "img/covers/atari-2600/E.T.png", imgAlt: "E.T", modalId: "et" },
        { imgSrc: "img/covers/atari-2600/fatalrun.jpg", imgAlt: "fatalrun", modalId: "fatalrun" },
        { imgSrc: "img/covers/atari-2600/gravitar.jpg", imgAlt: "gravitar", modalId: "gravitar" },
        { imgSrc: "img/covers/atari-2600/Phoenix.jpg", imgAlt: "phoenix", modalId: "phoenix" },
    ];

    const gameModals = [
        {
            id: "digdug",
            title: `Dig Dug`,
            developer: `NAMCO`,
            releaseDate: `1983-06-30`,
            genre: `Action`,
            description: `In this game, players control the character Dig Dug,
                                    who must eliminate underground-dwelling monsters by inflating them with an air pump
                                    until they burst or by dropping rocks on them. The gameplay involves digging through
                                    the earth to create tunnels while avoiding or combating two types of enemies:
                                    Pookas, red, round creatures with goggles, and Fygars, green, fire-breathing
                                    dragons. Each level is completed when all enemies are eliminated, with the game
                                    progressively becoming more challenging as enemies become faster and more numerous.
                                    Despite the simplified graphics and sound compared to the original arcade version,
                                    the Atari 2600 adaptation retains the core gameplay mechanics and charm that made
                                    Dig Dug a beloved title. This game remains a significant part of video game history,
                                    offering players a nostalgic experience of strategic and engaging arcade action.`,
            videoSrc: `https://www.youtube.com/embed/2pQ4ybxhAII?si=tYl3O_OdXKd_pldy`,
        },
        {
            id: "et",
            title: "E.T. the Extra-Terrestrial",
            developer: "Atari",
            releaseDate: "1982-12-01",
            genre: "Adventure",
            videoSrc: "https://www.youtube.com/embed/QmrQkQsM9FU?si=1-M2D2_K9qPY1p_s",
            description: `Released on 1982-12-01, E.T. the Extra-Terrestrial is
                                    a game developed and published by Atari, Inc. Players control E.T., an alien
                                    stranded on Earth, and must guide him to collect pieces of an interplanetary phone
                                    to call his spaceship to return home. The game involves exploring various
                                    environments, avoiding government agents and scientists, and solving puzzles to
                                    gather the necessary components. Despite its ambitious concept, the game faced
                                    criticism for its confusing gameplay and was one of the major factors contributing
                                    to the video game industry crash of 1983. Nonetheless, it remains a notable part of
                                    video game history, representing both the potential and pitfalls of early game
                                    development.`,
        },
        {
            id: "fatalrun",
            title: "Fatal Run",
            developer: "Atari",
            releaseDate: "1990-04-01",
            genre: "Action",
            description: `Released on 1990-04-01, Fatal Run is a racing and
                                    action game developed and published by Atari Corporation. Set in a post-apocalyptic
                                    world, players must drive through various hazardous environments to deliver a
                                    life-saving vaccine to survivors. The game involves both racing and combat elements,
                                    requiring players to navigate through dangerous roads while fending off enemy
                                    vehicles. Fatal Run is notable for its ambitious attempt to combine different
                                    gameplay genres and is remembered as one of the last games released for the Atari
                                    2600.`,
            videoSrc: "https://www.youtube.com/embed/-HthiZCDmvY?si=hXoPTiuQeo_xY3YB",
        },
        {
            id: "gravitar",
            title: "Gravitar",
            developer: "Atari",
            releaseDate: "1983-01-01",
            genre: "Action",
            description: `Released on 1983-01-01, Gravitar is an action and
                                    space shooter game developed and published by Atari, Inc. In Gravitar, players
                                    control a spaceship navigating through various gravity-affected environments,
                                    including different planets and space stations. The goal is to complete missions by
                                    destroying enemy bases and avoiding obstacles while managing the ship's fuel and
                                    navigating complex gravitational fields. The game is known for its challenging
                                    gameplay and innovative use of gravity mechanics, making it a unique entry in the
                                    Atari 2600 library.`,
            videoSrc: "https://www.youtube.com/embed/e-zvuMYLB40?si=7fQPk5T-yFrt5vYm",
        },
        {
            id: "phoenix",
            title: "Phoenix",
            developer: "Atari",
            releaseDate: "1982-12-01",
            genre: "Shooter",
            description: `Released on 1982-12-01, Phoenix is a space shooter
                                    game developed and published by Atari, Inc. In Phoenix, players control a spaceship
                                    tasked with defending Earth from waves of alien bird-like enemies. The game features
                                    multiple levels, each with increasingly difficult enemies and patterns. Players must
                                    shoot down the approaching aliens while avoiding their attacks and rescuing captured
                                    allies. Phoenix is known for its engaging gameplay and was well-received for its
                                    impressive graphics and challenging levels, making it a standout title for the Atari
                                    2600.`,
            videoSrc: "https://www.youtube.com/embed/C0F1XOat0iE?si=ot8M8eh-BUcNrxgz",
        },
    ];

    return (
        <div id="2600" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>ATARI 2600</h1>
            <p>
                The Atari 2600, originally known as the Atari VCS (Video Computer System) before 1982, is a home video
                game console developed and released by Atari, Inc. in September 1977. It is one of the first consoles to use
                microprocessor-based hardware and ROM cartridges for storing game code, which allowed users to play a
                variety of games on a single console by swapping out cartridges. The Atari 2600 became a major success
                and is credited with popularizing the use of plug-in cartridges, which led to the video game industry's
                first major boom in the late 1970s and early 1980s.
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
                                        to={`/atari2600/game/${game.modalId}`}
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

export default ATARI2600;
