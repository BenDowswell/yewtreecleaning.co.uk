'use client';

import { useEffect, useRef, useState } from 'react';

// CW3 9DT coordinates (Madeley, Shropshire)
const MADELEY_LAT = 52.9736;
const MADELEY_LNG = -2.4432;
const RADIUS_MILES = 12;
const RADIUS_METRES = RADIUS_MILES * 1609.34;

interface ServiceAreaMapProps {
  height?: string;
  className?: string;
}

export default function ServiceAreaMap({
  height = 'h-80 lg:h-96',
  className = '',
}: ServiceAreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import('leaflet')).default;

      if (cancelled || !mapRef.current) return;

      // Fix default marker icon path issue with bundlers
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [MADELEY_LAT, MADELEY_LNG],
        zoom: 11,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      // Add tile layer — this is what actually renders the map imagery
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      });

      // Wait for tiles to load before showing the map
      tileLayer.on('load', () => {
        if (!cancelled) setLoaded(true);
      });

      tileLayer.addTo(map);

      // Service area circle
      L.circle([MADELEY_LAT, MADELEY_LNG], {
        radius: RADIUS_METRES,
        color: '#7CB791',
        fillColor: '#7CB791',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '6 4',
      }).addTo(map);

      // Centre marker with custom popup
      const marker = L.marker([MADELEY_LAT, MADELEY_LNG]).addTo(map);
      marker.bindPopup(
        `<div style="text-align:center;font-family:system-ui,sans-serif;">
          <strong style="font-size:14px;">Yew Tree Cleaning</strong><br/>
          <span style="font-size:12px;color:#555;">Madeley, CW3 9DT</span><br/>
          <span style="font-size:11px;color:#7CB791;">Serving ~${RADIUS_MILES} miles around Madeley</span>
        </div>`
      );

      // Fit the map to show the full circle
      const circleBounds = L.latLng(MADELEY_LAT, MADELEY_LNG).toBounds(RADIUS_METRES * 2);
      map.fitBounds(circleBounds, { padding: [20, 20] });

      mapInstanceRef.current = map;

      // Show map and force Leaflet to recalculate container size
      setTimeout(() => {
        if (!cancelled) {
          setLoaded(true);
          map.invalidateSize();
          map.fitBounds(circleBounds, { padding: [20, 20] });
        }
      }, 300);
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Loading overlay — sits on top of the map container */}
      {!loaded && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center bg-gray-100`}
        >
          <div className="text-center text-gray-400">
            <svg
              className="mx-auto h-8 w-8 animate-spin text-brand-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="mt-2 text-sm">Loading map&hellip;</p>
          </div>
        </div>
      )}
      {/* Map container — always rendered so Leaflet can calculate tile positions */}
      <div
        ref={mapRef}
        className={`w-full ${height}`}
        role="application"
        aria-label="Map showing Yew Tree Cleaning service area around Madeley, approximately 12 miles radius"
      />
    </div>
  );
}
