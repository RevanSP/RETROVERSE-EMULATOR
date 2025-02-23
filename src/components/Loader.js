import { useState, useEffect } from "react";
import styles from "../assets/Loader.module.css";

const Loader = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`loader ${isVisible
                ? "opacity-100"
                : "opacity-0 pointer-events-none transition-opacity duration-1000 ease-out"
                } fixed top-0 left-0 w-full h-full flex items-center justify-center`}
            style={{ zIndex: 999 }}
        >
            <div className={styles.levelContainer}>
                <div className={styles.rowContainer}>
                    <div className={styles.row}>
                        <div className={styles.sonic}></div>
                    </div>
                </div>
                <div className={styles.tubeContainer}>
                    <div className={styles.support1}></div>
                    <div className={styles.support2}></div>
                    <div className={styles.tube}></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;