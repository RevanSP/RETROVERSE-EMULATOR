import Link from "next/link";
import Layout from '../layout/Layout';
import { systems } from "@/data/system";
import { useRouter } from 'next/router';
import Gamepad from '@/components/Gamepad';
import { db, collection, query, where, getDocs } from '@/lib/firebase';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { BsArrowClockwise, BsCheckCircle, BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight, BsController, BsGear, BsHouseDoor, BsInfoCircle, BsJoystick, BsPlayFill, BsXCircle } from "react-icons/bs";
import Head from "next/head";
import { FullscreenModal } from "@/components/FullscreenModal";

const SystemPage = ({ games }) => {
    const router = useRouter();
    const { system } = router.query;

    const currentSystem = systems.find(s => s.system === system);

    const [isControllerConnected, setIsControllerConnected] = useState(false);

    const [mounted, setMounted] = useState(false);
    const [versions, setVersions] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");

    const handleChange = setter => e => setter(e.target.value);

    useEffect(() => {
        const fetchData = async () => {
            const endpoints = ['emu-version', 'languages'];
            const baseUrl = '/api';

            const fetchJSON = async (endpoint) => {
                const res = await fetch(`${baseUrl}/${endpoint}`, {
                    headers: {
                        Authorization: process.env.NEXT_PUBLIC_API_TOKEN,
                    },
                });
                return res.json();
            };

            try {
                const [versionsData, languagesData] = await Promise.all(endpoints.map(fetchJSON));
                setVersions(Array.isArray(versionsData) ? versionsData : []);
                setLanguages(languagesData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (!mounted) {
            setMounted(true);
            fetchData();
        }
    }, [mounted]);

    const [selectedGame, setSelectedGame] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const [noGamesInSystem, setNoGamesInSystem] = useState(false);
    const dialogRef = useRef(null);

    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        setNoResults(filteredGames.length === 0 && searchQuery !== '');
        setNoGamesInSystem(games.length === 0);
    }, [searchQuery, filteredGames, games]);

    const handleOpenModal = (game) => {
        setSelectedGame(game);
        dialogRef.current.showModal();
    };

    const handleCloseModal = () => {
        dialogRef.current.querySelector('iframe').src = '';
        setSelectedGame(null);
        setSelectedLanguage('');
        setSelectedVersion('');
        dialogRef.current.close();
    };

    const handleSubmit = () => {
        if (selectedGame && selectedVersion && selectedLanguage) {
            router.push({
                pathname: '/game',
                query: { fileURL: selectedGame.gameLink, version: selectedVersion, core: system, language: selectedLanguage }
            });
        } else {
            console.log('Please make sure all fields are selected');
        }
    };

    const handleRefresh = () => window.location.reload();

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage, setGamesPerPage] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const [isClient, setIsClient] = useState(false);

    const paginatedGames = filteredGames.slice(
        (currentPage - 1) * gamesPerPage,
        currentPage * gamesPerPage
    );

    useEffect(() => {
        setTotalPages(Math.ceil(filteredGames.length / gamesPerPage));
    }, [filteredGames, gamesPerPage]);

    useEffect(() => {
        if (typeof window !== 'undefined') setIsClient(true);
    }, []);

    useEffect(() => {
        const handleResize = () => setGamesPerPage(window.innerWidth >= 1024 ? 16 : 8);
        if (isClient) handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isClient]);

    const handlePageChange = (page) => page >= 1 && page <= totalPages && setCurrentPage(page);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    const getPaginationButtons = () => {
        if (!isClient) return [];
        const buttonCount = window.innerWidth >= 1024 ? 25 : 5;
        const start = Math.max(1, currentPage - Math.floor(buttonCount / 2));
        const end = Math.min(totalPages, start + buttonCount - 1);
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    };

    const paginationButtons = getPaginationButtons();

    return (
        <>
            <Head>
                <title>EMULATOR - RETROVERSE</title>
                <meta name="description" content="Explore the Retroverse emulator. Download BIOS files and play your favorite retro games on modern devices with full compatibility and smooth performance." />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="RETROVERSE - EMULATOR" />
                <meta property="og:description" content="Discover the Retroverse emulator and download BIOS files to play retro games. Compatible with various classic gaming systems for the best retro gaming experience." />
                <meta property="og:image" content="https://retroverse-emulator.vercel.app/assets/favicon.png" />
                <meta property="og:url" content="https://retroverse-emulator.vercel.app/" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="language" content="en" />
                <meta name="author" content="Rxvxn" />
                <link rel="canonical" href="https://retroverse-emulator.vercel.app/emulator" />
            </Head>
            <Layout>
                <dialog id="detail-games" ref={dialogRef} className="modal">
                    <div className="modal-box rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-yellow-400">
                        <form method="dialog">
                            <button
                                type="button"
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black"
                                onClick={handleCloseModal}
                            >
                                ✕
                            </button>
                        </form>
                        <h3 className="font-bold text-lg mb-4 text-black">DETAIL GAMES</h3>
                        <div className="flex flex-col gap-4">
                            {selectedGame && (
                                <>
                                    <div className="w-full p-2.5 bg-red-600 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="relative w-full h-0 pb-[56.25%]">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full rounded-lg border-none"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                src={selectedGame.iframeLink}
                                            ></iframe>
                                        </div>
                                    </div>
                                    <div className="w-full p-2.5 bg-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex gap-4">
                                        <div className="w-1/3 flex-shrink-0">
                                            <div className="relative w-full rounded-lg overflow-hidden">
                                                <div className="w-full bg-blue-500 p-1.5 rounded-lg border-2 border-black">
                                                    <Image unoptimized
                                                        width={0}
                                                        height={0}
                                                        sizes="100vw"
                                                        alt="Game Cover"
                                                        className="w-full h-full object-cover rounded-md border-2 border-black"
                                                        src={selectedGame.cover}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-2/3 overflow-hidden">
                                            <p className="text-black font-bold text-md truncate">{selectedGame.title}</p>
                                            <p className="text-black font-bold text-sm truncate">{selectedGame.publisher}</p>
                                            <p className="text-black text-xs h-[70px] sm:h-[100px] overflow-y-auto mt-1.5">
                                                {selectedGame.description}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="w-full bg-white p-3 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="join w-full">
                                    <select
                                        className="select select-xs select-bordered w-full select-sm uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-red-600 text-black"
                                        value={selectedLanguage}
                                        onChange={handleChange(setSelectedLanguage)}
                                    >
                                        <option value="" disabled>LANGUAGES</option>
                                        {languages?.length > 0 ? (
                                            languages.map((lang) => (
                                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                                            ))
                                        ) : (
                                            <option disabled>LOADING...</option>
                                        )}
                                    </select>
                                    <select
                                        className="select select-xs select-bordered w-full select-sm uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 text-black"
                                        value={selectedVersion}
                                        onChange={handleChange(setSelectedVersion)}
                                    >
                                        <option value="" disabled>EMULATOR VERSIONS</option>
                                        {versions?.length > 0 ? (
                                            versions.map((ver) => (
                                                <option key={ver.version} value={ver.version}>{ver.version}</option>
                                            ))
                                        ) : (
                                            <option disabled>LOADING...</option>
                                        )}
                                    </select>
                                    <button
                                        className="btn join-item border-2 border-black bg-blue-500 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] btn-xs text-black"
                                        onClick={handleSubmit}
                                        disabled={!selectedVersion || !selectedLanguage}
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </dialog>
                <FullscreenModal title="CONTROLLER TEST" id="controller">
                    <div className="my-4">
                        <Gamepad setControllerStatus={setIsControllerConnected} />
                    </div>
                </FullscreenModal>
                <section className="py-8 mt-14">
                    <div className="mx-auto px-6">
                        <div className="px-4 py-0.5 border-2 border-black bg-yellow-400 rounded text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                            <div className="breadcrumbs text-sm">
                                <ul>
                                    <li>
                                        <Link href="/">
                                            <BsHouseDoor />&nbsp;
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/emulator">
                                            <BsJoystick />&nbsp;
                                            Emulator
                                        </Link>
                                    </li>
                                    <li>
                                        <BsGear />&nbsp;&nbsp;
                                        {currentSystem?.alias || 'Loading...'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="p-3 border-2 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-r from-red-600 via-yellow-400 to-blue-500">
                            <div className="join w-full">
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="bg-base-300 input-sm text-xs input w-full input-bordered join-item border-2 border-black rounded text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        placeholder={`Games (${filteredGames.length}) ...`} />
                                </div>
                                <button
                                    onClick={handleRefresh}
                                    className="btn btn-sm text-xs join-item border-2 border-black bg-red-600 rounded text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 hover:border-black btn-square"
                                >
                                    <BsArrowClockwise />
                                </button>
                                <button onClick={() => document.getElementById('controller').showModal()} className="btn btn-sm text-xs join-item border-2 border-black bg-blue-500 rounded text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:border-black btn-square">
                                    <BsController />
                                </button>
                                <button
                                    className="btn btn-sm text-xs join-item border-2 border-black bg-yellow-400 rounded text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 hover:border-black btn-square tooltip tooltip-left"
                                    data-tip={isControllerConnected ? "CONTROLLER CONNECTED" : "CONTROLLER DISCONNECTED"}
                                >
                                    {isControllerConnected ? <BsCheckCircle className="ml-2" /> : <BsXCircle className="ml-2" />}
                                </button>
                            </div>
                        </div>

                        {noResults && (
                            <div role="alert" className="alert bg-yellow-400 border-2 text-black border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-4">
                                <BsInfoCircle className="text-xl" />
                                <span className="text-xs">No games found matching your search.</span>
                            </div>
                        )}

                        {noGamesInSystem && !searchQuery && (
                            <div role="alert" className="alert bg-yellow-400 border-2 text-black border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-4">
                                <BsInfoCircle className="text-xl" />
                                <span className="text-xs">No games available in this system.</span>
                            </div>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-6 mt-6">
                            {paginatedGames.map((game) => (
                                <div key={game.title} className="card rounded-lg bg-blue-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="card-body p-3">
                                        <div className="relative w-full">
                                            <Image unoptimized
                                                src={game.cover}
                                                alt={game.title}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="w-full h-full object-cover rounded-md border-2 border-black"
                                            />
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"
                                                style={{
                                                    backgroundSize: "200% 100%",
                                                    animation: "shimmer 3.5s infinite",
                                                }}
                                            ></div>
                                        </div>
                                        <button
                                            onClick={() => handleOpenModal(game)}
                                            className="btn bg-yellow-400 border-2 border-black rounded text-black hover:bg-red-600 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] btn-sm flex-1 hover:border-black"
                                        >
                                            <BsPlayFill />&nbsp;PLAY
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredGames.length > 0 && (
                            <div className="join mt-8 flex justify-center gap-2">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black disabled:opacity-50"
                                    disabled={currentPage === 1}
                                >
                                    <BsChevronDoubleLeft />
                                </button>
                                <button
                                    onClick={handlePrevPage}
                                    className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black disabled:opacity-50"
                                    disabled={currentPage === 1}
                                >
                                    <BsChevronLeft />
                                </button>

                                {paginationButtons.map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`join-item btn btn-xs btn-square border-2 border-black ${page === currentPage
                                            ? "btn-active text-black"
                                            : "bg-yellow-400 hover:bg-red-600 text-black"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNextPage}
                                    className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                >
                                    <BsChevronRight />
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                >
                                    <BsChevronDoubleRight />
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default SystemPage;

export async function getStaticPaths() {
    return {
        paths: systems.map(system => ({ params: { system: system.system } })),
        fallback: 'blocking',
    };
}

export async function getStaticProps({ params }) {
    const querySnapshot = await getDocs(query(collection(db, "games"), where("core", "==", params.system)));

    const games = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    games.sort((a, b) => {
        const aMatch = a.title.match(/\d+/);
        const bMatch = b.title.match(/\d+/);

        if (aMatch && bMatch) {
            const aNum = parseInt(aMatch[0]);
            const bNum = parseInt(bMatch[0]);
            if (aNum !== bNum) {
                return aNum - bNum;
            }
        }

        return a.title.localeCompare(b.title);
    });

    return {
        props: {
            games,
        },
        revalidate: 43200,
    };
}