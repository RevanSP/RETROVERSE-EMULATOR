
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const NES: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/nes/adventures-of-lolo-nes-front-cover.jpg", imgAlt: "adventureoflolo", modalId: "adventureoflolo" },
        { imgSrc: "img/covers/nes/duckhunt.jpg", imgAlt: "duckhunt", modalId: "duckhunt" },
        { imgSrc: "img/covers/nes/gyromite.jpg", imgAlt: "gyromite", modalId: "gyromite" },
        { imgSrc: "img/covers/nes/jackal.jpg", imgAlt: "jackal", modalId: "jackal" },
        { imgSrc: "img/covers/nes/supermariobros.jpg", imgAlt: "supermariobros", modalId: "supermariobros" },
    ];

    const gameModals = [
        {
            id: "adventureoflolo",
            title: `Adventure of Lolo`,
            developer: `HAL LABORATORY`,
            releaseDate: `1989-04-21`,
            genre: `Puzzle`,
            videoSrc: `https://www.youtube.com/embed/NOPm20GsulI?si=iE4t_Dk9_qsfsHAi`,
            description: `    Adventure of Lolo is a classic puzzle game developed by HAL Laboratory for the
                                    Nintendo Entertainment System. In this game, players control Lolo, a small, blue,
                                    and round character who must navigate through a series of challenging levels filled
                                    with various puzzles and enemies. The objective is to collect hearts and solve
                                    puzzles to advance through each stage. The game is known for its engaging and
                                    strategic gameplay, requiring players to think critically and plan their moves
                                    carefully. With its charming graphics and addictive puzzles, Adventure of Lolo
                                    remains a beloved title for fans of the genre.`,
        },
        {
            id: "duckhunt",
            title: `Duck Hunt`,
            developer: `NINTENDO`,
            releaseDate: `1984-10-18`,
            genre: `Arcade`,
            videoSrc: `https://www.youtube.com/embed/J3sfsP9W048?si=6hudAAiyWUwqvd8e`,
            description: `  Duck Hunt is a classic light gun shooter game developed by Nintendo for the Nintendo
                                    Entertainment System. Players use the NES Zapper light gun to shoot ducks that
                                    appear on the screen. The game features a variety of modes, including single-player
                                    and multiplayer options, where players aim to hit as many ducks as possible within a
                                    time limit. With its simple yet engaging gameplay, Duck Hunt became a popular title
                                    and is remembered for its iconic graphics and the distinctive "laughing" sound of
                                    the elusive duck that escapes the player's aim.`,
        },
        {
            id: "gyromite",
            title: `Gyromite`,
            developer: `NINTENDO`,
            releaseDate: `1985-02-14`,
            genre: `Puzzle`,
            videoSrc: `https://www.youtube.com/embed/I0t3WKe-zGY?si=O_rOUWwAcXw5u0dX`,
            description: ` Gyromite is a classic puzzle game developed by Nintendo for the Nintendo
                                    Entertainment System. In the game, players control Professor Hector who must
                                    navigate through a series of levels while solving puzzles and avoiding obstacles.
                                    The gameplay involves manipulating the environment by rotating gyros to move
                                    platforms and clear pathways. Gyromite was notable for its use of the ROB (Robot
                                    Operating Buddy) accessory, which helped players interact with the game in a unique
                                    way. The game's challenging puzzles and innovative use of technology made it a
                                    memorable title in the NES library.`,
        },
        {
            id: "jackal",
            title: `Jackal`,
            developer: `KONAMI`,
            releaseDate: `1988-03-01`,
            genre: `Run and Gun`,
            videoSrc: `https://www.youtube.com/embed/VKLGsDnKGq4?si=Yp_5FiGOmc1F85Y_`,
            description: `Jackal, developed by Konami, is a top-down run-and-gun shooter for the Nintendo
                                    Entertainment System. Players control a jeep as they navigate through enemy
                                    territory to rescue prisoners of war. The game features cooperative gameplay,
                                    allowing two players to team up and tackle missions together. With its intense
                                    action, diverse levels, and challenging enemies, Jackal offers a dynamic and
                                    engaging experience. The game's combination of strategic driving and shooting, along
                                    with its cooperative mode, makes it a standout title in the NES library.`,
        },
        {
            id: "supermariobros",
            title: `Super Mario Bros.`,
            developer: `NINTENDO`,
            releaseDate: `1985-09-13`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/rLl9XBg7wSs?si=Gk3doMnM23Z2JalM`,
            description: ` Super Mario Bros., developed by Nintendo, is a classic platformer that
                                    revolutionized the video game industry. Players control Mario as he embarks on a
                                    quest to rescue Princess Toadstool from the evil Bowser. The game is known for its
                                    iconic gameplay, which involves running, jumping, and collecting power-ups to
                                    overcome obstacles and enemies. With its vibrant graphics, memorable music, and
                                    innovative level design, Super Mario Bros. set a new standard for platforming games
                                    and remains a beloved classic to this day.`,
        },
    ];

    return (
        <div id="NES" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1 className="d-block d-md-none">NES</h1>
            <h1 className="d-none d-md-block">NINTENDO ENTERTAINMENT SYSTEM</h1>
            <p>The Nintendo Entertainment System (NES), released in North America in 1985, is an 8-bit home video game
                console developed by Nintendo. It played a significant role in revitalizing the video game industry
                after
                the crash of 1983. The NES featured a simple, rectangular controller and popularized the use of
                interchangeable game cartridges. Its success established Nintendo as a dominant force in the gaming
                industry
                and set the standard for future home consoles.</p>
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
                                        to={`/nes/game/${game.modalId}`}
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

export default NES;
