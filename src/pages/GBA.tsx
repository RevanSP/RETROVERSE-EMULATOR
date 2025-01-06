
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const GBA: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/gameboy-advance/sonicadvance.jpg", imgAlt: "sonicadvance", modalId: "sonicadvance" },
        { imgSrc: "img/covers/gameboy-advance/sonicadvance2.jpg", imgAlt: "sonicadvance2", modalId: "sonicadvance2" },
        { imgSrc: "img/covers/gameboy-advance/sonicadvance3.jpg", imgAlt: "sonicadvance3", modalId: "sonicadvance3" },
        { imgSrc: "img/covers/gameboy-advance/sonicbattle.jpg", imgAlt: "sonicbattle", modalId: "sonicbattle" },
        { imgSrc: "img/covers/gameboy-advance/SonicPinballParty.jpg", imgAlt: "sonicpinballparty", modalId: "sonicpinballparty" },
    ];

    const gameModals = [
        {
            id: "sonicadvance",
            title: `Sonic Advance`,
            developer: `SEGA`,
            releaseDate: `2001-12-20`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/yh86Uuj3I_U?si=wlTHEsV-smkNGlmm`,
            description: `Play the very first Sonic game on a Nintendo system
                                    and use your favorite character! Race through challenging platforms in Sonic
                                    Advance! Collect gold rings and avoid baddies as you try to finish each level in the
                                    least amount of time.
                                    Sonic Advance is a 2D platformer game that spanned a whole new series on Nintendo
                                    handhelds. The game features beautiful arts, colorful graphics, and smooth movement,
                                    that was considered a great leap and step up from previous generation Sonic games.
                                    Level design are also better with bigger stages and larger levels. Playable
                                    characters are: Sonic, Knuckles, Amy, and Tails! Sonic Advance also features Time
                                    Attack Mode and Versus mode. However, versus mode does not work on an emulator. In
                                    addition, Sonic Advance features Tiny Chao Garden which is sort of like a pet
                                    Tamagochi mini game.`,
        },
        {
            id: "sonicadvance2",
            title: `Sonic Advance 2`,
            developer: `SEGA`,
            releaseDate: `2002-12-19`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/ux4joGSOjC8?si=5Vr9XYN1CeXz-lgV`,
            description: `Dash through the forest, and other levels as Sonic the
                                    Hedgehog and unlock other characters in this retro platformer game – Sonic Advance
                                    2! Feel the speed as you dash, roll, and make hola-hoops in the jungle! Collect as
                                    many rings as you can and don’t let anyone or anything stop you!
                                    Sonic Advance 2 is a speed-run platformer game for the GameBoy Advance (GBA). Sonic
                                    Advance 2 features a new character with the name “Cream – the Rabbit” along with her
                                    Chao “Cheese”. The game also features better performance and animation, and catchier
                                    music than the first Sonic Advance game. Try and stop Dr. Eggman from his evil plans
                                    again in the second installment of the Sonic Advance franchise. Will you be able to
                                    complete each act in less than two minutes?`,
        },
        {
            id: "sonicadvance3",
            title: `Sonic Advance 3`,
            developer: `SEGA`,
            releaseDate: `2004-06-07`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/kAOaORo2L7w?si=StMUmPtigFH3ebsd`,
            description: `One of the most popular Sonic game for the game boy
                                    advance is here! Prepare for another fast paced action and jumping in Sonic Advance
                                    3!
                                    Select two characters from the five main characters of the Sonic franchise: Sonic,
                                    Knuckles, Cream, Tails, and Amy and start your adventure across various locations.
                                    Each character has their own unique ability and requires different play style.
                                    Collect as many rings as you can and avoid getting hit. Reach the finish line with
                                    as little time as possible to earn more points. Sonic Advance 3 follows the story of
                                    Sonic Battle and features some great music and sound effects from it. The game’s tag
                                    mechanic also sets it a part from the other Sonic titles.`,
        },
        {
            id: "sonicbattle",
            title: `Sonic Battle`,
            developer: `SEGA`,
            releaseDate: `2003-12-04`,
            genre: `Action`,
            videoSrc: `https://www.youtube.com/embed/xg7jm-zWClM?si=ecKmK3wYa0Z1hh4P`,
            description: `If you think that Sonic the Hedgehog is all run and no
                                    fight, then think again! Check out the awesome fighting moves of Sonic and the gang
                                    in Sonic Battle! Step inside the unique combat ring and battle other characters of
                                    the Sonic franchise.

                                    Sonic Battle is a GameBoy Advance (GBA) game published by SEGA and is a spin-off to
                                    the usual Sonic dashing games. In this game, Sonic and other characters of the
                                    franchise will battle it out in a unique combat style. Play as Sonic as the gang
                                    tries to determine which one of them all are the best fighters. Choose from one of
                                    the eight characters – each with their own strengths and weaknesses. Choose the
                                    arena, and customize your special attack in this cool Sonic Spin Off game!`,
        },
        {
            id: "sonicpinballparty",
            title: `Sonic Pinball Party`,
            developer: `SEGA`,
            releaseDate: `2003-11-20`,
            genre: `Arcade`,
            videoSrc: `https://www.youtube.com/embed/MTcwG4MDqAw?si=38AFr7eJcL47jNTe`,
            description: ` win the pinball tournament to rescue your friends in
                                    Sonic Pinball Party! Defeat Eggman in every level to move to the next until you win
                                    the Egg Cup!

                                    Sonic Pinball Party is a 2003 video game and the second Sonic themed pinball game
                                    released for the Game Boy Advance handheld system (GBA). The game is somewhat a
                                    celebration for all previous Sonic games and introduces many references and
                                    characters from these games. The game features three pinball tables based on three
                                    Sonic Games: Sonic Advance, Nights into Dreams, and Samba de Amigo. You must rescue
                                    Tails, Knuckles, and Amy as you try to defeat Eggman and spoil his plans!`,
        },
    ];

    return (
        <div id="GBA" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>NINTENDO GAME BOY ADVANCE</h1>
            <p>
                The Nintendo Game Boy Advance is a 32-bit handheld gaming console developed by Nintendo. It features a
                horizontal design, a color screen, and backwards compatibility with Game Boy and Game Boy Color games.
                Released in 2001, the GBA is known for its extensive library of games and improved graphics compared to
                its
                predecessors.
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
                                        to={`/gba/game/${game.modalId}`}
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

export default GBA;
