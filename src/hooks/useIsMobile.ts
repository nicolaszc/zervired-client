// useIsMobile.js (use client directive at the top if in App Router)
"use client";

import { useState, useEffect } from "react";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false); // Default to false for SSR safety

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    handleWindowSizeChange(); // Set initial value
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
