import { useEffect, useRef, useState } from 'react';

const VirtualTourViewer = ({ tourImageUrl }) => {
  const viewerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!tourImageUrl) return;

    const loadPannellum = () => {
      if (window.pannellum) {
        setLoaded(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    };

    loadPannellum();
  }, [tourImageUrl]);

  useEffect(() => {
    if (loaded && viewerRef.current && tourImageUrl) {
      viewerRef.current.innerHTML = '';
      window.pannellum.viewer(viewerRef.current, {
        type: 'equirectangular',
        panorama: tourImageUrl,
        autoLoad: true,
        compass: true,
      });
    }
  }, [loaded, tourImageUrl]);

  if (!tourImageUrl) {
    return (
      <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500">
        Virtual tour not available. Upload a 360° equirectangular image.
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden relative border border-gray-200 shadow-sm">
      {!loaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">Loading viewer...</div>}
      <div ref={viewerRef} className="w-full h-full"></div>
    </div>
  );
};

export default VirtualTourViewer;
