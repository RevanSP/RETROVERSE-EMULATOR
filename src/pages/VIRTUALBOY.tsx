
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const VIRTUALBOY: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/virtual-boy/jack.jpg", imgAlt: "jack", modalId: "jack" },
        { imgSrc: "img/covers/virtual-boy/mario-clash-virtual-boy-front-cover.jpg", imgAlt: "marioclash", modalId: "marioclash" },
        { imgSrc: "img/covers/virtual-boy/nesters-funky-bowling-virtual-boy-front-cover.png", imgAlt: "nestersfunkybowling", modalId: "nestersfunkybowling" },
        { imgSrc: "img/covers/virtual-boy/Redalarm.png", imgAlt: "redalarm", modalId: "redalarm" },
        { imgSrc: "img/covers/virtual-boy/teleroboxer.jpg", imgAlt: "teleroboxer", modalId: "teleroboxer" },
    ];

    const gameModals = [
        {
            id: "jack",
            title: `Jack Bros`,
            developer: `ATLUS`,
            releaseDate: `1995-10-01`,
            genre: `Action`,
            videoSrc: `https://www.youtube.com/embed/D2WvLRmG3MU?si=bnx_xcO3hjTEBcZP`,
            description: `  Jack Bros is an action game developed and published by Atlus for the Virtual Boy. It
                                    is notable for being the first game in the Megami Tensei series to be released
                                    outside of Japan. The game features three characters, Jack Frost, Jack Lantern, and
                                    Jack Skelton, who must navigate through various stages to return to their world
                                    before time runs out. The gameplay involves solving puzzles, avoiding traps, and
                                    defeating enemies in a top-down perspective. Despite the Virtual Boy's commercial
                                    failure, Jack Bros has gained a cult following for its engaging gameplay and unique
                                    place in the Megami Tensei franchise.`,
        },
        {
            id: "marioclash",
            title: `Mario Clash`,
            developer: `NINTENDO`,
            releaseDate: `1995-10-01`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/Blm5F27PQRk?si=HoWhFp3MHvBpCYkF`,
            description: ` Mario Clash is a platformer game developed and published by Nintendo for the Virtual
                                    Boy. The game features Mario navigating through various stages, attempting to defeat
                                    enemies by throwing shells at them. The levels are designed in a 3D perspective,
                                    allowing Mario to move between the foreground and background layers. Despite the
                                    Virtual Boy's lackluster reception, Mario Clash is remembered for its unique
                                    gameplay mechanics and its attempt to bring a new dimension to the classic Mario
                                    formula.`,
        },
        {
            id: "nestersfunkybowling",
            title: `Nester's Funky Bowling`,
            developer: `NINTENDO`,
            releaseDate: `1996-02-26`,
            genre: `Sports`,
            videoSrc: `https://www.youtube.com/embed/rysqkMs7_r0?si=JyGRdVQKLjLPtKP5`,
            description: ` Nester's Funky Bowling is a sports game developed and published by Nintendo for the
                                    Virtual Boy. It features Nester, a character from the Nintendo Power magazine
                                    comics, as he competes in various bowling challenges. The game offers a variety of
                                    lanes and scoring opportunities, utilizing the Virtual Boy's 3D capabilities to
                                    provide a unique bowling experience. Players must master their timing and precision
                                    to achieve high scores and strike out the competition.`,
        },
        {
            id: "redalarm",
            title: `Red Alarm`,
            developer: `T&E SOFT`,
            releaseDate: `1995-07-21`,
            genre: `Shooter`,
            videoSrc: `https://www.youtube.com/embed/SO8jCls8F24?si=IWCYcf8i4brSNu4o`,
            description: `  Red Alarm is a 3D shooter game developed by T&E Soft for the Virtual Boy. Set in a
                                    futuristic world, players pilot a spacecraft through various environments, battling
                                    enemies and navigating obstacles. The game makes use of the Virtual Boy's 3D
                                    capabilities to create a sense of depth and immersion, providing a unique visual
                                    experience. Players must use their skills to defeat waves of enemies and progress
                                    through increasingly challenging levels.`,
        },
        {
            id: "teleroboxer",
            title: `Telero Boxer`,
            developer: `KONAMI`,
            releaseDate: `1995-03-31`,
            genre: `Fighting`,
            videoSrc: `https://www.youtube.com/embed/2aF_qinD3UA?si=fi2VJuPkjCflcdb1`,
            description: `  Telero Boxer is a fighting game developed by Konami for the Virtual Boy. It features
                                    a unique first-person perspective where players fight against various opponents
                                    using motion controls to simulate punching and dodging. The game is known for its
                                    use of the Virtual Boy's 3D capabilities, creating a dynamic and immersive boxing
                                    experience. Players can choose different fighters and compete in a series of matches
                                    to become the champion.`,
        },
    ];

    return (
        <div id="VBOY" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>VIRTUAL BOY</h1>
            <p>
                The Virtual Boy, released by Nintendo in 1995, was a pioneering attempt at creating a 3D gaming
                experience
                with stereoscopic visuals. It was designed to be a portable console with a unique display that used
                parallax
                scrolling to simulate depth. The system featured a distinctive red monochrome display and required
                players
                to use a stand to view the games through eye pieces. Despite its innovative concept, the Virtual Boy
                faced
                criticism for its limited color palette, discomfort during use, and a lack of compelling games, leading
                to
                its discontinuation after only a short time on the market.
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
                                        to={`/virtualboy/game/${game.modalId}`}
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

export default VIRTUALBOY;
