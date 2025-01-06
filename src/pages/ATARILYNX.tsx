
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const ATARILYNX: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/atari-lynx/batman-returns-atari-lynx-cover-340x483.jpg", imgAlt: "batmanreturns", modalId: "batmanreturns" },
        { imgSrc: "img/covers/atari-lynx/hard-drivin-atari-lynx-cover-340x483.jpg", imgAlt: "harddrivin", modalId: "harddrivin" },
        { imgSrc: "img/covers/atari-lynx/ninja-gaiden-atari-lynx-cover-340x483.jpg", imgAlt: "ninjagaiden", modalId: "ninjagaiden" },
        { imgSrc: "img/covers/atari-lynx/pac-land-atari-lynx-cover-340x483.jpg", imgAlt: "pacland", modalId: "pacland" },
        { imgSrc: "img/covers/atari-lynx/roadblasters-atari-lynx-cover-340x483.jpg", imgAlt: "roadblasters", modalId: "roadblasters" },
    ];

    const gameModals = [
        {
            id: "batmanreturns",
            title: `Batman Returns`,
            developer: `Konami`,
            releaseDate: `1990-01-01`,
            genre: `Action`,
            videoSrc: `https://www.youtube.com/embed/sYVZjAImCEs?si=AMzHDGQsTOdqfVso`,
            description: `Batman Returns is an action game developed by Konami
                                    for the Atari Lynx. Based on the 1992 film of the same name, the game features
                                    side-scrolling action where players take on the role of Batman to fight against
                                    various enemies and villains from the movie. With challenging levels and engaging
                                    gameplay, players can use Batman's gadgets and combat skills to restore order in
                                    Gotham City.`,
        },
        {
            id: "harddrivin",
            title: `Hard Drivin`,
            developer: `Atari`,
            releaseDate: `1991-01-01`,
            genre: `Racing`,
            videoSrc: `https://www.youtube.com/embed/iJL8iA0OrQA?si=eNZWbFJVekoI6V5U`,
            description: `Hard Drivin' is a racing game developed by Atari Games
                                    for the Atari Lynx. It is known for its 3D graphics and realistic driving
                                    simulation. Players can choose from various cars and race through challenging tracks
                                    featuring obstacles, ramps, and sharp turns. The game offers both time trial and
                                    head-to-head racing modes, providing an immersive driving experience with a focus on
                                    precision and skill.`,
        },
        {
            id: "ninjagaiden",
            title: `Ninja Gaiden`,
            developer: `Natsume`,
            releaseDate: `1991-01-01`,
            genre: `Action`,
            videoSrc: `https://www.youtube.com/embed/YWpzlBIm-qQ?si=n9AULKhwur4iLE6h`,
            description: `Ninja Gaiden is an action game developed by Natsume for
                                    the Atari Lynx. This game is a port of the popular arcade and console titles,
                                    featuring fast-paced side-scrolling action and intense combat. Players control a
                                    skilled ninja as they battle through various stages filled with enemies and
                                    obstacles. With challenging levels, smooth animation, and engaging gameplay, Ninja
                                    Gaiden offers a thrilling experience for fans of the genre.`,
        },
        {
            id: "pacland",
            title: `Pac-Land`,
            developer: `Namco`,
            releaseDate: `1991-01-01`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/rj5OsXqmgRQ?si=NscfamXgl2jxDXm4`,
            description: `Pac-Land is a platformer game developed by Namco for
                                    the Atari Lynx. In this game, players control Pac-Man as he embarks on a journey
                                    through various colorful levels to rescue his friends and navigate through
                                    obstacles. Unlike traditional Pac-Man games, Pac-Land features side-scrolling
                                    gameplay with a focus on jumping and dodging enemies. The game includes vibrant
                                    graphics, catchy music, and a unique twist on the classic Pac-Man formula, offering
                                    a fun and engaging experience for fans of platformers.`,
        },
        {
            id: "roadblasters",
            title: `Road Blasters`,
            developer: `Atari`,
            releaseDate: `1991-01-01`,
            genre: `Racing`,
            videoSrc: `https://www.youtube.com/embed/6LUiYcovsi4?si=RX4_FqivM1BygFqn`,
            description: `Road Blasters is a racing and shoot 'em up game
                                    developed by Atari Games for the Atari Lynx. The game combines high-speed vehicular
                                    combat with racing elements. Players control a heavily armed car that must navigate
                                    through a series of challenging tracks while fending off enemy vehicles and avoiding
                                    obstacles. The game features a variety of power-ups and weapons, providing an
                                    adrenaline-pumping experience with fast-paced action and intense combat.`,
        },
    ];

    return (
        <div id="LYNX" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>ATARI LYNX</h1>
            <p>
                The Atari Lynx is a handheld game console released by Atari Corporation in 1989. It was notable for being
                the
                first handheld gaming device with a color LCD screen, offering a vibrant and engaging gaming experience.
                The
                Lynx featured advanced hardware capabilities for its time, including a backlit display, support for up
                to 16
                players via ComLynx cable, and the ability to display impressive graphics. Despite its innovative design
                and
                powerful features, the Atari Lynx struggled to gain significant market share due to competition from
                Nintendo's Game Boy and other factors such as limited third-party support and a higher price point.
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
                                        to={`/atarilynx/game/${game.modalId}`}
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

export default ATARILYNX;
