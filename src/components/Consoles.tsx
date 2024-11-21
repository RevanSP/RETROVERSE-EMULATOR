import React from 'react';

const Consoles: React.FC = () => {
  const consoleName: string = 'ATARI 2600, ATARI 5200, ATARI 7800, ATARI JAGUAR, ATARI LYNX, ' +
    'NINTENDO 64, NINTENDO DS, NINTENDO ENTERTAINMENT SYSTEM, NINTENDO GAME BOY ADVANCE, ' +
    'NINTENDO GAME BOY, SEGA MASTER SYSTEM, SEGA MEGA DRIVE, SUPER NINTENDO ENTERTAINMENT SYSTEM, ' +
    'VIRTUAL BOY';

  const consoles: string[] = consoleName.split(', ');

  return (
    <section className="console-section">
      <h1 className="mt-5">
        <i className="bi bi-controller"></i>&nbsp;&nbsp;CONSOLE ADDED
      </h1>
      <p>
        Welcome to our comprehensive list of gaming consoles! Whether you're a nostalgic gamer looking to revisit
        the classics or a newcomer curious about the history of gaming, we've got you covered. Explore our collection of
        consoles and discover the legacy of gaming through the decades.
      </p>
      <p>
        Pick a console to dive into the fun. Consoles included are:
      </p>
      <div className="card mb-5 card-light-mode" id="no-zoom">
        <div className="card-body">
          <div className="row d-none d-md-flex">
            <div className="col-md-6">
              <ul>
                {consoles.slice(0, Math.ceil(consoles.length / 2)).map((console, index) => (
                  <li key={index}>{console}</li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              <ul>
                {consoles.slice(Math.ceil(consoles.length / 2)).map((console, index) => (
                  <li key={index}>{console}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row d-block d-md-none">
            <ul className="px-5">
              {consoles.map((console, index) => (
                <li key={index}>{console}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card-footer border-3 bg-secondary text-light">
          <small>
            <i className="bi bi-floppy2"></i>&nbsp;&nbsp;Total Consoles: {consoles.length}
          </small>
        </div>
      </div>
    </section>
  );
};

export default Consoles;
