/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { gameCores, gameDetails, gameMappings } from '../components/GameData';

interface GameDetails {
  title: string;
  publisher: string;
}

const GamePage: React.FC = () => {
  const { emulator, gameId } = useParams<{ emulator?: string; gameId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameInfo, setGameInfo] = useState<GameDetails>({
    title: 'Unknown Game',
    publisher: 'Unknown Publisher'
  });
  const [fadeIn, setFadeIn] = useState(false);

  const getEmulatorConfig = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const enableDebug = urlParams.get('debug') === '1';
    let enableThreads = false;

    if (urlParams.get('threads') === '1' && window.SharedArrayBuffer) {
      enableThreads = true;
      console.log('Threads are enabled');
    } else {
      console.log('Threads are disabled');
    }

    return { enableDebug, enableThreads };
  };

  const setupEmulator = async (config: { enableDebug: boolean; enableThreads: boolean }) => {
    if (!gameId || !gameMappings[gameId]) {
      console.error('Unknown game ID');
      return;
    }

    const { url, core } = gameMappings[gameId];
    const gameName = gameDetails[gameId]?.title || 'Unknown Game';

    const displayDiv = document.createElement('div');
    displayDiv.id = 'display';
    const gameDiv = document.createElement('div');
    gameDiv.id = 'game';
    displayDiv.appendChild(gameDiv);
    document.body.appendChild(displayDiv);

    document.getElementById('top')?.remove();
    document.getElementById('box')?.remove();

    const baseUrl = `${import.meta.env.VITE_EMULATOR_BASE_URL}/${import.meta.env.VITE_EMULATOR_PATH}`;
    
    window.EJS_player = '#game';
    window.EJS_gameName = gameName;
    window.EJS_gameUrl = url;
    window.EJS_core = core;
    window.EJS_pathtodata = `${baseUrl}/data/`;
    window.EJS_startOnLoaded = true;
    window.EJS_DEBUG_XX = config.enableDebug;
    window.EJS_disableDatabases = true;
    window.EJS_threads = config.enableThreads;

    const script = document.createElement('script');
    script.src = `${baseUrl}/data/loader.js`;
    script.onload = () => setIsGameStarted(true);
    document.body.appendChild(script);
  };

  useEffect(() => {
    setFadeIn(true);

    if (gameId && gameDetails[gameId]) {
      setGameInfo({
        title: gameDetails[gameId].title,
        publisher: gameDetails[gameId].publisher
      });
    }

    const config = getEmulatorConfig();
    const loadGameButton = document.getElementById('loadGameButton');
    
    if (loadGameButton) {
      loadGameButton.onclick = () => setupEmulator(config);
    }

    return () => {
      document.getElementById('display')?.remove();
      document.querySelector(`script[src*='loader.js']`)?.remove();

      const windowWithEJS = window as any;
      ['EJS_player', 'EJS_gameName', 'EJS_gameUrl', 'EJS_core', 
       'EJS_pathtodata', 'EJS_startOnLoaded', 'EJS_DEBUG_XX',
       'EJS_disableDatabases', 'EJS_threads'].forEach(prop => {
        delete windowWithEJS[prop];
      });

      setIsGameStarted(false);
      setGameInfo({
        title: 'Unknown Game',
        publisher: 'Unknown Publisher'
      });

      if (loadGameButton) {
        loadGameButton.onclick = null;
      }
    };
  }, [emulator, gameId, navigate, location]);

  return (
    <>
      <style>
        {`
          body, html { height: 100%; }
          .fade-in {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
          }
          .fade-in.show { opacity: 1; }
        `}
      </style>
      <div
        className={`d-flex justify-content-center align-items-center fade-in ${fadeIn ? 'show' : ''}`}
        style={isGameStarted ? {} : { minHeight: '100vh' }}
      >
        <div id="box">
          <h1 className="mt-5 text-center">{gameInfo.title}</h1>
          <h4 className="text-center">{gameInfo.publisher}</h4>
          <select id="coreSelect" style={{ display: 'none' }}>
            {Object.entries(gameCores).map(([system, value]) => (
              <option key={value} value={value}>
                {system}
              </option>
            ))}
          </select>
          <div className="d-flex justify-content-center mt-5">
            <Link to="/" className="btn btn-dark mx-1 btn-lg">
              Back
            </Link>
            <button id="loadGameButton" className="btn mx-1 btn-dark btn-lg">
              Start
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

declare global {
  interface Window {
    EJS_player: string;
    EJS_gameName: string;
    EJS_gameUrl: string;
    EJS_core: string;
    EJS_pathtodata: string;
    EJS_startOnLoaded: boolean;
    EJS_DEBUG_XX: boolean;
    EJS_disableDatabases: boolean;
    EJS_threads: boolean;
  }
}

export default GamePage;