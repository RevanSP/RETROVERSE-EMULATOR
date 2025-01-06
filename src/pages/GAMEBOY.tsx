
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const GAMEBOY: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/gameboy/donkeykong.jpg", imgAlt: "donkeykong", modalId: "donkeykong" },
        { imgSrc: "img/covers/gameboy/kirby.jpg", imgAlt: "kirby", modalId: "kirby" },
        { imgSrc: "img/covers/gameboy/megaman.jpg", imgAlt: "megaman", modalId: "megaman" },
        { imgSrc: "img/covers/gameboy/tetris.jpg", imgAlt: "tetris", modalId: "tetris" },
        { imgSrc: "img/covers/gameboy/wario.jpg", imgAlt: "wario", modalId: "wariolandsupermarioland3" },
    ];

    const gameModals = [
        {
            id: "donkeykong",
            title: `Donkey Kong`,
            developer: `NINTENDO`,
            releaseDate: `1994-06-01`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/f_fKDQeG9Dg?si=AI9hTYgNjz1rorZo`,
            description: `  Donkey Kong for the Game Boy is a beloved platformer that revisits the classic
                                    arcade experience with new levels and challenges. In this game, players control
                                    Mario as he embarks on a quest to rescue his girlfriend, Pauline, from the clutches
                                    of the titular ape, Donkey Kong. The game features a series of increasingly
                                    difficult levels, each filled with obstacles and enemies that players must navigate.
                                    With its engaging gameplay and iconic characters, Donkey Kong offers a nostalgic
                                    trip for fans of the original arcade game while providing fresh puzzles and
                                    platforming action on the portable Game Boy system.`,
        },
        {
            id: "kirbypartyland",
            title: `Kirby's Pinball Land`,
            developer: `NINTENDO`,
            releaseDate: `1993-03-01`,
            genre: `Pinball`,
            videoSrc: `https://www.youtube.com/embed/zwrw-k74TOU?si=DRjwdZ90LuGR7FRo`,
            description: ` Kirby's Pinball Land is a unique pinball game featuring Kirby, the beloved pink
                                    puffball from Nintendo's franchise. In this game, players control a pinball table
                                    where Kirby acts as the pinball, bouncing through various stages and collecting
                                    points. Each table is designed with different themes and challenges, providing a
                                    fresh experience as players aim to hit targets, unlock bonuses, and defeat enemies.
                                    The game combines the classic pinball mechanics with Kirby’s charming aesthetics and
                                    power-ups, creating a fun and engaging pinball experience for fans of the series and
                                    newcomers alike.`,
        },
        {
            id: "megaman",
            title: `Mega Man V`,
            developer: `CAPCOM`,
            releaseDate: `1994-12-01`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/95T3Y5N_YbQ?si=jl7qy0drVc1mfQUN`,
            description: ` Mega Man V is a classic action-platformer game for the Game Boy, continuing the
                                    popular Mega Man series. In this installment, players control Mega Man as he battles
                                    a new set of robotic enemies and bosses across various stages. The game introduces
                                    new features and abilities, including the ability to use special weapons and
                                    upgrades collected from defeated bosses. With challenging levels, tight controls,
                                    and memorable music, Mega Man V provides an engaging experience that fans of the
                                    series and newcomers will appreciate. The game's design stays true to the series'
                                    roots while offering fresh content and challenges.`,
        },
        {
            id: "tetris",
            title: `Tetris`,
            developer: `BLUE BOX`,
            releaseDate: `1989-07-01`,
            genre: `Puzzle`,
            videoSrc: `https://www.youtube.com/embed/BQwohHgrk2s?si=EKSQhhcQNDMpVjOq`,
            description: `  Tetris is a renowned puzzle game originally designed by Alexey Pajitnov. The Game
                                    Boy version, released in 1989, popularized the game worldwide. Players must rotate
                                    and arrange falling tetrominoes to create complete lines, which then disappear,
                                    earning points and preventing the screen from filling up. Its simple yet addictive
                                    gameplay has made it a timeless classic, challenging players to beat their high
                                    scores and master increasingly difficult levels. Tetris is celebrated for its
                                    engaging mechanics and the iconic "Tetris Effect," a psychological phenomenon
                                    experienced by players.`,
        },
        {
            id: "wariolandsupermarioland3",
            title: `Wario Land: Super Mario Land 3`,
            developer: `NINTENDO`,
            releaseDate: `1994-06-21`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/akDGI8NT2MU?si=GRvmDqck4WgwP_PC`,
            description: `    Wario Land: Super Mario Land 3 is a platformer game developed by Nintendo for the
                                    Game Boy. As the third entry in the Super Mario Land series, it introduces Wario as
                                    the main character. In this game, players control Wario as he embarks on a quest to
                                    find treasure and defeat enemies across various levels. The game is known for its
                                    unique mechanics, including Wario's ability to transform into different forms and
                                    use his strength to overcome obstacles. With its engaging gameplay and charming
                                    graphics, Wario Land: Super Mario Land 3 offers a fresh and entertaining experience
                                    for fans of platformers.`,
        },
    ];

    return (
        <div id="GB" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>NINTENDO GAME BOY</h1>
            <p>
                The Nintendo Game Boy is an 8-bit handheld gaming console developed and manufactured by Nintendo.
                Released in
                1989, it features a monochrome LCD screen and interchangeable game cartridges, allowing players to enjoy
                a
                variety of games. The Game Boy is known for its portability, durability, and long battery life, making
                it
                one of the most popular handheld consoles of its time.
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
                                        to={`/gameboy/game/${game.modalId}`}
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

export default GAMEBOY;
