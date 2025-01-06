/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Hero from '../components/Hero';
import LogoSlider from '../components/LogoSlider';
import Features from '../components/Features';
import Consoles from '../components/Consoles';
import Games from '../components/Games';
import Alert from "../components/Alert";
import Footer from "../components/Footer";
import ATARI2600 from "./ATARI2600";
import ATARI5200 from "./ATARI5200";
import SEGAMD from './SEGAMD';
import ATARI7800 from './ATARI7800';
import ATARIJAGUAR from './ATARIJAGUAR';
import ATARILYNX from './ATARILYNX';
import N64 from './N64';
import NDS from './NDS';
import NES from './NES';
import GBA from './GBA';
import SEGAMS from './SEGAMS';
import SNES from './SNES';
import VIRTUALBOY from './VIRTUALBOY';
import GAMEBOY from './GAMEBOY';

const HOME = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });
  const [activeContentId, setActiveContentId] = useState('HOME');
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    if (!activeContentId) return;
    setFadeClass('fade-out');

    const timer = setTimeout(() => {
      setFadeClass('fade-in');
    }, 500);

    return () => clearTimeout(timer);
  }, [activeContentId]);

  const handleContentChange = (targetId: string) => {
    if (targetId === activeContentId) return;

    setFadeClass('fade-out');
    setTimeout(() => {
      setActiveContentId(targetId);
    }, 500);
  };

  const handleModeToggle = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('isDarkMode', newMode.toString());
      return newMode;
    });
  };

  useEffect(() => {
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const cards = document.querySelectorAll('.card');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const btnDarkElements = document.querySelectorAll('.btn-dark');
    const footer = document.querySelector('.footer');

    if (isDarkMode) {
      body.classList.add('bg-dark-mode');
      body.classList.remove('bg-light-mode');

      navbar?.classList.add('navbar-dark-mode');
      navbar?.classList.remove('navbar-light-mode');

      cards.forEach(card => {
        card.classList.add('card-dark-mode');
        card.classList.remove('card-light-mode');
      });

      dropdownMenu?.classList.add('dropdown-menu-dark');
      dropdownMenu?.classList.remove('dropdown-menu-light');
      dropdownMenu?.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.add('dropdown-item-dark');
        item.classList.remove('dropdown-item-light');
      });

      btnDarkElements.forEach(btn => {
        btn.classList.add('btn-dark-mode');
        btn.classList.remove('btn-dark');
      });

      document.querySelectorAll('a.rom-light').forEach(link => {
        link.classList.add('rom-dark');
        link.classList.remove('rom-light');
      });

      footer?.classList.add('footer-dark-mode');
      footer?.classList.remove('footer-light-mode');
    } else {
      body.classList.add('bg-light-mode');
      body.classList.remove('bg-dark-mode');

      navbar?.classList.add('navbar-light-mode');
      navbar?.classList.remove('navbar-dark-mode');

      cards.forEach(card => {
        card.classList.add('card-light-mode');
        card.classList.remove('card-dark-mode');
      });

      dropdownMenu?.classList.add('dropdown-menu-light');
      dropdownMenu?.classList.remove('dropdown-menu-dark');
      dropdownMenu?.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.add('dropdown-item-light');
        item.classList.remove('dropdown-item-dark');
      });

      btnDarkElements.forEach(btn => {
        btn.classList.add('btn-dark');
        btn.classList.remove('btn-dark-mode');
      });

      document.querySelectorAll('a.rom-dark').forEach(link => {
        link.classList.add('rom-light');
        link.classList.remove('rom-dark');
      });

      footer?.classList.add('footer-light-mode');
      footer?.classList.remove('footer-dark-mode');
    }
  }, [isDarkMode]);

  return (
    <>
      <div className="home-page">
        <Loader />
        <div id="content" style={{ display: 'none' }}>
          <Navbar isDarkMode={isDarkMode} handleModeToggle={handleModeToggle} onContentChange={handleContentChange} />
          <Hero isDarkMode={isDarkMode} />
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'HOME' ? 'block' : 'none' }}
            id="HOME"
          >
            <LogoSlider />
            <Features />
            <Consoles />
            <Games />
            <Alert />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === '2600' ? 'block' : 'none' }}
          >
            <ATARI2600 isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === '5200' ? 'block' : 'none' }}
          >
            <ATARI5200 isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === '7800' ? 'block' : 'none' }}
          >
            <ATARI7800 isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'JAGUAR' ? 'block' : 'none' }}
          >
            <ATARIJAGUAR isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'LYNX' ? 'block' : 'none' }}
          >
            <ATARILYNX isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'N64' ? 'block' : 'none' }}
          >
            <N64 isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'NDS' ? 'block' : 'none' }}
          >
            <NDS isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'NES' ? 'block' : 'none' }}
          >
            <NES isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'GBA' ? 'block' : 'none' }}
          >
            <GBA isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'GB' ? 'block' : 'none' }}
          >
            <GAMEBOY isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'MS' ? 'block' : 'none' }}
          >
            <SEGAMS isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'MD' ? 'block' : 'none' }}
          >
            <SEGAMD isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'SNES' ? 'block' : 'none' }}
          >
            <SNES isDarkMode={isDarkMode} />
          </main>
          <main
            className={`container-fluid px-4 px-md-5 mt-4 ${fadeClass}`}
            style={{ display: activeContentId === 'VBOY' ? 'block' : 'none' }}
          >
            <VIRTUALBOY isDarkMode={isDarkMode} />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HOME;