"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize, AlertCircle } from "lucide-react";

export interface Hotspot {
  id: string;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  title: string;
  description: string;
  color?: string;
}

interface ImageViewerProps {
  src: string;
  alt?: string;
  hotspots?: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
}

export default function ImageViewer({ src, alt = "Image", hotspots = [], onHotspotClick }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, 4));
  const handleZoomOut = () => {
    setScale((s) => {
      const newScale = Math.max(s - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-clinical-navy/10 dark:border-white/10 group select-none">
      
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
        <button onClick={handleZoomIn} className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors" title="Zoom In">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors" title="Zoom Out">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button onClick={handleReset} className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors" title="Reset View">
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      {/* Viewport */}
      <div 
        ref={containerRef}
        className={`relative flex-1 w-full h-full overflow-hidden ${scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
      >
        <div 
          className="w-full h-full transition-transform duration-200 ease-out origin-center flex items-center justify-center"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
        >
          {/* Main Image */}
          <div className="relative inline-block max-w-full max-h-full">
            <img 
              src={src} 
              alt={alt}
              className="max-w-full max-h-[500px] object-contain pointer-events-none"
              draggable={false}
            />
            
            {/* Hotspots */}
            {hotspots.map((spot) => (
              <button
                key={spot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(spot);
                  onHotspotClick?.(spot);
                }}
                className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center group/spot"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                {/* Ping animation */}
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${spot.color || "bg-clinical-clay"}`}></span>
                {/* Core dot */}
                <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white ${spot.color || "bg-clinical-clay"}`}></span>
                
                {/* Tooltip visible on hover */}
                <div className="absolute opacity-0 group-hover/spot:opacity-100 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none transition-opacity">
                  {spot.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Hotspot Info Card */}
      {activeHotspot && (
        <div className="absolute bottom-4 left-4 right-16 z-20 bg-white dark:bg-clinical-darker border border-clinical-navy/10 dark:border-white/10 p-4 rounded-xl shadow-lg flex items-start gap-3 animate-slide-up">
          <div className="mt-0.5">
            <AlertCircle className={`w-5 h-5 ${activeHotspot.color ? `text-[${activeHotspot.color}]` : 'text-clinical-clay'}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-clinical-navy dark:text-clinical-light">{activeHotspot.title}</h4>
            <p className="text-xs text-clinical-navy/70 dark:text-clinical-light/70 mt-1 leading-relaxed">
              {activeHotspot.description}
            </p>
          </div>
          <button 
            onClick={() => setActiveHotspot(null)}
            className="text-xs text-clinical-navy/50 hover:text-clinical-navy dark:text-white/50 dark:hover:text-white"
          >
            بستن
          </button>
        </div>
      )}
    </div>
  );
}
