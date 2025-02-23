import Head from "next/head";
import Layout from "./layout/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";

const BIOSPage = ({ bios }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [pagesToShow, setPagesToShow] = useState(5);

    useEffect(() => {
        const handleResize = () => setPagesToShow(window.innerWidth >= 1024 ? 25 : 5);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredBios = bios.filter(bio => bio.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filteredBios.length / itemsPerPage);

    const paginateGames = () => filteredBios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    const handleFirstPage = () => setCurrentPage(1);
    const handlePreviousPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    const handleNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    const handleLastPage = () => setCurrentPage(totalPages);

    const displayedPages = [];
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) startPage = Math.max(1, endPage - pagesToShow + 1);

    for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

    const isSearchActive = searchTerm !== '';

    return (
        <>
            <Head>
                <title>BIOS - RETROVERSE</title>
                <meta name="description" content="Download BIOS for the Retroverse emulator, run retro games on your device with the correct emulator BIOS." />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="RETROVERSE - EMULATOR" />
                <meta property="og:description" content="Find and download BIOS for the Retroverse Emulator to play retro games. Supports various classic gaming systems." />
                <meta property="og:image" content="https://retroverse-emulator.vercel.app/assets/favicon.png" />
                <meta property="og:url" content="https://retroverse-emulator.vercel.app/" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="language" content="en" />
                <meta name="author" content="Rxvxn" />
                <link rel="canonical" href="https://retroverse-emulator.vercel.app/bios" />
            </Head>
            <Layout>
                <section className="py-8 mt-14">
                    <div className="mx-auto px-6">
                        <div className="px-4 py-0.5 border-2 border-black bg-yellow-400 rounded text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                            <div className="breadcrumbs text-sm">
                                <ul>
                                    <li>
                                        <Link href="/">
                                            <i className="bi bi-house-door"></i>&nbsp;
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/bios">
                                            <i className="bi bi-nut"></i>&nbsp;
                                            BIOS
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="py-3 px-4 bg-blue-500 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-2 mb-3">
                                <label className="input input-bordered flex items-center gap-2 input-sm border-2 border-black bg-base-300 w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded">
                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder={`Search BIOS (${filteredBios.length})...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <i className="bi bi-search"></i>
                                </label>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table table-xs">
                                    <thead className="text-black">
                                        <tr>
                                            <th className="truncate">CONSOLE</th>
                                            <th className="truncate">SIZE</th>
                                            <th className="truncate">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-black">
                                        {paginateGames().length > 0 ? (
                                            paginateGames().map((bio, index) => (
                                                <tr key={index}>
                                                    <td>{bio.title}</td>
                                                    <td>{bio.size}</td>
                                                    <td>
                                                        <a
                                                            href={bio.downloadUrl}
                                                            className="btn join-item btn-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs bg-red-600 hover:bg-yellow-400 hover:border-black text-black btn-square"
                                                        >
                                                            <i className="bi bi-file-earmark-arrow-down"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-3">
                                                    No BIOS found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot className="text-black">
                                        <tr>
                                            <th className="truncate">CONSOLE</th>
                                            <th className="truncate">SIZE</th>
                                            <th className="truncate">ACTION</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="join mt-4 flex justify-center gap-2">
                                <button
                                    className={`join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black ${currentPage === 1 || isSearchActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:border-black'}`}
                                    onClick={handleFirstPage}
                                    disabled={currentPage === 1 || isSearchActive}
                                >
                                    <i className="bi bi-chevron-double-left"></i>
                                </button>
                                <button
                                    className={`join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black ${currentPage === 1 || isSearchActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:border-black'}`}
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1 || isSearchActive}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                {displayedPages.map((page) => (
                                    <button
                                        key={page}
                                        className={`join-item btn btn-xs btn-square border-2 border-black text-black ${currentPage === page ? 'btn-active' : 'bg-yellow-400 hover:bg-red-600'}`}
                                        onClick={() => handlePageChange(page)}
                                        disabled={isSearchActive}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    className={`join-item btn btn-xs btn-square bg-yellow-400 border-2 border-black text-black ${currentPage === totalPages || isSearchActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:border-black'}`}
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages || isSearchActive}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                                <button
                                    className={`join-item btn btn-xs btn-square bg-red-600 border-2 border-black text-black ${currentPage === totalPages || isSearchActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:border-black'}`}
                                    onClick={handleLastPage}
                                    disabled={currentPage === totalPages || isSearchActive}
                                >
                                    <i className="bi bi-chevron-double-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default BIOSPage;

export async function getStaticProps() {
    const apiUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/bios'
        : 'https://retroverse-remake.vercel.app/api/bios';

    const headers = process.env.NODE_ENV === 'production'
        ? { Authorization: process.env.NEXT_PUBLIC_API_TOKEN }
        : {};

    try {
        const res = await fetch(apiUrl, { headers });
        const biosData = await res.json();

        if (!Array.isArray(biosData)) throw new Error('Data yang diterima bukan array');

        return { props: { bios: biosData }, revalidate: 86400 };
    } catch (error) {
        console.error('Error fetching BIOS data:', error);
        return { props: { bios: [] } };
    }
}