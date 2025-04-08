/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { BsCloudUpload, BsFileEarmark, BsInfoLg, BsPlayFill } from "react-icons/bs";

const CORE_MAP = {
    nes: ["fds", "nes", "unif", "unf"],
    snes: ["smc", "fig", "sfc", "gd3", "gd7", "dx2", "bsx", "swc"],
    n64: ["z64", "n64"],
    gb: ["gb", "gbc"],
    gba: ["gba"],
    nds: ["nds"],
    segaMS: ["sms"],
    segaMD: ["gen", "md", "smd"],
    jaguar: ["j64", "jag"],
    lynx: ["lnx"],
    vb: ["vb"],
    atari2600: ["a26"],
    atari5200: ["a52"],
    atari7800: ["a78"]
};

const CustomROM = () => {
    const [selectedVersion, setSelectedVersion] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedCore, setSelectedCore] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [biosFile, setBiosFile] = useState(null);
    const [patchFile, setPatchFile] = useState(null);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [mounted, setMounted] = useState(false);
    const [versions, setVersions] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [cores, setCores] = useState([]);
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const endpoints = ['emu-version', 'languages', 'cores'];
            const baseUrl = '/api';

            const fetchJSON = async (endpoint) => {
                const res = await fetch(`${baseUrl}/${endpoint}`, {
                    headers: {
                        'Authorization': process.env.NEXT_PUBLIC_API_TOKEN,
                    },
                });
                return res.json();
            };

            try {
                const [versionsData, languagesData, coresData] = await Promise.all(endpoints.map(fetchJSON));
                setVersions(Array.isArray(versionsData) ? versionsData : []);
                setLanguages(languagesData || []);
                setCores(coresData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (!mounted) {
            setMounted(true);
            fetchData();
        }
    }, [mounted]);

    const handleChange = setter => e => setter(e.target.value);

    const preventDefaults = e => e.preventDefault();

    const toggleHighlight = (add, dropArea) => dropArea.classList.toggle('border-blue-500', add);

    const getAutoCore = (ext) => {
        const entry = Object.entries(CORE_MAP).find(([_, exts]) =>
            exts.includes(ext.toLowerCase())
        );
        return entry ? entry[0] : '';
    };

    const handleFiles = (files) => {
        if (files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            document.getElementById('file-name').textContent = file.name;
            document.getElementById('default-icon').classList.add('hidden');
            document.getElementById('file-icon').classList.remove('hidden');

            if (!selectedCore) {
                const ext = file.name.split(".").pop() || '';
                const autoCore = getAutoCore(ext);
                if (autoCore) setSelectedCore(autoCore);
            }
        }
    };

    const handleBiosFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBiosFile(file);
        }
    };

    const handlePatchFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPatchFile(file);
        }
    };

    const handleDrop = e => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleDropAreaEvents = dropArea => {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event =>
            dropArea.addEventListener(event, preventDefaults, false)
        );
        ['dragenter', 'dragover'].forEach(event =>
            dropArea.addEventListener(event, () => toggleHighlight(true, dropArea), false)
        );
        ['dragleave', 'drop'].forEach(event =>
            dropArea.addEventListener(event, () => toggleHighlight(false, dropArea), false)
        );
        dropArea.addEventListener('drop', handleDrop, false);
    };

    useEffect(() => {
        if (!mounted) return;
        const dropArea = document.getElementById('drop-area');
        const fileInput = document.getElementById('file-upload');
        handleDropAreaEvents(dropArea);
        fileInput.addEventListener('change', e => handleFiles(e.target.files));

        return () => {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event =>
                dropArea.removeEventListener(event, preventDefaults, false)
            );
            ['dragenter', 'dragover'].forEach(event =>
                dropArea.removeEventListener(event, () => toggleHighlight(true, dropArea), false)
            );
            ['dragleave', 'drop'].forEach(event =>
                dropArea.removeEventListener(event, () => toggleHighlight(false, dropArea), false)
            );
            dropArea.removeEventListener('drop', handleDrop, false);
        };
    }, [mounted]);

    const [isLoading, setIsLoading] = useState(false);

    const handleStartClick = async () => {
        setIsLoading(true);
        setProgress(0);

        const requestFullscreen = () => {
            const docElm = document.documentElement;
            const fullscreenMethods = [
                'requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen'
            ];

            for (const method of fullscreenMethods) {
                if (docElm[method]) {
                    docElm[method]();
                    break;
                }
            }
        };

        const trackProgress = async (url) => {
            const proxyUrl = `https://proxy-cloudflare-server.revanspstudy28.workers.dev/api/proxy?url=${encodeURIComponent(url)}`;

            try {
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error("Failed to fetch URL via proxy.");

                const contentLength = response.headers.get('Content-Length');
                if (!contentLength) throw new Error("Failed to retrieve content length.");

                const totalBytes = parseInt(contentLength, 10);
                const reader = response.body.getReader();
                let receivedBytes = 0;

                const stream = new ReadableStream({
                    start(controller) {
                        const push = () => {
                            reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                receivedBytes += value.length;
                                setProgress(Math.floor((receivedBytes / totalBytes) * 100));
                                controller.enqueue(value);
                                push();
                            }).catch(err => {
                                console.error("Error reading stream:", err);
                                controller.error(err);
                            });
                        };
                        push();
                    }
                });

                const newBlob = await new Response(stream).blob();
                return URL.createObjectURL(newBlob);

            } catch (error) {
                console.error("Error fetching URL:", error);
                alert("An error occurred while fetching the URL.");
                setIsLoading(false);
                return null;
            }
        };

        let fileURL = selectedFile ? URL.createObjectURL(selectedFile) : selectedUrl;

        if (selectedUrl) {
            fileURL = await trackProgress(selectedUrl);
            if (!fileURL) {
                setIsLoading(false);
                return;
            }
        }

        const biosURL = biosFile ? URL.createObjectURL(biosFile) : '';
        const patchURL = patchFile ? URL.createObjectURL(patchFile) : '';

        router.push({
            pathname: '/game',
            query: {
                fileURL,
                version: selectedVersion,
                core: selectedCore,
                language: selectedLanguage,
                biosURL,
                patchURL
            },
        });

        requestFullscreen();
    };

    const isStartButtonDisabled = !(selectedVersion && selectedLanguage && selectedCore && (selectedFile || selectedUrl));

    return (
        <>
            <div className="card rounded-lg bg-blue-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] w-full relative" >
                <div className="absolute inset-0 z-0 translate-y-3 bg-cover bg-center opacity-25 grayscale bg-[url('/easter-egg/mikus1.avif')]">
                </div>
                <div className="card-body p-6 relative">
                    <div className="rounded-lg shadow-lg w-full max-w-2xl">
                        <div id="drop-area" className="border-4 border-dashed border-black/50 bg-white/30 backdrop-blur-md rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ease-in-out hover:border-blue-500 hover:bg-blue-50/50">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center h-full">
                                <BsCloudUpload id="default-icon" className="text-6xl text-black" />
                                <BsFileEarmark id="file-icon" className="text-6xl text-blue-500 hidden" />
                                <p id="file-name" className="mt-4 text-lg font-semibold text-gray-700">
                                    Drag and drop your ROM here or click to select
                                </p>
                            </label>
                        </div>
                    </div>
                    <div className="divider text-black">OR</div>
                    <div className="flex items-center space-x-4 w-full">
                        <label className="form-control w-full flex-1">
                            <div className="label">
                                <span className="label-text text-black">ROM URL</span>
                                <span className="label-text-alt text-black">*ZIP</span>
                            </div>
                            <input
                                type="url"
                                placeholder="URL/LINK ROM (ZIP) ...."
                                value={selectedUrl}
                                onChange={(e) => setSelectedUrl(e.target.value)}
                                className="input input-bordered w-full input-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black"
                            />
                        </label>
                        <button
                            data-tip="Recommended: Upload your file directly instead of using a link."
                            className="tooltip bg-red-600 mt-9 rounded btn-sm btn-square hover:border-black border-2 border-black hover:bg-yellow-400 tooltip-left shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] before:w-[10rem] before:content-[attr(data-tip)]"
                        >
                            <BsInfoLg className="ml-2" />
                        </button>
                    </div>
                    <div className="flex space-x-2.5">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text text-black">BIOS</span>
                                <span className="label-text-alt text-black">*OPTIONAL</span>
                            </div>
                            <input
                                type="file"
                                className="file-input file-input-sm file-input-bordered w-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-1 bg-white text-black"
                                onChange={handleBiosFile}
                            />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text text-black">PATCH</span>
                                <span className="label-text-alt text-black">*OPTIONAL</span>
                            </div>
                            <input
                                type="file"
                                className="file-input file-input-sm file-input-bordered w-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-1 bg-white text-black"
                                onChange={handlePatchFile}
                            />
                        </label>
                    </div>
                    <select
                        className="select select-bordered w-full select-sm uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-0.5 bg-white text-black"
                        value={selectedVersion}
                        onChange={handleChange(setSelectedVersion)}
                    >
                        <option value="" disabled>EMULATOR VERSIONS</option>
                        {versions && versions.length > 0 ? (
                            versions.map((ver) => (
                                <option key={ver.version} value={ver.version}>{ver.version}</option>
                            ))
                        ) : (
                            <option disabled>LOADING...</option>
                        )}
                    </select>
                    <div className="flex space-x-2.5">
                        <select
                            className="select select-bordered w-full select-sm uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-0.5 bg-white text-black"
                            value={selectedLanguage}
                            onChange={handleChange(setSelectedLanguage)}
                        >
                            <option value="" disabled>LANGUAGES</option>
                            {languages && languages.length > 0 ? (
                                languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))
                            ) : (
                                <option disabled>LOADING...</option>
                            )}
                        </select>
                        <select
                            className="select select-bordered w-full select-sm uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-0.5 bg-white text-black"
                            value={selectedCore}
                            onChange={handleChange(setSelectedCore)}
                        >
                            <option value="" disabled>CORES</option>
                            {cores && cores.length > 0 ? (
                                cores.map((coreData, index) => (
                                    <option key={index} value={coreData.system}>
                                        {coreData.system} ({coreData.core})
                                    </option>
                                ))
                            ) : (
                                <option disabled>LOADING...</option>
                            )}
                        </select>
                    </div>
                    <button
                        disabled={isStartButtonDisabled || isLoading}
                        onClick={handleStartClick}
                        className="bg-yellow-400 hover:bg-red-600 text-black border-2 border-black w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-2 btn-md text-lg btn hover:border-black"
                    >
                        {isLoading ? (
                            <div>
                                <span className="loading loading-spinner loading-xs"></span>&nbsp;&nbsp;{progress}%
                            </div>
                        ) : (
                            <><BsPlayFill />&nbsp;&nbsp;START
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default CustomROM;