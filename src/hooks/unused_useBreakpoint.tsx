import { useState, useEffect } from 'react';

const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState<"sm" | "md" | "lg">("lg");

    const updateBreakpoint = () => {
        const width = window.innerWidth;
        if (width < 640) {
            setBreakpoint('sm');
        } else if (width >= 640 && width < 768) {
            setBreakpoint('md');
        } else if (width >= 768 && width < 1024) {
            setBreakpoint('md');
        } else if (width >= 1024) {
            setBreakpoint('lg');
        }
    };

    useEffect(() => {
        updateBreakpoint();
        window.addEventListener('resize', updateBreakpoint);
        return () => {
            window.removeEventListener('resize', updateBreakpoint);
        };
    }, []);

    return breakpoint;
};

export default useBreakpoint;