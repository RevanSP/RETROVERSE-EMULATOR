import AOS from 'aos';
import 'aos/dist/aos.css'; 

export const initializeAOS = () => {
    AOS.init({
        duration: 750,
        easing: 'ease-in-out',  
        once: true,  
    });
};