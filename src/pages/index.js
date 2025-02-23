import Layout from "./layout/Layout";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";

export default function Home() {

  const features = [
    {
      icon: "bi-save",
      title: "LOAD & SAVE STATES",
      description: "Easily load and save your game progress at any time."
    },
    {
      icon: "bi-upload",
      title: "IMPORT & EXPORT SAVE",
      description: "Import and export your saved states to share or back up."
    },
    {
      icon: "bi-pause",
      title: "PAUSE & RESTART MODE",
      description: "Pause your game or restart at any point to continue later."
    },
    {
      icon: "bi-dpad",
      title: "CHEATS FOR GAMES",
      description: "Activate cheats to enhance or modify your gaming experience."
    },
    {
      icon: "bi-controller",
      title: "CONTROLLER SETTINGS",
      description: "Customize your controller settings for a personalized experience."
    },
    {
      icon: "bi-laptop",
      title: "CROSS-PLATFORM SUPPORT",
      description: "Play across multiple devices with seamless synchronization."
    }
  ];

  const brands = [
    { name: "Brand 1", logo: "/brands/Nintendo.svg" },
    { name: "Brand 2", logo: "/brands/SEGA.svg" },
    { name: "Brand 3", logo: "/brands/Atari.svg" },
    { name: "Brand 4", logo: "/brands/PlayStation.svg" },
  ]

  const sliderRef = useRef(null)
  const [sliderWidth, setSliderWidth] = useState(0)

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth)
    }

    const handleResize = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const brandItems = [...brands, ...brands, ...brands]

  return (
    <>
      <Head>
        <title>RETROVERSE - Play Retro Games on Modern Devices</title>
        <meta name="description" content="Retroverse brings retro gaming to modern devices. Download the best emulator and BIOS files to enjoy your favorite classic games with full compatibility and smooth performance." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="RETROVERSE - Play Retro Games on Modern Devices" />
        <meta property="og:description" content="Experience retro gaming like never before with Retroverse. Download BIOS files and emulate classic games on modern systems with smooth performance and compatibility." />
        <meta property="og:image" content="https://retroverse-emulator.vercel.app/assets/favicon.png" />
        <meta property="og:url" content="https://retroverse-emulator.vercel.app/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="language" content="en" />
        <meta name="author" content="Rxvxn" />
        <link rel="canonical" href="https://retroverse-emulator.vercel.app/" />
      </Head>
      <Layout>
        <section className="py-10">
          <div className="w-full overflow-hidden -my-3">
            <div
              ref={sliderRef}
              className="flex animate-slide"
              style={{
                width: `${brandItems.length * 150}px`,
                animationDuration: `${brandItems.length * 5}s`,
              }}
            >
              {brandItems.map((brand, index) => (
                <div key={index} className="flex items-center justify-center w-[200px] h-24 mx-4 flex-shrink-0">
                  <Image width={0} height={0} sizes="100vw" src={brand.logo || "/placeholder.svg"} alt={brand.name} className="max-w-full max-h-full w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mt-16">
              {features.map((feature, index) => (
                <div className="text-center" key={index}>
                  <div className="bg-blue-500 rounded-full p-6 inline-block mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                    <i className={`bi ${feature.icon} text-5xl text-black`}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}