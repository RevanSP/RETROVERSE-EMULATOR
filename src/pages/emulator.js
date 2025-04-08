import Layout from "./layout/Layout";
import Link from "next/link";
import { systems } from "@/data/system";
import { useState, useEffect } from "react";
import { initializeAOS } from "@/utils/AOS";
import CustomROM from "@/components/CustomROM";
import Head from "next/head";

const EmulatorPage = () => {
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

  const colorVariants = [
    "bg-gradient-to-br from-red-600 to-blue-500 via-yellow-400",
    "bg-gradient-to-tr from-red-600 to-blue-500 via-yellow-400",
    "bg-gradient-to-r from-red-600 via-yellow-400 to-blue-500",
    "bg-gradient-to-l from-red-600 via-yellow-400 to-blue-500",
    "bg-gradient-to-br from-red-600 to-blue-500 via-yellow-400",
    "bg-gradient-to-tr from-red-600 to-blue-500 via-yellow-400",
    "bg-gradient-to-r from-red-600 via-yellow-400 to-blue-500",
    "bg-gradient-to-l from-red-600 via-yellow-400 to-blue-500",
  ];

  const getDefaultBackground = () =>
    "linear-gradient(135deg, #ef4444 0%, #3b82f6 50%, #fbbf24 100%)";

  const isImportRomVisible = searchQuery === "";

  const [loadingSystem, setLoadingSystem] = useState(null);

  const handleLinkClick = (system) => {
    setLoadingSystem(system);
  };

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
        <dialog id="custom-rom" className="modal">
          <div className="modal-box bg-yellow-400 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black text-black">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">CUSTOM ROM</h3>
            <CustomROM />
          </div>
        </dialog>
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
                    <Link href="/emulator">
                      <i className="bi bi-joystick"></i>&nbsp;
                      Emulator
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="py-3 px-4 bg-red-600 border-2 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <label className="bg-base-300 input input-sm input-bordered flex items-center gap-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <input
                  type="text"
                  className="grow"
                  placeholder={`Search Console (${filteredSystems.length}) ...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="bi bi-search"></i>
              </label>
            </div>
            {noResults && (
              <div role="alert" className="alert bg-blue-500 border-2 text-black border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <i className="bi bi-info-circle text-xl"></i>
                <span className="text-xs">No systems found matching your search.</span>
              </div>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-7 gap-3" style={{ gridAutoRows: "minmax(145px, auto)" }}>
              {sortedSystems.map(({ system, alias, image }, index) => (
                <div
                  data-aos="fade-up"
                  key={system}
                  className={`card rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col ${colorVariants[index % colorVariants.length]}`}
                >
                  <Link href={`/emulator/${system}`} className="absolute inset-0 z-10" onClick={() => handleLinkClick(system)}>
                    <div className="card-body relative z-10 flex justify-center items-center h-full">
                      <div
                        className={`absolute inset-0 bg-cover bg-center opacity-20 filter grayscale transition-opacity duration-300 ${imagesLoaded[image]}`}
                        style={{
                          backgroundImage: image ? `url(/characters/${image})` : getDefaultBackground(),
                          backgroundPosition: "center top 10%",
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
              {isImportRomVisible && (
                <div
                  data-aos="fade-up"
                  className={`card rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col ${colorVariants[sortedSystems.length % colorVariants.length]} cursor-pointer`}
                  onClick={() => document.getElementById('custom-rom').showModal()}
                >
                  <div className="card-body relative z-10 flex justify-center items-center h-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30 filter grayscale"
                      style={{ backgroundImage: 'url(/easter-egg/sonic-miku.avif)', backgroundPosition: "center top 10%" }}
                    ></div>
                    <div className="flex flex-col items-center z-50">
                      <span className="text-center font-extrabold lg:text-lg text-xs text-black">IMPORT ROM (CUSTOM)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default EmulatorPage;