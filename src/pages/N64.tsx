
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const N64: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/nintendo-64/MarioKart.jpg", imgAlt: "mariokart", modalId: "mariokart" },
        { imgSrc: "img/covers/nintendo-64/PokemonStadium.jpg", imgAlt: "pokemonstadium", modalId: "pokemonstadium" },
        { imgSrc: "img/covers/nintendo-64/SuperMario64.jpg", imgAlt: "supermario64", modalId: "supermario64" },
        { imgSrc: "img/covers/nintendo-64/SuperSmashBros.jpg", imgAlt: "supersmashbros", modalId: "supersmashbros" },
        { imgSrc: "img/covers/nintendo-64/ZeldaOcarinaOfTime.jpg", imgAlt: "zeldaocarinaoftime", modalId: "zeldaocarinaoftime" },
    ];

    const gameModals = [
        {
            id: "mariokart",
            title: `Mario Kart 64`,
            developer: `NINTENDO`,
            releaseDate: `1997-02-10`,
            genre: `Racing`,
            videoSrc: `https://www.youtube.com/embed/w8K-heSWX8s?si=TILXg86n-AycDYB5`,
            description: `Join the wacky race with Mario and the rest of the
                                    gang! Throw banana peels, turtle shells, and bombs to your enemies in this
                                    competitive racing game – Mario Kart 64! Select your favorite character from various
                                    different characters in the Mario universe and have some fun!
                                    Mario Kart 64 is a go-kart racing game released for the Nintendo 64 gaming console
                                    system back in 1996. Mario Kart 64 is the second game in the series and the first
                                    game to feature a full 3D gameplay. The game has an assortment of powerups and
                                    characters with a cool Mario vibe. Each character has their own unique traits and
                                    set of attributes that will affect the gameplay. Race through different tracks and
                                    avoid the natural hazards and try to cross the finish line first!`,
        },
        {
            id: "pokemonstadium",
            title: `Pokemon Stadium`,
            developer: `NINTENDO`,
            releaseDate: `2000-04-30`,
            genre: `Action`,
            videoSrc: `https://www.youtube.com/embed/fkcCsUAMs28?si=d47sLihRiFIx3v-E`,
            description: `Choose your Pokemon and match up against your enemy’s
                                    in a cool battle of wits, strategy, and firepower. Choose your own Kanto bred
                                    Pokemon and participate in a grand arena battle in this awesome retro N64 game –
                                    Pokemon Stadium!
                                    Pokemon Stadium (in Japan “Pokemon Stadium 2”) is a cool strategy video game
                                    released back in 1999 for the Nintendo 64 gaming system that features a unique
                                    gameplay that departs from the traditional Pokemon role-playing games. The game was
                                    the first of the series to be released outside Japan, but not the first to be made.
                                    Gameplay emphasizes on Pokemon battles and features 3D turn-based battling system
                                    using the original Generation one Pokemon. By itself, the game has pretty low
                                    content, but the game is meant to be combined with the original Game Boy cartridges
                                    that enhance and extend the gameplay.`,
        },
        {
            id: "supermario64",
            title: `Super Mario 64`,
            developer: `NINTENDO`,
            releaseDate: `1996-09-26`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/vT3AaQ77ges?si=jjrYcHjh3nadQu92`,
            description: `Take the role of the heroic plumber Mario and beat the
                                    terrible Bowser! Collect various power-ups that will help you along the way in Super
                                    Mario 64! Rescue Princess Peach and use your special caps to fly, turn into a strong
                                    metal, or become invisible!
                                    Super Mario 64 is a very popular platformer video game that was released back in
                                    1996 for the Nintendo 64 System. The game set the bar for 3D platforming design high
                                    and became a standard for many games that followed it. The game was noted as the
                                    first 3D Mario game and features a total of 120 levels and many mini-tasks like
                                    catching rabbits! Will you be able to collect all 120 power stars and rescue
                                    Princess Peach from the menacing Bowser? Good luck!`,
        },
        {
            id: "supersmashbros",
            title: `Super Smash Bros.`,
            developer: `NINTENDO`,
            releaseDate: `1999-04-26`,
            genre: `Action`,
            videoSrc: `https://www.youtube.com/embed/H5eDiEjaq8M?si=wTNs2F-2p7g2CO87`,
            description: `Play as your favorite character and beat up all the
                                    others in this fun fighting game mashup! Duke it out against the other Nintendo
                                    characters in Super Smash Bros. See how it all began and start smashing those
                                    buttons! Have fun!
                                    Super Smash Bros. is a very popular fighting video game that spawned many sequels.
                                    Released back in 1999 for the Nintendo 64 (N64) gaming consoles, the game puts a
                                    huge variety of Nintendo characters into a mash-up fighting arena and pits them
                                    against each other. The game features up to 12 characters and four characters can
                                    fight each other at the same time. Although the graphics are outdated as compared to
                                    the more modern versions, this game is the game that started it all.`,
        },
        {
            id: "zeldaocarinaoftime",
            title: `The Legend Of Zelda Ocarina Of Time`,
            developer: `NINTENDO`,
            releaseDate: `1998-11-23`,
            genre: `Action`,
            videoSrc: `https://www.youtube.com/embed/EfUoDfnH9ew?si=ODnZvMFzx8Q7TQbv`,
            description: `Play one of the greatest Zelda games in history!
                                    Venture into the world as a young Kokiri boy named Link and defeat the evil Gohma in
                                    The Legend of Zelda: Ocarina of Time!
                                    The Legend of Zelda: Ocarina of Time is an action-adventure video game released back
                                    in 1998 for the Nintendo 64 (N64) gaming system. In this game, you must guide Link
                                    through his quest as he awakens the sages to defeat the evil Ganondorf and save the
                                    land! Go on a long and dangerous quest to obtain the three Spiritual Stones so you
                                    can enter the Sacred Realm. Locate and claim the Triforce for yourself before the
                                    evil Ganondorf gets his dirty hands on it. Explore the world of Hyrule in full 3D in
                                    one of the greatest Zelda games and the all-time fan favorite!`,
        },
    ];

    return (
        <div id="N64" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>NINTENDO 64</h1>
            <p>
                The Nintendo 64 (N64) is a fifth-generation video game console released by Nintendo in 1996. It is known
                for
                its 3D graphics capabilities and unique controller design with an analog stick. The N64 used cartridges
                for
                games and was a significant advancement in gaming technology during its era.
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
                                        to={`/n64/game/${game.modalId}`}
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

export default N64;
