/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from "next/image";
import { BsBell, BsBrightnessHigh, BsCheckCircle, BsEnvelope, BsFacebook, BsFileEarmarkZip, BsGithub, BsHouseDoor, BsInfoCircle, BsInstagram, BsJoystick, BsKey, BsMoonStars, BsNut, BsPersonCheck, BsPersonLock, BsSdCard } from 'react-icons/bs';

const data = {
  contributors: [
    {
      avatar: "/avatar/Miku.avif",
      name: "Hatsune Miku",
      roleBadge: "FRONT-END DEVELOPER"
    },
    {
      avatar: "/avatar/Metal_Sonic.avif",
      name: "Reiivan",
      roleBadge: "BACK-END DEVELOPER"
    },
    {
      avatar: "/avatar/Tails.avif",
      name: "Upsside Down Cake",
      roleBadge: "DEV OPS"
    },
    {
      avatar: "/avatar/Blaze.avif",
      name: "Lavender",
      roleBadge: "DATA ANALYST"
    },
    {
      avatar: "/avatar/Silver.avif",
      name: "Leiivan",
      roleBadge: "QA ENGINEER"
    },
    {
      avatar: "/avatar/Wave.avif",
      name: "Reiica",
      roleBadge: "SOFTWARE ARCHITECT"
    },
    {
      avatar: "/avatar/Tikal.avif",
      name: "Reiisa",
      roleBadge: "UX DESIGN"
    }
  ],
  earlyAccessUsers: [
    { avatar: "/avatar/Sonic.avif", name: "Sonic" },
    { avatar: "/avatar/Knuckles.avif", name: "Knuckles" },
    { avatar: "/avatar/Amy.avif", name: "Amy" },
    { avatar: "/avatar/Jet.avif", name: "Jet" },
    { avatar: "/avatar/Storm.avif", name: "Storm" },
    { avatar: "/avatar/Egg.avif", name: "Egg" },
    { avatar: "/avatar/Cream.avif", name: "Cream" },
    { avatar: "/avatar/Shadow.avif", name: "Shadow" },
    { avatar: "/avatar/NiGHTS.avif", name: "NiGHTS" },
    { avatar: "/avatar/AiAi.avif", name: "Aiai" },
    { avatar: "/avatar/Ulala.avif", name: "Ulala" },
    { avatar: "/avatar/e10.avif", name: "e10" },
    { avatar: "/avatar/Chaos.avif", name: "Chaos" },
    { avatar: "/avatar/NMSonic.avif", name: "NMSonic" },
    { avatar: "/avatar/Rouge.avif", name: "Rouge" },
    { avatar: "/avatar/Emerl.avif", name: "Emerl" },
    { avatar: "/avatar/realajrx.avif", name: "realajrx" },
    { avatar: "/avatar/gongon2.avif", name: "gongon2" },
    { avatar: "/avatar/seelkadoom_riders.avif", name: "seelkadoom_riders" },
    { avatar: "/avatar/super_sonic.avif", name: "super_sonic" },
    { avatar: "/avatar/jacklee.avif", name: "jacklee" }
  ]
};

const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedInDeveloper, setIsLoggedInDeveloper] = useState(false);
  const router = useRouter();
  const [theme, setTheme] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "lofi";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});

    setIsLoggedIn(cookies.isLoggedIn === "true");
    setIsLoggedInDeveloper(cookies.isLoggedInDeveloper === "true");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "black" ? "lofi" : "black";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  const isActive = (path) => router.pathname === path;

  const isRomActive = () => {
    return router.pathname === '/rom' || router.pathname.startsWith('/rom/');
  };

  const isEmulatorActive = () => {
    return router.pathname === '/emulator' || router.pathname.startsWith('/emulator/');
  };

  const socialLinks = [
    { icon: BsGithub, href: "https://github.com/RevanSP", label: "Github" },
    { icon: BsInstagram, href: "https://www.instagram.com/m9nokuro/", label: "Instagram" },
    { icon: BsFacebook, href: "https://web.facebook.com/profile.php?id=100082958149027&_rdc=1&_rdr", label: "Facebook" },
  ];

  const isHomePage = router.pathname === "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("LOGIN");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonText(<span className="loading loading-dots loading-xs"></span>);

    setTimeout(() => {
      if (
        email === process.env.NEXT_PUBLIC_EMAILDEV &&
        password === process.env.NEXT_PUBLIC_PASSWORDDEV
      ) {
        document.cookie = "isLoggedInDeveloper=true; path=/; max-age=3600";

        document.cookie = `email=${email}; path=/; max-age=3600`;

        setButtonText("LOGIN");
        setIsLoading(false);

        window.location.href = "/dev/dashboard";
      } else {
        setButtonText("Failed");
        setTimeout(() => {
          setButtonText("LOGIN");
        }, 4500);
        setIsLoading(false);
      }
    }, 1000);
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRedeploy = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/redeploy', { method: 'POST' });
      const data = await res.json();

      setMessage(res.ok ? 'Redeploy successful !' : data.error || 'Something went wrong');
      setIsSuccess(res.ok);

      if (res.ok) setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to trigger redeploy');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "isLoggedInDeveloper=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    setIsLoggedInDeveloper(false);
    router.push('/');
  };

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(choiceResult.outcome === 'accepted' ? 'User accepted the A2HS prompt' : 'User dismissed the A2HS prompt');

        setDeferredPrompt(null);

        const reinstallListener = (e) => {
          e.preventDefault();
          setDeferredPrompt(e);
          window.removeEventListener('beforeinstallprompt', reinstallListener);
        };
        window.addEventListener('beforeinstallprompt', reinstallListener);
      });
    }
  };

  const footerMarginClass = router.pathname === '/dev/dashboard' ? '' : 'mb-16';

  const [itemsPerRow, setItemsPerRow] = useState();
  const [earlyAccessRows, setEarlyAccessRows] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerRow(window.innerWidth >= 1024 ? 7 : 3);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (data?.earlyAccessUsers) {
      const rows = [];
      for (let i = 0; i < data.earlyAccessUsers.length; i += itemsPerRow) {
        rows.push(data.earlyAccessUsers.slice(i, i + itemsPerRow));
      }
      setEarlyAccessRows(rows);
    }
  }, [data?.earlyAccessUsers, itemsPerRow]);

  const earlyAccessUserCount = data?.earlyAccessUsers?.length || 0;
  const displayedCount = earlyAccessUserCount - 3;


  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const images = ["/characters/Miku.avif", "/easter-egg/mikus.avif"]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
        setIsTransitioning(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const [changes, setChanges] = useState([]);
  const [isRedDotVisible, setIsRedDotVisible] = useState(true);

  const fetchChanges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/changes", {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_TOKEN,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setChanges(data);
    } catch (error) {
      console.error("Error fetching changes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    document.getElementById("changes").showModal();
    setIsRedDotVisible(false);
    localStorage.setItem("hasSeenChanges", "true");
  };

  useEffect(() => {
    if (localStorage.getItem("hasSeenChanges") === "true") setIsRedDotVisible(false);
  }, []);

  useEffect(() => {
    if (router.pathname === '/layout/Layout') {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <dialog id="changes" className="modal">
        <div className="modal-box bg-yellow-400 text-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black w-11/12 max-w-full">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">CHANGES</h3>
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-full">
              <span className="text-xl font-bold">LOADING ...</span>
            </div>
          ) : (
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              {changes.map((change, index) => {
                const isEven = index % 2 === 0;
                const isLast = index === changes.length - 1;
                return (
                  <li key={change.version}>
                    <div className="timeline-middle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className={isEven ? "timeline-start mb-10 md:text-end" : "timeline-end md:mb-10"}>
                      <time className="font-mono italic">{change.version}</time>
                      <div className="text-lg font-black">Changes</div>
                      <ul>
                        {change.changes.map((changeText, idx) => (
                          <li className="text-xs" key={idx}>
                            <span className="md:hidden">- </span>
                            {changeText}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {!isLast && <hr />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </dialog>
      <dialog id="redeploy" className="modal">
        <div className="modal-box bg-blue-500 text-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">REDEPLOY</h3>
          <p className="py-4 font-bold">
            Are you sure you want to redeploy the latest changes?
          </p>
          <p className="pb-4">
            By clicking &apos;SUBMIT&apos;, the application will refresh and revalidate the data on the homepage, ensuring the latest content is available without waiting for the automatic revalidation time.
          </p>
          <p className="pb-4">
            NOTE: The homepage content is generated using Static Site Generation (SSG). When you trigger a redeploy, the content will be refreshed immediately, allowing the latest changes to be available without waiting for the regular revalidation period. This process takes approximately 3 minutes. After about 3 minutes, you can refresh the SSG page to see the latest data.
          </p>
          <div className="modal-action">
            <button
              className="btn bg-yellow-400 text-black hover:border-black border-2 border-black  shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 rounded btn-sm"
              onClick={handleRedeploy}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : isSuccess ? (
                <BsCheckCircle />
              ) : (
                'SUBMIT'
              )}
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="contributors" className="modal">
        <div className="modal-box bg-blue-500 text-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black w-11/12 max-w-full">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-6">CONTRIBUTORS</h3>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-4">
            {data.contributors.map((contributor, index) => (
              <div
                key={index}
                className="card bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black p-8 flex items-center"
              >
                <div className="avatar mb-5">
                  <div className="ring-black ring-offset-white bg-gradient-to-r from-red-600 via-yellow-400 to-blue-500 w-24 rounded-full ring ring-offset-2">
                    <Image unoptimized width={0} height={0} sizes="100vw" src={contributor.avatar} alt={contributor.name} />
                  </div>
                </div>
                <span className="badge py-3 rounded-full bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {contributor.name}
                </span>
                <span className="badge text-xs py-2 badge-sm rounded-full bg-black text-white border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-4">
                  {contributor.roleBadge}
                </span>
              </div>
            ))}
            <div className="card bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex items-center justify-center py-8 md:py-0">
              <div className="text-center -mt-2 lg:-mt-4">
                {earlyAccessRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="avatar-group -space-x-3.5 rtl:space-x-reverse mt-3.5">
                    {row.map((user, userIndex) => (
                      <div key={userIndex} className="avatar border-black">
                        <div className="w-20 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600 md:w-9">
                          <Image unoptimized src={user.avatar} alt={user.name} width={0} height={0} sizes="100vw" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <span className="badge text-xs py-2 badge-sm rounded-full bg-black text-white border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-6 md:mt-4">
                  EARLY ACCESS USER
                </span>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      <dialog id="login" className="modal">
        <div className="modal-box bg-base-300 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black relative">
          {images.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 z-[-1] bg-cover bg-center transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-45" : "opacity-0"
                } ${isTransitioning ? "transition-opacity duration-1000" : ""}`}
              style={{
                backgroundImage: `url("${image}")`,
                filter: "grayscale(100%)",
                backgroundPosition: "center 0%",
              }}
            ></div>
          ))}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">LOGIN | DEV ZONE</h3>
          <div className="flex items-center justify-center mb-6 mt-3">
            <Image unoptimized
              src="/brands/retroverse.avif"
              className="w-96 py-12 lg:py-16"
              alt="Logo"
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-200 w-full mb-4">
              <BsEnvelope />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 bg-base-200 w-full mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <BsKey />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="btn bg-yellow-400 hover:bg-base-200 w-full mt-4 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
              disabled={isLoading}
            >
              {buttonText}
            </button>
          </form>
        </div>
      </dialog>
      <div className="flex flex-col min-h-screen">
        <div className="navbar bg-base-100 fixed top-0 left-0 w-full z-50 border-b-4 border-black">
          <div className="navbar-start">
            <button
              className="btn btn-square btn-sm bg-yellow-400 hover:bg-red-600 border-2 border-black rounded text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ml-3 hover:border-black"
              onClick={toggleTheme}
            >
              {theme === "black" ? <BsBrightnessHigh /> : <BsMoonStars />}
            </button>
          </div>
          <div className="navbar-center">
            <a className="btn btn-ghost text-xl"><Image unoptimized src="/brands/retroverse.avif" width={0} height={0} sizes="100vw" alt="Brand" className="w-40" /></a>
          </div>
          <div className="navbar-end">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded bg-red-600 btn-square text-black mr-3 hover:bg-yellow-400 hover:border-black"
              >
                {isLoggedIn || isLoggedInDeveloper ? <BsPersonCheck /> : <BsPersonLock />}
              </div>
              <ul tabIndex={0} className="dropdown-content menu text-black z-[1] w-40 p-2 mr-2 mt-3 bg-blue-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-md">
                {isLoggedIn || isLoggedInDeveloper ? (
                  <>
                    {router.pathname === '/dev/dashboard' ? (
                      <li><Link href="/">HOME</Link></li>
                    ) : (
                      <li><Link href="/dev/dashboard">DASHBOARD</Link></li>
                    )}
                    <li><button onClick={() => document.getElementById('redeploy').showModal()}>REDEPLOY</button></li>
                    <li><button onClick={handleLogout}>LOGOUT</button></li>
                  </>
                ) : (
                  <li>
                    <button onClick={() => document.getElementById('login').showModal()}>LOGIN</button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        {isHomePage && (
          <div className="hero relative mt-16 min-h-screen" style={{ backgroundImage: "url(/assets/herosection.avif)" }}>
            <div className="absolute inset-0 bg-black opacity-70"></div>
            <div className="py-14 hero-content text-neutral-content text-center relative">
              <div className="max-w-md text-center relative mb-40 md:mb-28">
                <Image unoptimized
                  src="/brands/retroverse.avif"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="Brand"
                  className="w-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[300%]"
                />
                <p className="mb-3 text-xl px-4 mt-28 sm:mt-28">
                  At RETROVERSE, we offer a wide range of emulators and games from various platforms. Dive into the world of classic gaming with an extensive library and experience the nostalgia of your favorite retro titles.
                </p>
                <div className="join mt-2">
                  <button className="btn join-item shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-blue-500 border-black border-2 hover:bg-red-600 text-black rounded-lg hover:border-black" onClick={handleInstallClick}>
                    DOWNLOAD APP NOW !
                  </button>
                  <button
                    className="btn join-item shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-black border-2 bg-red-600 hover:border-black text-black hover:bg-yellow-400 tooltip tooltip-left before:w-[12rem] before:content-[attr(data-tip)] rounded-lg"
                    data-tip="Works only on certain browsers, e.g., Chrome."
                  >
                    <BsInfoCircle />
                  </button>
                  <button
                    onClick={() => {
                      fetchChanges();
                      openModal();
                    }}
                    className="btn join-item shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-black border-2 bg-yellow-400 hover:border-black text-black hover:bg-red-600 rounded-lg relative"
                  >
                    <BsBell className="relative" />
                    {isRedDotVisible && (
                      <span
                        id="redDot"
                        className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 rounded-full animate-pulse ring-1 ring-red-600"
                      ></span>
                    )}
                  </button>
                </div>
                <div className="flex justify-center items-center mt-6 cursor-pointer" onClick={() => document.getElementById('contributors').showModal()}>
                  <span className="badge text-xs badge-lg py-5 px-4 text-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white">
                    <Image unoptimized
                      width={0}
                      height={0}
                      sizes="100vw"
                      src="/assets/verified.avif"
                      alt="Brand"
                      className="w-5 mb-0.5"
                    />
                    &nbsp;&nbsp;&nbsp;CONTRIBUTORS
                  </span>
                </div>
                <div className="flex justify-center items-center mt-6 cursor-pointer">
                  <div className="avatar-group -space-x-3.5 rtl:space-x-reverse" onClick={() => document.getElementById('contributors').showModal()}>
                    {data.contributors.slice(0, 3).map((user, index) => (
                      <div key={index} className="avatar border-0.5 border-white cursor-pointer">
                        <div className="w-14 color-change">
                          <Image unoptimized width={0} height={0} sizes="100vw" src={user.avatar} alt={user.name} />
                        </div>
                      </div>
                    ))}
                    <div className="avatar placeholder border-0.5 border-white cursor-pointer">
                      <div className="bg-black text-white w-14">
                        <span>+{displayedCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex-grow mb-48">
          {children}
        </div>
        <div className="relative flex justify-center items-center">
          <div className="absolute flex space-x-0.5 mb-14 left-[8%]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              src="/easter-egg/knuckles.avif"
              alt="Knuckles"
              className="mr-1.5 h-16 mt-1 w-full"
              unoptimized
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              src="/easter-egg/tails.avif"
              alt="Tails"
              className="h-16 mt-1 w-full"
              unoptimized
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              src="/easter-egg/sonic.avif"
              alt="Sonic"
              className="h-16 mt-1.5 w-full"
              unoptimized
            />
          </div>
          <div className="absolute right-[8%] bottom-0 mb-20">
            <Image
              width={0}
              height={0}
              src="/easter-egg/eggman.avif"
              alt="Eggman"
              className="h-24 w-full"
              unoptimized
            />
          </div>
        </div>
        <footer className={`footer footer-center bg-base-300  text-base-content rounded-none p-6 border-t-4 mt-1 border-black ${footerMarginClass}`}>
          <nav>
            <div className="grid grid-flow-col gap-4">
              {socialLinks.map((social, index) => (
                <a key={index} className="btn bg-yellow-400 btn-circle hover:bg-red-600 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:border-black" href={social.href}>
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </nav>
          <aside>
            <p>
              Made by <span className="text-red-600">ReiivanTheOnlyOne .</span>
            </p>
          </aside>
        </footer>
        {router.pathname !== '/dev/dashboard' && (
          <div className="btm-nav btm-nav-md bg-base-100">
            <Link href="/bios" className={isActive('/bios') ? 'text-blue-500' : ''}>
              <BsNut />
              <span className="!text-xs btm-nav-label">BIOS</span>
            </Link>
            <Link href="/memory" className={isActive('/memory') ? 'text-blue-500' : ''}>
              <BsSdCard />
              <span className="!text-xs btm-nav-label">MEMORY</span>
            </Link>
            <Link href="/" className={isActive('/') ? 'text-blue-500' : ''}>
              <BsHouseDoor />
              <span className="!text-xs btm-nav-label ">HOME</span>
            </Link>
            <Link href="/emulator" className={isEmulatorActive('/emulator') ? ' text-blue-500' : ''}>
              <BsJoystick />
              <span className="!text-xs btm-nav-label">EMULATOR</span>
            </Link>
            <Link href="/rom" className={isRomActive() ? ' text-blue-500' : ''}>
              <BsFileEarmarkZip />
              <span className="!text-xs btm-nav-label">ROM</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;