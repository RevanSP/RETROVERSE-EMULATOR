
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import GamesInformation from '../components/GamesInformation';
import { Link } from 'react-router-dom';

interface Game {
    imgSrc: string;
    imgAlt: string;
    modalId: string;
}

const SEGAMD: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
        { imgSrc: "img/covers/sega-mega-drive/SonicTheHedgehog.jpg", imgAlt: "SONIC1", modalId: "sonic1" },
        { imgSrc: "img/covers/sega-mega-drive/SonicTheHedgehog2.jpg", imgAlt: "SONIC2", modalId: "sonic2" },
        { imgSrc: "img/covers/sega-mega-drive/SonicTheHedgehog3.jpg", imgAlt: "SONIC3", modalId: "sonic3" },
        { imgSrc: "img/covers/sega-mega-drive/S3K.jpg", imgAlt: "SONICKNUCKLES", modalId: "sonic3knuckles" },
        { imgSrc: "img/covers/sega-mega-drive/SONIC3D.jpg", imgAlt: "SONIC3DBLAST", modalId: "sonic3dblast" },
    ];

    const gameModals = [
        {
            id: "sonic1",
            title: "Sonic The Hedgehog",
            developer: "SEGA",
            releaseDate: "1991-06-23",
            genre: "Platformer",
            description: `Play one of the most influential game in the history
                                    of gaming! Collect golden rings and defeat Dr. Robotnik as Sonic The Hedgehog! Will
                                    you be able to set a new record and collect all of the golden rings and discover all
                                    the hidden paths and secrets? Good luck and have fun!
                                    Sonic The Hedgehog, also known as Sonic 1, is a fast-paced 2D side-scrolling
                                    platformer video game that was initially released in 1991 for various gaming
                                    platformers. The game is mostly known on the Sega Genesis console and has spawned
                                    countless fan-made hacks, and spinoffs. In this game, you will take control of a
                                    skillful hedgehog named Sonic as he tries to stop the evil Dr. Robotnik from
                                    stealing the six Chaos Emeralds and harness their powers and conquering.`,
            videoSrc: "https://www.youtube.com/embed/gjDanVVS5EI?si=uD1gHZfpTGoncibe",
        },
        {
            id: "sonic2",
            title: `Sonic The Hedgehog 2`,
            developer: `SEGA`,
            releaseDate: `1992-11-24`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/oR2HjN_GEZ8?si=b9yaY2hIHZQbx1dl`,
            description: `Run, jump, dash and spin through the levels as you
                                    control the blue hedgehog Sonic. Thwart the plans of Dr. Robotnik together with your
                                    friend Tails in Sonic the Hedgehog 2! Free the kidnapped animals and collect the
                                    golden rings!
                                    Sonic the Hedgehog 2 is a classic arcade game for the SEGA Genesis console. In this
                                    game, a new friend was introduced by the name of “Tails”. In this 1992 game, you
                                    must once again control the super quick Sonic and battle against the evil and
                                    nefarious Dr. Robotnik who have kidnapped all the animals for his experiments. The
                                    game features dozens of new levels and new challenges, as well as new enemies to
                                    face. The fast gameplay, smooth control, and nice scene transition makes this game
                                    highly addicting even for today’s standards. Have fun!`,
        },
        {
            id: "sonic3",
            title: `Sonic The Hedgehog 3`,
            developer: `SEGA`,
            releaseDate: `1994-02-02`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/lrdjLR1HR9s?si=m173MaBMUjZoxab8`,
            description: `Stop Dr. Robotnik from launching the Death Egg and
                                    spoil his evil plans. Meet Knuckles Echidna and collect magical rings in Sonic the
                                    Hedgehog 3! Play the classic fast-paced platformer game for the Sega console right
                                    in your browser! Rescue the world from peril once again in this popular retro game.
                                    Sonic the Hedgehog 3 is the direct sequel to the classic video game Sonic the
                                    Hedgehog 2. Just like in any previous titles, your goal is to reach the end of the
                                    map as fast as you can while staying safe, and collecting as many rings as you can.
                                    In this game, you will control either Sonic or Tails. Each character has their own
                                    unique ability, and some areas can only be accessed by playing the right character.
                                    Sonic the Hedgehog 3 was also the first of the series to introduce Knuckles to the
                                    cast of characters.`,
        },
        {
            id: "sonic3knuckles",
            title: `Sonic The Hedgehog 3 & Knuckles`,
            developer: `SEGA`,
            releaseDate: `1994-10-18`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/j350HVcB2dA?si=JSipRCuPZ88uogeC`,
            description: `Play as Knuckles and combine it with the gameplay of
                                    Sonic the Hedgehog 3 for a more grandeur adventure! Complete dozens of levels in
                                    Sonic & Knuckles + Sonic the Hedgehog 3! Find hidden areas, collect secret emeralds
                                    and unlock character secrets!
                                    Sonic & Knuckles + Sonic the Hedgehog 3 (also called Sonic 3 and Knuckles) is a
                                    sequel to the Sonic the Hedgehog 3 for Sega Genesis. This game is the only one on
                                    its platform to feature a lock-on technology that allows players to play as
                                    Knuckles. This game is acclaimed to be one of the greatest Sonic games of all time.
                                    The game also lets you play as super sonic and hyper sonic, but to unlock these
                                    characters you must find the 7 chaos and super emeralds. Have a blast and play this
                                    awesome retro game!`,
        },
        {
            id: "sonic3dblast",
            title: `Sonic 3D Blast`,
            developer: `SEGA`,
            releaseDate: `1996-11-29`,
            genre: `Platformer`,
            videoSrc: `https://www.youtube.com/embed/VPqPt_R7nuo?si=Mv7pzwcQoDm0sskX`,
            description: `Doctor Robotnik discovered a bird species called
                                    Flickies and a way to exploit them for his evil plan! Stop him and protect the birds
                                    in Sonic 3D Blast! Play on a 3D world and foil Dr. Robotnik’s vile plot again!
                                    Sonic 3D Blast (also known as Sonic 3D: Flickies’ Island) is a 2D isometric
                                    action-adventure game unlike your regular Sonic games. In this game, Sonic the
                                    Hedgehog must travel pn a pseudo-3D environments to collect tiny birds known as
                                    Flickies. The game features 7 zones, a final battle, and 7 additional special stages
                                    that are very complex. If you consider yourself a true Sonic fan, then you must play
                                    this game for the sake of playing it! Don’t forget to have fun!`,
        },
    ];

    return (
        <div id="MD" className={`fade-in ${isDarkMode ? 'show' : ''}`}>
            <h1>SEGA MEGA DRIVE</h1>
            <p>
                The Sega Mega Drive, also known as the Sega Genesis in North America, is a 16-bit home video game console
                released by Sega in 1988. It was known for its advanced graphics and sound capabilities, and it was a
                major
                competitor to the Super Nintendo Entertainment System (SNES).
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
                                        to={`/segamd/game/${game.modalId}`}
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

export default SEGAMD;
