import React, { useRef, useEffect } from 'react';

interface ModalProps {
    id: string;
    title: string;
    developer: string;
    releaseDate: string;
    genre: string;
    description: string;
    videoSrc: string;
    activeModalId: string;
}

const Modal: React.FC<ModalProps> = ({
    id,
    title,
    developer,
    releaseDate,
    genre,
    description,
    videoSrc,
    activeModalId
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            const handleShow = () => {
                const iframe = modalElement.querySelector('iframe');
                if (iframe) iframe.src = videoSrc;
            };

            const handleHide = () => {
                const iframe = modalElement.querySelector('iframe');
                if (iframe) iframe.src = '';
            };

            modalElement.addEventListener('show.bs.modal', handleShow);
            modalElement.addEventListener('hide.bs.modal', handleHide);

            return () => {
                modalElement.removeEventListener('show.bs.modal', handleShow);
                modalElement.removeEventListener('hide.bs.modal', handleHide);
            };
        }
    }, [videoSrc]);

    return (
        <div
            ref={modalRef}
            className="modal fade"
            id={id}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby={`${id}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered px-1">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-light">
                        <h1 className="modal-title fs-5" id={`${id}Label`}>{title}</h1>
                        <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{ backgroundColor: '#f1f1f1' }}>
                        <div className="row d-flex align-items-stretch">
                            <div className="col-md-12">
                                <div className="card border-0 shadow h-100" id="no-zoom">
                                    <div className="card-body d-flex flex-column">
                                        <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%' }}>
                                            <iframe
                                                className="rounded"
                                                src={activeModalId === id ? videoSrc : ''}
                                                title="YouTube video player"
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <div className="card border-0 shadow h-100" id="no-zoom">
                                    <div className="card-body d-flex flex-column">
                                        <h1><strong>{title}</strong></h1>
                                        <h4><strong>{developer}</strong></h4>
                                        <p className="mt-3"><strong>Release Date :</strong> {releaseDate}</p>
                                        <p><strong>Genre :</strong> <span className="badge bg-primary rounded  text-light">{genre}</span></p>
                                        <p><strong>Description :</strong> {description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer bg-dark">
                        <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
