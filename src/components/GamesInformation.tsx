import React from 'react';
import Modal from './Modal'; 

interface GameModal {
    id: string;
    title: string;
    developer: string;
    releaseDate: string;
    genre: string;
    description: string;
    videoSrc: string;
}

interface GamesInformationProps {
    gameModals: GameModal[];
    activeModalId: string | null;
}

const GamesInformation: React.FC<GamesInformationProps> = ({ gameModals, activeModalId }) => {
    return (
        <>
            {gameModals.map(modal => (
                <Modal
                    key={modal.id}
                    id={modal.id}
                    title={modal.title}
                    developer={modal.developer}
                    releaseDate={modal.releaseDate}
                    genre={modal.genre}
                    description={modal.description}
                    videoSrc={modal.videoSrc}
                    activeModalId={activeModalId || ''}
                />
            ))}
        </>
    );
};

export default GamesInformation;
