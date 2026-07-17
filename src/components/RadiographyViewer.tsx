"use client";

import React, { useState, useRef, MouseEvent, WheelEvent, TouchEvent } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sun, Percent, HelpCircle } from "lucide-react";

interface RadiographyViewerProps {
  imageUrl: string;
  caption?: string;
}

export default function RadiographyViewer({ imageUrl, caption }: RadiographyViewerProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [invert, setInvert] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse drag handles
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handle
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    let newZoom = zoom + (e.deltaY < 0 ? zoomFactor : -zoomFactor);
    newZoom = Math.max(0.5, Math.min(newZoom, 4.0)); // Zoom limit between 50% and 400%
    setZoom(newZoom);
  };

  // Touch handlers for mobile devices
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      // Single touch for panning
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
    } else if (e.touches.length === 2) {
      // Multi-touch for pinch-zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y
      });
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchDistanceRef.current;
      let newZoom = zoom * ratio;
      newZoom = Math.max(0.5, Math.min(newZoom, 4.0));
      setZoom(newZoom);
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistanceRef.current = null;
  };

  const resetFilters = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setInvert(false);
  };

  return (
    <div className="flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 text-slate-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-teal-400">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
          ویوئر PACS مجازی دندانپزشکی
        </span>
        <span className="text-slate-400 font-mono">ZOOM: {Math.round(zoom * 100)}%</span>
      </div>

      {/* PACS Canvas Area */}
      <div
        ref={containerRef}
        className="relative h-[320px] md:h-[400px] bg-slate-900 overflow-hidden select-none flex items-center justify-center pacs-viewer-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Invisible Watermark layer */}
        <div className="absolute inset-0 pointer-events-none flex flex-wrap justify-between items-center opacity-[0.03] select-none text-slate-100 font-semibold p-4 text-xs tracking-widest leading-loose rotate-[-15deg]">
          {Array(30).fill("CASECLINIC").map((t, idx) => (
            <span key={idx} className="block">{t}</span>
          ))}
        </div>

        {/* Scaled & Filtered Image */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? "invert(100%)" : ""}`,
            transition: isDragging ? "none" : "transform 0.15s ease-out, filter 0.1s ease-out"
          }}
          className="relative max-w-[90%] max-h-[90%] pointer-events-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={caption || "Radiograph Image"}
            className="object-contain rounded"
          />
        </div>

        {/* Small Controls HUD */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm border border-slate-800 rounded-md px-2 py-1 text-[10px] text-slate-400 space-y-0.5">
          <div className="flex justify-between gap-4"><span>روشنایی:</span> <span>{brightness}%</span></div>
          <div className="flex justify-between gap-4"><span>کنتراست:</span> <span>{contrast}%</span></div>
          <div className="flex justify-between gap-4"><span>پکسل معکوس:</span> <span>{invert ? "فعال" : "غیرفعال"}</span></div>
        </div>
      </div>

      {/* Control sliders */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Sun className="h-3.5 w-3.5" /> روشنایی (Brightness)
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Percent className="h-3.5 w-3.5" /> کنتراست (Contrast)
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>
        </div>

        {/* Quick buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.25, 4))}
              className="p-2 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-600 transition-colors"
              title="زوم بزرگنمایی"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
              className="p-2 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-600 transition-colors"
              title="زوم کوچک‌نمایی"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setInvert(!invert)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                invert ? "bg-teal-600 text-white" : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> معکوس کردن رنگ
            </button>
          </div>

          <button
            onClick={resetFilters}
            className="px-3 py-1.5 text-xs rounded border border-slate-700 hover:bg-slate-800 flex items-center gap-1.5 transition-colors text-slate-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> ریست ابزارها
          </button>
        </div>
      </div>

      {caption && (
        <div className="px-4 py-2 bg-slate-950 text-[11px] text-slate-400 italic text-center border-t border-slate-900">
          {caption}
        </div>
      )}
    </div>
  );
}
