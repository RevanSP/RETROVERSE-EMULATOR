import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const GamePage = () => {
    const router = useRouter();
    const { fileURL, version, core, language, biosURL, patchURL } = router.query;

    const [isClient, setIsClient] = useState(false);

    const bgImageURL = isClient 
        ? (window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/easter-egg/bg-play.jpg' 
            : 'https://retroverse-remake.vercel.app/easter-egg/bg-play.jpg') 
        : '';

    useEffect(() => {
        setIsClient(true); 

        if (!fileURL || !version || !core || !language) {
            router.push('/emulator');
            return;
        }

        const script = document.createElement('script');
        script.src = `https://cdn.emulatorjs.org/${version}/data/loader.js`;
        script.async = true;
        document.body.appendChild(script);

        Object.assign(window, {
            EJS_player: '#game',
            EJS_gameUrl: fileURL,
            EJS_DEBUG_XX: false,
            EJS_settingsLanguage: true,
            EJS_backgroundBlur: true,
            EJS_core: core || '',
            EJS_backgroundImage: bgImageURL,
            EJS_language: language,
            EJS_version: version,
            EJS_pathtodata: `https://cdn.emulatorjs.org/${version}/data/`,
            EJS_biosUrl: biosURL || '', 
            EJS_gamePatchUrl: patchURL || '',
            EJS_fullscreenOnLoaded: true
        });

        script.onload = () => {
            document.getElementById('display').classList.remove('pointer-events-none');
        };
    }, [fileURL, version, core, language, biosURL, patchURL, bgImageURL, router]);

    return (
        <div id="display" className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none">
            <div id="game"></div>
        </div>
    );
};

export default GamePage;