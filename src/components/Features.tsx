import React from 'react';

const featuresData = [
    {
        icon: 'bi bi-arrow-clockwise',
        title: 'LOAD & SAVE STATES',
    },
    {
        icon: 'bi bi-disc-fill',
        title: 'IMPORT & EXPORT SAVE',
    },
    {
        icon: 'bi bi-pause-circle-fill',
        title: 'PAUSE & RESTART MODE',
    },
    {
        icon: 'bi bi-toggles',
        title: 'CHEATS FOR GAMES',
    },
    {
        icon: 'bi bi-dpad',
        title: 'CONTROLLER SETTINGS',
    },
    {
        icon: 'bi bi-three-dots',
        title: 'MORE UPDATES & FEATURES',
    }
];
const Features: React.FC = () => {
    return (
        <>
            <h1 className="mt-4"><i className="bi bi-gear"></i>&nbsp;&nbsp;FEATURES</h1>
            <p>
                Enjoy a range of powerful features including load and save states for seamless gameplay, pause and
                restart mode for uninterrupted progress, customizable controller settings for a personalized experience, and
                built-in cheats to enhance your gaming adventures. Additionally, easily import and export save files to
                manage your game progress across different platforms, with more updates and features continuously added
                to improve your gaming experience.
            </p>
            <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 g-4">
                {featuresData.map((feature, index) => (
                    <div key={index} className="col">
                        <div className="card text-center border-4 border-light rounded h-100 d-flex flex-column">
                            <div className="card-body text-center d-flex flex-column flex-grow-1 rounded">
                                <i className={`${feature.icon} text-center color-transition rounded fs`} style={{ fontSize: '75px' }}></i>
                                <strong className="mt-auto">
                                    <h4 className="mt-4 py-2">{feature.title}</h4>
                                </strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
};

export default Features;
