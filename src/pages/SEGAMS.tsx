
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const SEGAMS: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/sega-master-system/alex-kidd-in-miracle-world-sega-master-system-cover-340x483.jpg", imgAlt: "alexkiddinmiracleworld", modalId: "alexkiddinmiracleworld" },
        { imgSrc: "img/covers/sega-master-system/golden-axe-master-system-cover-340x483.jpg", imgAlt: "goldenaxe", modalId: "goldenaxe" },
        { imgSrc: "img/covers/sega-master-system/sonic-blast-sega-master-system-cover-340x483.jpg", imgAlt: "sonicblast", modalId: "sonicblast" },
        { imgSrc: "img/covers/sega-master-system/sonic-chaos-master-system-cover-340x483.jpg", imgAlt: "sonicchaos", modalId: "sonicchaos" },
        { imgSrc: "img/covers/sega-master-system/sonic-the-hedgehog-spinball-sega-master-system-cover-340x483.jpg", imgAlt: "sonicspinball", modalId: "sonicspinball" },
    ];

    const gameModals = [
        {
            id: "alexkiddinmiracleworld",
            title: `Alex Kidd in Miracle World`,
            developer: `SEGA`,
            releaseDate: `1986-12-01`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/BcKVXPDqJGI?si=vwRFYAHU6v-PqtW_`,
            description: `Alex Kidd in Miracle World is a classic platformer
                                    developed by Sega for the SEGA Master System. The game follows Alex Kidd, a young
                                    hero with extraordinary abilities, as he embarks on a quest to rescue his kidnapped
                                    brother and restore peace to the kingdom of Miracle World. Players will navigate
                                    through various stages, each filled with enemies, obstacles, and challenging bosses.
                                    The game features colorful graphics, engaging level design, and a variety of
                                    power-ups, making it a beloved title in the platforming genre.`,
        },
        {
            id: "goldenaxe",
            title: `Golden Axe`,
            developer: `SEGA`,
            releaseDate: `1990-01-01`,
            genre: `Beat 'em up`,
            videoSrc: `https://www.youtube.com/embed/OHbJLhumzUs?si=ytLhEKelsCQ64eR8`,
            description: `Golden Axe is a classic beat 'em up game developed by
                                    Sega for the SEGA Master System. Set in a fantasy world, players can choose from
                                    three distinct heroes—Ax Battler, Tyris Flare, and Gilius Thunderhead—as they embark
                                    on a quest to defeat the evil Death Adder and his minions. The game features
                                    side-scrolling combat, allowing players to use various weapons and magical abilities
                                    to battle through hordes of enemies. With its engaging gameplay and cooperative
                                    multiplayer mode, Golden Axe remains a popular and influential title in the beat 'em
                                    up genre.`,
        },
        {
            id: "sonicblast",
            title: `Sonic Blast`,
            developer: `Ancient`,
            releaseDate: `1996-11-01`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/Vbaz5nb1xZo?si=ku_FEZx3a2HwdqA-`,
            description: `Sonic Blast is a platformer game developed by Ancient
                                    for the SEGA Master System. It features Sonic the Hedgehog and his friend Tails as
                                    they set out to thwart the plans of the evil Dr. Robotnik. The game combines classic
                                    2D platforming action with vibrant graphics and engaging level design. Players can
                                    navigate through various levels, collecting rings and power-ups while battling
                                    enemies and overcoming obstacles. Sonic Blast is known for its fast-paced gameplay
                                    and its contribution to the Sonic series on the Master System.`,
        },
        {
            id: "sonicchaos",
            title: `Sonic Chaos`,
            developer: `Ancient`,
            releaseDate: `1993-12-15`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/BqL-o1DcPaQ?si=CXfX7aotK5CSBzFH`,
            description: `Sonic Chaos is a platformer game developed by Ancient
                                    for the SEGA Master System. It features Sonic the Hedgehog and his sidekick Tails in
                                    their quest to stop Dr. Robotnik from seizing control of the world. The game
                                    introduces new gameplay elements such as the ability to collect Chaos Emeralds,
                                    which grant Sonic new powers. With vibrant graphics and engaging level design, Sonic
                                    Chaos delivers fast-paced platforming action and is a notable entry in the Sonic
                                    series for the Master System.`,
        },
        {
            id: "sonicspinball",
            title: `Sonic Spinball`,
            developer: `SEGA`,
            releaseDate: `1993-12-01`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/1l1TXtKwsF8?si=HW9uCCpStdr1zwix`,
            description: `Sonic Spinball is a unique blend of pinball and
                                    platforming developed by Sega for the SEGA Master System. In this game, players
                                    control Sonic the Hedgehog as he navigates through various pinball-themed levels.
                                    The objective is to defeat Dr. Robotnik by hitting targets and completing objectives
                                    within the pinball tables. The game features fast-paced gameplay, vibrant graphics,
                                    and combines elements of traditional pinball with Sonic's signature speed and
                                    platforming action.`,
        },
    ];

    return (
        <div id="MS" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>SEGA MASTER SYSTEM</h1>
            <p>The Sega Master System is an 8-bit home video game console released by Sega in 1985. It was designed to
                compete with the Nintendo Entertainment System (NES) and featured superior graphics and sound
                capabilities.
                The Master System was known for its sleek design and an impressive library of games, including titles
                like
                "Alex Kidd in Miracle World" and "Sonic the Hedgehog." Despite its technical advantages, the Master
                System
                struggled to gain a foothold in the North American market, largely due to Nintendo's strong presence and
                exclusive agreements with game developers. However, it found significant success in Europe, Brazil, and
                other regions, becoming a beloved platform for many gamers around the world.</p>
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
                                        to={`/segams/game/${game.modalId}`}
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

export default SEGAMS;
