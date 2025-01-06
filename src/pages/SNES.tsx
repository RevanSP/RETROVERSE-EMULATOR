
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const SNES: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/snes/donkey-kong-country-snes-front-cover.jpg", imgAlt: "donkeykongcountry", modalId: "donkeykongcountry" },
        { imgSrc: "img/covers/snes/street-fighter-ii-turbo-snes-front-cover.jpg", imgAlt: "streetfighter2turbo", modalId: "streetfighter2turbo" },
        { imgSrc: "img/covers/snes/super-mario-kart-snes-front-cover.jpg", imgAlt: "supermariokart", modalId: "supermariokart" },
        { imgSrc: "img/covers/snes/super-mario-world-snes-front-cover.jpg", imgAlt: "supermarioworld", modalId: "supermarioworld" },
        { imgSrc: "img/covers/snes/super-mario-world-2-yoshis-island-snes-front-cover.jpg", imgAlt: "supermarioworld2yoshiisland", modalId: "supermarioworld2yoshiisland" },
    ];

    const gameModals = [
        {
            id: "donkeykongcountry",
            title: `Donkey Kong Country`,
            developer: `RARE`,
            releaseDate: `1994-11-21`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/_Eug8PRZWlc?si=1dbhi766qx4Tybrg`,
            description: `   Donkey Kong Country is a platform game developed by Rare and published by Nintendo
                                    for the Super Nintendo Entertainment System (SNES). Players control Donkey Kong and
                                    his sidekick, Diddy Kong, as they traverse various levels to recover their stolen
                                    banana hoard from the villainous King K. Rool. The game is renowned for its
                                    groundbreaking graphics, engaging gameplay, and memorable soundtrack, making it a
                                    classic title in the platforming genre.`,
        },
        {
            id: "streetfighter2turbo",
            title: `Street Fighter 2 Turbo`,
            developer: `CAPCOM`,
            releaseDate: `1993-07-11`,
            genre: `Fighting`,
            videoSrc: `https://www.youtube.com/embed/oNvaXjmn6J8?si=7ik_SVEVdDjJLya1`,
            description: `  Street Fighter 2 Turbo is a fighting game developed and published by Capcom for the
                                    Super Nintendo Entertainment System (SNES). This version of the game introduces
                                    faster gameplay and new moves for each character, enhancing the original Street
                                    Fighter 2 experience. Players can choose from a roster of iconic characters and
                                    engage in intense one-on-one battles, aiming to defeat opponents and become the
                                    ultimate street fighter. The game's refined mechanics and competitive depth have
                                    cemented its status as a classic in the fighting game genre.`,
        },
        {
            id: "supermariokart",
            title: `Super Mario Kart`,
            developer: `NINTENDO`,
            releaseDate: `1992-08-27`,
            genre: `Racing`,
            videoSrc: `https://www.youtube.com/embed/6KzhEGPUNIk?si=wodkFWb_83U6oyaI`,
            description: ` Super Mario Kart is a kart racing game developed and published by Nintendo for the
                                    Super Nintendo Entertainment System (SNES). This pioneering title introduced the
                                    world to the now-iconic Mario Kart series, featuring characters from the Mario
                                    franchise racing against each other on creatively designed tracks. Players can
                                    collect power-ups to hinder opponents or boost their own performance. With its
                                    split-screen multiplayer mode and innovative gameplay, Super Mario Kart quickly
                                    became a beloved classic and set the standard for the kart racing genre.`,
        },
        {
            id: "supermarioworld",
            title: `Super Mario World`,
            developer: `NINTENDO`,
            releaseDate: `1990-11-21`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/Vxg5eOPmzHI?si=PDiaaKOQF0vMHFJ3`,
            description: `  Super Mario World is a platform game developed and published by Nintendo for the
                                    Super Nintendo Entertainment System (SNES). The game follows Mario and Luigi as they
                                    travel through Dinosaur Land to rescue Princess Toadstool and defeat the evil
                                    Bowser. Introduced in this game is Yoshi, Mario's dinosaur companion, who can eat
                                    enemies and gain special abilities. The game features vibrant graphics, a catchy
                                    soundtrack, and intricate level design, making it one of the most beloved titles in
                                    the Mario series and a classic of the 16-bit era.`,
        },
        {
            id: "supermarioworld2yoshiisland",
            title: `Super Mario World 2: Yoshi's Island`,
            developer: `NINTENDO`,
            releaseDate: `1995-08-05`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/U8btNneN8ew?si=5Wkaxh8SbVBR4Nuh`,
            description: ` Super Mario World 2: Yoshi's Island is a platform game developed and published by
                                    Nintendo for the Super Nintendo Entertainment System (SNES). The game is a prequel
                                    to the original Super Mario World, focusing on Yoshi and Baby Mario as they embark
                                    on an adventure to rescue Baby Luigi from the evil Magikoopa Kamek. The game
                                    features a unique hand-drawn art style, innovative gameplay mechanics involving
                                    Yoshi's egg-throwing abilities, and creative level design. Yoshi's Island is
                                    celebrated for its charm, creativity, and enduring appeal as one of the standout
                                    titles on the SNES.`,
        },
    ];

    return (
        <div id="SNES" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1 className="d-block d-md-none">SNES</h1>
            <h1 className="d-none d-md-block">SUPER NINTENDO ENTERTAINMENT SYSTEM</h1>
            <p>
                The Super Nintendo Entertainment System (SNES) is a 16-bit home video game console developed by
                Nintendo. It
                was released in the early 1990s and became one of the most popular gaming consoles of its time, known
                for
                its iconic games and advanced graphics capabilities.</p>
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
                                        to={`/snes/game/${game.modalId}`}
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

export default SNES;
