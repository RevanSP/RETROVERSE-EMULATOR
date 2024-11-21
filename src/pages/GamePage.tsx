/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { gameCores, gameDetails, gameMappings } from '../components/GameData';

const GamePage: React.FC = () => {
    const { emulator, gameId } = useParams<{ emulator?: string, gameId?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [gameTitle, setGameTitle] = useState<string>('Unknown Game');
    const [gamePublisher, setGamePublisher] = useState<string>('Unknown Publisher');
    const [fadeIn, setFadeIn] = useState<boolean>(false);

    useEffect(() => {
        setFadeIn(true);
    
        const urlParams = new URLSearchParams(window.location.search);
        const enableDebug = urlParams.get('debug') === '1';
        let enableThreads = false;
    
        if (enableDebug) {
            console.log("Debug is enabled");
        } else {
            console.log("Debug is disabled");
        }
    
        if (urlParams.get('threads') === '1') {
            if (window.SharedArrayBuffer) {
                enableThreads = true;
                console.log("Threads are enabled");
            } else {
                console.warn("Threads are disabled as SharedArrayBuffer is not available.");
                console.log("Threads are disabled");
            }
        } else {
            console.log("Threads are disabled");
        }
    
        const loadGame = async () => {
            if (!gameId || !gameMappings[gameId]) {
                console.error("Unknown game ID");
                return;
            }
    
            const { url, core } = gameMappings[gameId];
            const gameName = gameDetails[gameId]?.title || 'Unknown Game';
    
            const div = document.createElement("div");
            div.id = "display";
            const sub = document.createElement("div");
            sub.id = "game";
            div.appendChild(sub);
            document.body.appendChild(div);
    
            document.getElementById("top")?.remove();
            document.getElementById("box")?.remove();
    
            (window as any).EJS_player = "#game";
            (window as any).EJS_gameName = gameName;
            (window as any).EJS_gameUrl = url;
            (window as any).EJS_core = core;
            (window as any).EJS_pathtodata = `${import.meta.env.VITE_EMULATOR_BASE_URL}/${import.meta.env.VITE_EMULATOR_PATH}/data/`;
            (window as any).EJS_startOnLoaded = true;
            (window as any).EJS_DEBUG_XX = enableDebug;
            (window as any).EJS_disableDatabases = true;
            (window as any).EJS_threads = enableThreads;
    
            const script = document.createElement("script");
            script.src = `${import.meta.env.VITE_EMULATOR_BASE_URL}/${import.meta.env.VITE_EMULATOR_PATH}/data/loader.js`;
            script.onload = () => setIsGameStarted(true);
            document.body.appendChild(script);
        };
    
        const loadGameButton = document.getElementById('loadGameButton');
        if (loadGameButton) {
            loadGameButton.onclick = loadGame;
        }
    
        if (gameId && gameDetails[gameId]) {
            const details = gameDetails[gameId];
            setGameTitle(details.title);
            setGamePublisher(details.publisher);
        } else {
            setGameTitle('Unknown Game');
            setGamePublisher('Unknown Publisher');
        }
    
        return () => {
            const displayDiv = document.getElementById("display");
            if (displayDiv) {
                document.body.removeChild(displayDiv);
            }
    
            const script = document.querySelector(`script[src^='${import.meta.env.VITE_EMULATOR_BASE_URL}/${import.meta.env.VITE_EMULATOR_PATH}/data/loader.js']`);
            if (script) {
                document.body.removeChild(script);
            }
    
            delete (window as any).EJS_player;
            delete (window as any).EJS_gameName;
            delete (window as any).EJS_gameUrl;
            delete (window as any).EJS_core;
            delete (window as any).EJS_pathtodata;
            delete (window as any).EJS_startOnLoaded;
            delete (window as any).EJS_DEBUG_XX;
            delete (window as any).EJS_disableDatabases;
            delete (window as any).EJS_threads;
    
            setIsGameStarted(false);
            setGameTitle('Unknown Game');
            setGamePublisher('Unknown Publisher');
    
            if (loadGameButton) {
                loadGameButton.onclick = null;
            }
        };
    }, [emulator, gameId, navigate, location]);
    
    return (
        <>
            <style>
                {`
                body, html {
                    height: 100%;
                }

                .fade-in {
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                }

                .fade-in.show {
                    opacity: 1;
                }
                `}
            </style>
            <div
                className={`d-flex justify-content-center align-items-center fade-in ${fadeIn ? 'show' : ''}`}
                style={isGameStarted ? {} : { minHeight: '100vh' }}
            >
                <div id="box">
                    <h1 className="mt-5 text-center">{gameTitle}</h1>
                    <h4 className="text-center">{gamePublisher}</h4>
                    <select id="coreSelect" style={{ display: 'none' }}>
                        {Object.entries(gameCores).map(([system, value]) => (
                            <option key={value} value={value}>
                                {system}
                            </option>
                        ))}
                    </select>
                    <div className="d-flex justify-content-center mt-5">
                        <Link to={'/'} className="btn btn-dark mx-1 btn-lg">Back</Link>
                        <button id="loadGameButton" className="btn mx-1 btn-dark btn-lg">Start</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GamePage;
