import React from 'react';
import Link from "next/link";
import { systems } from "@/data/system";
import { db, doc, getDoc } from '@/lib/firebase';
import Layout from '../layout/Layout';
import { useState, useEffect } from 'react';
import { BsCheckCircle, BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight, BsFileEarmarkArrowDown, BsFileEarmarkZip, BsHouseDoor, BsJoystick, BsSearch, BsShare } from 'react-icons/bs';
import Head from 'next/head';

const SystemPage = ({ systemData, games, totalGames }) => {
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [downloadingIndex, setDownloadingIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDesktop, setIsDesktop] = useState(false);

    const itemsPerPage = 25;
    const totalPages = Math.ceil(totalGames / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleAction = (url, index, actionType) => {
        if (actionType === 'copy') {
            navigator.clipboard.writeText(url).then(() => {
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 3000);
            }).catch((err) => {
                console.error("Failed to copy: ", err);
            });
        } else if (actionType === 'download') {
            setDownloadingIndex(index);
            const link = document.createElement('a');
            link.href = url;
            link.download = url.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => setDownloadingIndex(null), 3000);
        }
    };

    const filteredGames = games.filter(game =>
        game.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const systemInfo = systemData ? systems.find(system => system.system === systemData?.system) : null;

    const currentPageGames = filteredGames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderTableBody = () => currentPageGames.length === 0 ? (
        <tr><td colSpan="3" className="text-center py-4 text-black">No games available for this system yet</td></tr>
    ) : currentPageGames.map((game, index) => (
        <tr key={index}>
            <td className="truncate">{game.title || game.name}</td>
            <td className="truncate space-x-2">
                <div className="join">
                    <button
                        className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-yellow-400 hover:bg-red-600 hover:border-black text-black btn-square"
                        onClick={() => handleAction(game.downloadUrl, index, 'copy')}
                    >
                        {copiedIndex === index ? (
                            <BsCheckCircle />
                        ) : (
                            <BsShare />
                        )}
                    </button>
                    <button
                        className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-red-600 hover:bg-yellow-400 hover:border-black text-black btn-square"
                        onClick={() => handleAction(game.downloadUrl, index, 'download')}
                    >
                        {downloadingIndex === index ? (
                            <BsCheckCircle />
                        ) : (
                            <BsFileEarmarkArrowDown />
                        )}
                    </button>
                </div>
            </td>
        </tr>
    ));

    const renderPageButtons = () => {
        const pageRangeStart = Math.floor((currentPage - 1) / (isDesktop ? 25 : 5)) * (isDesktop ? 25 : 5) + 1;
        const pageRangeEnd = Math.min(pageRangeStart + (isDesktop ? 24 : 4), totalPages);

        const pageNumbers = [];
        for (let i = pageRangeStart; i <= pageRangeEnd; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers.map(pageNumber => (
            <button
                key={pageNumber}
                className={`join-item btn btn-xs btn-square ${currentPage === pageNumber ? 'btn-active' : 'bg-yellow-400 hover:bg-red-600'} border-2 border-black text-black`}
                onClick={() => setCurrentPage(pageNumber)}
                disabled={!!searchQuery}
            >
                {pageNumber}
            </button>
        ));
    };

    const isNoGames = filteredGames.length === 0;

    return (
        <>
            <Head>
                <title>ROM - RETROVERSE</title>
                <meta name="description" content="Download and manage ROM files for the Retroverse emulator. Play your favorite retro games with ease using the best ROMs for classic gaming systems." />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="RETROVERSE - ROMs for Classic Games" />
                <meta property="og:description" content="Discover and download ROM files for Retroverse. Emulate your favorite retro games from classic systems and enjoy seamless gameplay." />
                <meta property="og:image" content="https://retroverse-emulator.vercel.app/assets/favicon.png" />
                <meta property="og:url" content="https://retroverse-emulator.vercel.app/rom" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="language" content="en" />
                <meta name="author" content="Rxvxn" />
                <link rel="canonical" href="https://retroverse-emulator.vercel.app/rom" />
            </Head>
            <Layout>
                <section className="py-8 mt-14">
                    <div className="mx-auto px-6">
                        <div className="px-4 py-0.5 border-2 border-black bg-yellow-400 rounded text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                            <div className="breadcrumbs text-sm">
                                <ul>
                                    <li>
                                        <Link href="/">
                                            <BsHouseDoor />
                                            &nbsp;
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/rom">
                                            <BsFileEarmarkZip />&nbsp;
                                            ROM
                                        </Link>
                                    </li>
                                    <li><BsJoystick />&nbsp;&nbsp;{systemData.alias}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="py-3 px-4 bg-blue-500 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="join w-full">
                                    <label className="rounded join-item input input-bordered flex items-center gap-2 input-sm border-2 border-black bg-base-300 w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                        <input
                                            type="text"
                                            className="grow"
                                            placeholder={`Search ROM ... (${totalGames} Games)`}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <BsSearch />
                                    </label>
                                    {systemInfo && systemInfo.cores && systemInfo.cores.length > 0 && (
                                        <button
                                            className="btn btn-sm text-black join-item rounded tooltip tooltip-left border-2 border-black hover:bg-yellow-400 hover:border-black bg-red-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                            data-tip={systemInfo.cores.join(', ')}
                                        >
                                            CORE
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table table-xs">
                                    <thead className="text-black">
                                        <tr>
                                            <th className="truncate">TITLE GAMES</th>
                                            <th className="truncate">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-black">
                                        {renderTableBody()}
                                    </tbody>
                                    <tfoot className="text-black">
                                        <tr>
                                            <th className="truncate">TITLE GAMES</th>
                                            <th className="truncate">ACTION</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="join mt-4 flex justify-center gap-2">
                                <button
                                    className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={isNoGames || currentPage === 1 || !!searchQuery}
                                >
                                    <BsChevronDoubleLeft />
                                </button>
                                <button
                                    className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={isNoGames || currentPage === 1 || !!searchQuery}
                                >
                                    <BsChevronLeft />
                                </button>
                                {renderPageButtons()}
                                <button
                                    className="join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black hover:bg-red-600 hover:border-black"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={isNoGames || currentPage === totalPages || !!searchQuery}
                                >
                                    <BsChevronRight />
                                </button>
                                <button
                                    className="join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black hover:bg-yellow-400 hover:border-black"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={isNoGames || currentPage === totalPages || !!searchQuery}
                                >
                                    <BsChevronDoubleRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export async function getStaticPaths() {
    console.log('Generating static paths...');
    const paths = systems.map(system => ({ params: { system: system.system } }));
    console.log('Generated paths:', paths);
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    console.log('Fetching data for system:', params.system);

    const systemData = systems.find(item => item.system === params.system);
    console.log('System data found:', systemData);

    if (!systemData) {
        console.log(`System ${params.system} not found in the systems list.`);
        return { notFound: true };
    }

    try {
        console.log(`Fetching data from Firestore for system: ${params.system} (Firestore Doc ID: ${systemData.firestoreDocId})`);
        const docSnap = await getDoc(doc(db, "json_files", systemData.firestoreDocId));

        const games = docSnap.exists()
            ? JSON.parse(atob(docSnap.data().fileBase64))
            : [];

        console.log(`Fetched ${games.length} games for system: ${params.system}`);

        return {
            props: {
                systemData,
                games,
                totalGames: games.length,
            },
        };
    } catch (error) {
        console.error(`Error fetching games for ${params.system}:`, error);
        return {
            props: { systemData, games: [], totalGames: 0 },
            revalidate: 3600,
        };
    }
}

export default SystemPage;