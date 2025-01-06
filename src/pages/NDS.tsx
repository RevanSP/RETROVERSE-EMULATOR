
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const NDS: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/nintendo-ds/animalcrossing.jpg", imgAlt: "animalcrossing", modalId: "animalcrossing" },
        { imgSrc: "img/covers/nintendo-ds/ghost.jpg", imgAlt: "ghost", modalId: "ghost" },
        { imgSrc: "img/covers/nintendo-ds/kirby.jpg", imgAlt: "kirby", modalId: "kirby" },
        { imgSrc: "img/covers/nintendo-ds/mariokartds.png", imgAlt: "mariokartds", modalId: "mariokartds" },
        { imgSrc: "img/covers/nintendo-ds/sonicrush.jpg", imgAlt: "sonicrush", modalId: "sonicrush" },
    ];

    const gameModals = [
        {
            id: "animalcrossing",
            title: `Animal Crossing: Wild World`,
            developer: `NINTENDO`,
            releaseDate: `2005-11-21`,
            genre: `Simulation`,
            videoSrc: `https://www.youtube.com/embed/ArcR_dGhn9U?si=PQF5qpEqdPOi9lf2`,
            description: ` Animal Crossing: Wild World is a life simulation game developed by Nintendo for the
                                    Nintendo DS. Set in a charming village inhabited by anthropomorphic animals, players
                                    can explore, interact with villagers, and customize their homes and surroundings.
                                    The game operates in real-time, with events and activities changing according to the
                                    real-world clock and seasons. With its open-ended gameplay, dynamic events, and
                                    engaging social interactions, Animal Crossing: Wild World offers a relaxing and
                                    immersive experience that encourages creativity and community-building.`,
        },
        {
            id: "ghost",
            title: `Ghostbusters: The Video Game`,
            developer: `Red Fly Studio`,
            releaseDate: `2009-06-16`,
            genre: `Adventure`,
            videoSrc: `https://www.youtube.com/embed/Fw-TzKGSj14?si=ot223MEw_Ue8Oe-c`,
            description: `Ghostbusters: The Video Game for the Nintendo DS is an
                                    action-adventure game developed by Red Fly Studio. Based on the popular Ghostbusters
                                    franchise, the game allows players to control the original Ghostbusters team as they
                                    investigate paranormal activities and capture ghosts in New York City. The game
                                    features an original storyline, engaging gameplay mechanics, and iconic characters
                                    and equipment from the Ghostbusters universe. Players use the Nintendo DS's touch
                                    screen to aim and deploy their ghost-catching gear, making it a unique and
                                    interactive experience.`,
        },
        {
            id: "kirby",
            title: `Kirby Canvas Curse`,
            developer: `HAL LABORATORY`,
            releaseDate: `2005-03-28`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/3y1xsSNZo1M?si=hC_rTxZ8gF33NCpi`,
            description: `  Kirby Canvas Curse is a unique platformer developed by HAL Laboratory for the
                                    Nintendo DS. In this game, Kirby finds himself transformed into a ball of yarn and
                                    must navigate through vibrant, hand-drawn worlds to defeat the evil entity
                                    threatening Dream Land. The game makes innovative use of the DS touchscreen,
                                    allowing players to draw paths and control Kirby’s movement by guiding him with
                                    their stylus. Featuring charming graphics, creative level design, and engaging
                                    touch-based mechanics, Kirby Canvas Curse offers a fresh and entertaining twist on
                                    the beloved Kirby series.`,
        },
        {
            id: "mariokartds",
            title: `Mario Kart DS`,
            developer: `NINTENDO`,
            releaseDate: `2005-11-14`,
            genre: `Racing`,
            videoSrc: `https://www.youtube.com/embed/wRqn-YdT39c?si=cv0VyhVsMVf0Ieua`,
            description: `  Mario Kart DS is a highly acclaimed racing game developed by Nintendo for the
                                    Nintendo DS. It introduces players to fast-paced kart racing action with a variety
                                    of characters from the Mario series. The game features both single-player and
                                    multiplayer modes, including online play, which was a first for the series. With a
                                    diverse selection of tracks, creative power-ups, and customizable karts, Mario Kart
                                    DS offers a thrilling racing experience that is enjoyable both solo and with
                                    friends. The game's use of the DS’s dual screens enhances gameplay, providing an
                                    immersive and engaging racing environment.`,
        },
        {
            id: "sonicrush",
            title: `Sonic Rush`,
            developer: `SEGA`,
            releaseDate: `2005-11-15`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/HI0v535mVUI?si=jcnzjNS2o_ch6k5z`,
            description: ` Sonic Rush is a fast-paced platformer developed by SEGA for the Nintendo DS. The
                                    game features Sonic the Hedgehog and his rival, Blaze the Cat, as they race through
                                    vibrant, side-scrolling levels to thwart the plans of the nefarious Dr. Eggman.
                                    Sonic Rush combines classic 2D platforming action with new gameplay mechanics, such
                                    as the use of the DS’s dual screens to create expansive levels. The game is known
                                    for its high-speed gameplay, stylish visuals, and catchy soundtrack, making it a
                                    standout title in the Sonic series.`,
        },
    ];

    return (
        <div id="NDS" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>NINTENDO DS</h1>
            <p>
                The Nintendo DS (NDS) is a handheld game console developed by Nintendo. Released in 2004, it features
                dual
                screens, one of which is a touchscreen, and includes built-in wireless connectivity. The DS supports a
                wide
                variety of games and emphasizes innovative gameplay experiences.
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
                                        to={`/nds/game/${game.modalId}`}
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

export default NDS;
