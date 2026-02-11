const useIsMobile = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(max-width: 640px)').matches;
};

export default useIsMobile;
