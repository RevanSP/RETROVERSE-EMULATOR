import React from 'react';

interface Game {
    title: string;
    console: string;
}

const games: Game[] = [
    { title: 'Dig Dug', console: 'ATARI 2600' },
    { title: 'E. T. The Extra-Terrestrial', console: 'ATARI 2600' },
    { title: 'Fatal Run', console: 'ATARI 2600' },
    { title: 'Gravitar', console: 'ATARI 2600' },
    { title: 'Phoenix', console: 'ATARI 2600' },
    { title: 'Choplifter', console: 'ATARI 5200' },
    { title: 'Joust', console: 'ATARI 5200' },
    { title: 'Missile Command', console: 'ATARI 5200' },
    { title: 'Moon Patrol', console: 'ATARI 5200' },
    { title: 'Real Sports Tennis', console: 'ATARI 5200' },
    { title: 'Asteroid', console: 'ATARI 7800' },
    { title: 'MS. Pac Man', console: 'ATARI 7800' },
    { title: 'Pole Position 2', console: 'ATARI 7800' },
    { title: 'Summer Games', console: 'ATARI 7800' },
    { title: 'Winter Games', console: 'ATARI 7800' },
    { title: 'Batman Returns', console: 'ATARI LYNX' },
    { title: 'Hard Drivin', console: 'ATARI LYNX' },
    { title: 'Ninja Gaiden', console: 'ATARI LYNX' },
    { title: 'Pac-Land', console: 'ATARI LYNX' },
    { title: 'Road Blasters', console: 'ATARI LYNX' },
    { title: 'Atari Karts', console: 'ATARI JAGUAR' },
    { title: 'Doom', console: 'ATARI JAGUAR' },
    { title: 'Double Dragon V: The Shadow Falls', console: 'ATARI JAGUAR' },
    { title: 'NBA Jam', console: 'ATARI JAGUAR' },
    { title: 'Rayman', console: 'ATARI JAGUAR' },
    { title: 'Mario Kart 64', console: 'NINTENDO 64' },
    { title: 'Pokemon Stadium', console: 'NINTENDO 64' },
    { title: 'Super Mario 64', console: 'NINTENDO 64' },
    { title: 'Super Smash Bros', console: 'NINTENDO 64' },
    { title: 'The Legend Of Zelda Ocarina Of Time', console: 'NINTENDO 64' },
    { title: 'Animal Crossing Wild World', console: 'NINTENDO DS' },
    { title: 'Ghostbusters The Video Games', console: 'NINTENDO DS' },
    { title: 'Kirby Canvas Curse', console: 'NINTENDO DS' },
    { title: 'Mario Kart DS', console: 'NINTENDO DS' },
    { title: 'Sonic Rush', console: 'NINTENDO DS' },
    { title: 'Adventures Of Lolo', console: 'NES' },
    { title: 'Duck Hunt', console: 'NES' },
    { title: 'Gyromite', console: 'NES' },
    { title: 'Jackal', console: 'NES' },
    { title: 'Super Mario Bros', console: 'NES' },
    { title: 'Sonic Advance', console: 'GAME BOY ADVANCE' },
    { title: 'Sonic Advance 2', console: 'GAME BOY ADVANCE' },
    { title: 'Sonic Advance 3', console: 'GAME BOY ADVANCE' },
    { title: 'Sonic Battle', console: 'GAME BOY ADVANCE' },
    { title: 'Sonic Pinball Party', console: 'GAME BOY ADVANCE' },
    { title: 'Donkey Kong', console: 'GAME BOY' },
    { title: 'Kirby Pinball Land', console: 'GAME BOY' },
    { title: 'Mega Man V', console: 'GAME BOY' },
    { title: 'Tetris', console: 'GAME BOY' },
    { title: 'Wario Land Super Mario Land 3', console: 'GAME BOY' },
    { title: 'Alex Kiddin Miracle World', console: 'SEGA MASTER SYSTEM' },
    { title: 'Golden Axe', console: 'SEGA MASTER SYSTEM' },
    { title: 'Sonic Blast', console: 'SEGA MASTER SYSTEM' },
    { title: 'Sonic Chaos', console: 'SEGA MASTER SYSTEM' },
    { title: 'Sonic Spinball', console: 'SEGA MEGA DRIVE' },
    { title: 'Sonic The Hedgehog', console: 'SEGA MEGA DRIVE' },
    { title: 'Sonic The Hedgehog 2', console: 'SEGA MEGA DRIVE' },
    { title: 'Sonic The Hedgehog 3', console: 'SEGA MEGA DRIVE' },
    { title: 'Sonic The Hedgehog 3 & Knuckles', console: 'SEGA MEGA DRIVE' },
    { title: 'Sonic 3D Blast', console: 'SEGA MEGA DRIVE' },
    { title: 'Donkey Kong Country', console: 'SNES' },
    { title: 'Street Fighter II Turbo', console: 'SNES' },
    { title: 'Super Mario Kart', console: 'SNES' },
    { title: 'Super Mario World', console: 'SNES' },
    { title: 'Super Mario World 2 Yoshi\'s Island', console: 'SNES' },
    { title: 'Jack Bros', console: 'VIRTUAL BOY' },
    { title: 'Mario Clash', console: 'VIRTUAL BOY' },
    { title: 'Nester\'s Funky Bowling', console: 'VIRTUAL BOY' },
    { title: 'Red Alarm', console: 'VIRTUAL BOY' },
    { title: 'Telero Boxer', console: 'VIRTUAL BOY' },
];

const Games: React.FC = () => {
    return (
        <>
            <h1 className="mt-5"><i className="bi bi-chevron-double-up"></i>&nbsp;&nbsp;GAMES ADDED</h1>
            <p>Dive into the world of gaming with newly added games, and experience the thrill and excitement they have
                to offer. From timeless classics to the newest releases, explore our curated selection and find your next
                favorite game.</p>
            <div className="card mb-4 card-light-mode" id="no-zoom">
                <div className="card-body">
                    <ol>
                        {games.map((game, index) => (
                            <li key={index}>{game.title} - {game.console}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </>
    );
};

export default Games;
