/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { gameCores } from '../components/GameData'; 
import { Link } from 'react-router-dom';

const CustomROM: React.FC = () => {
    const [enableDebug, setEnableDebug] = useState(false);
    const [enableThreads, setEnableThreads] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentCore, setCurrentCore] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setEnableDebug(urlParams.get('debug') === '1');
        setEnableThreads(urlParams.get('threads') === '1' && !!window.SharedArrayBuffer);

        if (enableDebug) {
            console.log("Debug is enabled");
        } else {
            console.log("Debug is disabled");
        }

        if (enableThreads) {
            console.log("Threads are enabled");
        } else {
            console.warn("Threads are disabled as SharedArrayBuffer is not available.");
            console.log("Threads are disabled");
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 300); 
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const url = URL.createObjectURL(file);
        const parts = file.name.split(".");
    
        const ext = parts.pop();
        const core = await determineCore(ext || '');
    
        const div = document.createElement("div");
        const sub = document.createElement("div");
        const script = document.createElement("script");
    
        sub.id = "game";
        div.id = "display";
    
        const top = document.getElementById("top");
        const box = document.getElementById("box");
        if (top) top.remove();
        if (box) box.remove();
    
        div.appendChild(sub);
        document.body.appendChild(div);
    
        (window as any).EJS_player = "#game";
        (window as any).EJS_gameName = parts.shift();
        (window as any).EJS_biosUrl = "";
        (window as any).EJS_gameUrl = url;
        (window as any).EJS_core = core;
        (window as any).EJS_pathtodata = `${import.meta.env.VITE_EMULATOR_BASE_URL}/${import.meta.env.VITE_EMULATOR_PATH}/data/`;
        (window as any).EJS_startOnLoaded = true;
        (window as any).EJS_DEBUG_XX = enableDebug;
        (window as any).EJS_disableDatabases = true;
        (window as any).EJS_threads = enableThreads;
    
        script.src = `${import.meta.env.VITE_EMULATOR_BASE_URL}/${import.meta.env.VITE_EMULATOR_PATH}/data/loader.js`;
        script.onload = () => {
            setCurrentCore(core);
        };
        document.body.appendChild(script);
    };

    const determineCore = async (ext: string) => {
        const coreMapping: { [key: string]: string[] } = {
            "nes": ["fds", "nes", "unif", "unf"],
            "snes": ["smc", "fig", "sfc", "gd3", "gd7", "dx2", "bsx", "swc"],
            "n64": ["z64", "n64"],
            "pce": ["pce"],
            "ngp": ["ngp", "ngc"],
            "ws": ["ws", "wsc"],
            "coleco": ["col", "cv"],
            "vice_x64sc": ["d64"],
        };

        for (const [core, extensions] of Object.entries(coreMapping)) {
            if (extensions.includes(ext)) return core;
        }

        return new Promise<string>((resolve) => {
            setShowControls(true);

            const button = document.createElement("button");
            button.textContent = "Load Game";
            button.className = "btn btn-dark mt-3 w-100";

            const fullscreenButton = document.createElement("button");
            fullscreenButton.textContent = isFullscreen ? "Minimize" : "Fullscreen";
            fullscreenButton.className = "btn btn-dark mt-3 w-100";

            const select = document.createElement("select");
            for (const [type, value] of Object.entries(gameCores)) {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = type;
                select.appendChild(option);
            }

            button.onclick = () => {
                if (containerRef.current) {
                    containerRef.current.classList.remove('min-vh-100');
                }
                resolve(select.value);
            };

            fullscreenButton.onclick = () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
            };

            const box = document.getElementById("box");
            if (box) {
                box.innerHTML = "";
                const controlsContainer = document.createElement("div");
                controlsContainer.className = "d-flex flex-column";
                controlsContainer.appendChild(select);
                controlsContainer.appendChild(button);
                controlsContainer.appendChild(fullscreenButton);
                box.appendChild(controlsContainer);
            }
        });
    };

    useEffect(() => {
        if (containerRef.current && (currentCore === 'n64' || currentCore === 'nes' || currentCore === 'snes')) {
            containerRef.current.classList.remove('min-vh-100');
        }
    }, [currentCore]);

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
                ref={containerRef}
                className={`d-flex justify-content-center align-items-center min-vh-100 fade-in ${isVisible ? 'show' : ''}`}
            >
                <div
                    id="box"
                    className={`p-4 border rounded ${dragging ? "dragging" : ""}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
                    }}
                >
                    <input
                        type="file"
                        id="input"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="input" className="d-block text-center" style={{ cursor: 'pointer' }}>
                        Drag ROM file or click here
                    </label>
                    <div className="text-center mt-3">
                        <h4 className="text-secondary">Made By ReiivanTheOnlyOne.</h4>
                        <Link to={'/'} className="btn btn-dark mt-3 w-100">Back</Link>
                    </div>
                    {showControls && (
                        <div className="d-flex flex-column">
                            <Link to={'/'} className="btn btn-dark mt-3 w-100">Back</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CustomROM;
