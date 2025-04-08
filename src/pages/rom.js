import Layout from "./layout/Layout";
import Link from "next/link";
import { systems } from "@/data/system";
import { useState, useEffect } from "react";
import { initializeAOS } from "@/utils/AOS";
import Head from "next/head";
import { BsFileEarmarkZip, BsHouseDoor, BsInfoCircle, BsSearch } from "react-icons/bs";

const ROMPage = () => {
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSystems, setFilteredSystems] = useState(systems);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        systems.forEach(({ image }) => {
            if (image) {
                const img = new Image();
                img.src = `/characters/${image}`;
                img.onload = () => {
                    setImagesLoaded(prev => ({
                        ...prev,
                        [image]: true
                    }));
                };
            }
        });

        initializeAOS();
    }, []);

    useEffect(() => {
        const filtered = systems.filter(({ alias }) =>
            alias.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSystems(filtered);

        setNoResults(filtered.length === 0);
    }, [searchQuery]);

    const getDefaultBackground = () => {
        return "url(/unused/Infinite.avif)";
    };

    const sortedSystems = filteredSystems.sort((a, b) => {
        const aIsNumber = /^[0-9]/.test(a.alias);
        const bIsNumber = /^[0-9]/.test(b.alias);

        if (aIsNumber && !bIsNumber) {
            return -1;
        }
        if (!aIsNumber && bIsNumber) {
            return 1;
        }

        return a.alias.localeCompare(b.alias);
    });

    const [loadingSystem, setLoadingSystem] = useState(null);

    const handleLinkClick = (system) => {
        setLoadingSystem(system);
    };

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
                                            &nbsp; Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/rom">
                                            <BsFileEarmarkZip/>
                                            &nbsp; ROM
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="py-3 px-4 bg-blue-500 border-2 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                            <label className="bg-base-300 input input-sm input-bordered flex items-center gap-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder={`Search Console (${filteredSystems.length}) ...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <BsSearch/>
                            </label>
                        </div>
                        {noResults && (
                            <div role="alert" className="alert bg-red-600 border-2 text-black border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <BsInfoCircle />
                                <span className="text-xs">No systems found matching your search.</span>
                            </div>
                        )}
                        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-7 gap-3" style={{ gridAutoRows: 'minmax(145px, auto)' }}>
                            {sortedSystems.map(({ system, alias, image }) => (
                                <div
                                    data-aos="fade-up"
                                    key={system}
                                    className="card rounded-lg bg-red-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col"
                                >
                                    <Link href={`/rom/${system}`} className="absolute inset-0 z-10" onClick={() => handleLinkClick(system)}>
                                        <div className="card-body relative z-10 flex justify-center items-center h-full">
                                            <div
                                                className={`absolute inset-0 bg-cover bg-center opacity-20 filter grayscale transition-opacity duration-300 ${imagesLoaded[image]}`}
                                                style={{
                                                    backgroundImage: image ? `url(/characters/${image})` : getDefaultBackground(),
                                                    backgroundPosition: 'center top 10%',
                                                }}
                                            ></div>
                                            <div className="flex flex-col items-center text-black z-50">
                                                <h1 className="text-center font-extrabold lg:text-lg text-xs">
                                                    {loadingSystem === system ? (
                                                        <span className="loading loading-spinner loading-xl"></span>
                                                    ) : (
                                                        alias
                                                    )}
                                                </h1>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default ROMPage;