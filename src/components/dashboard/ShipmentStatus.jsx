import React, { useState } from 'react';
import { ChevronDown, PackageCheck, Truck, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { shipmentStatsByPeriod } from '../../data/mockData';

export default function ShipmentStatus() {
  const [period, setPeriod] = useState('This Week');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const activePeriodData = shipmentStatsByPeriod[period] || shipmentStatsByPeriod['This Week'];
  const segments = activePeriodData.segments;
  const totalShipped = activePeriodData.total;

  // Donut SVG parameters
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and strokeDashoffset for each segment
  const gapPercent = 1.6;
  let accumulatedPercent = 0;

  const segmentArcs = segments.map((seg) => {
    const effectivePercent = Math.max(seg.percent - gapPercent, 2);
    const strokeDash = (effectivePercent / 100) * circumference;
    const strokeSpace = circumference - strokeDash;
    const offset = -((accumulatedPercent + gapPercent / 2) / 100) * circumference;
    accumulatedPercent += seg.percent;

    return {
      ...seg,
      strokeDash,
      strokeSpace,
      offset
    };
  });

  return (
    <motion.div
      id="shipment-status-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100/90 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Shipment Status
          </h2>
          <p className="text-xs text-slate-400">Dispatch & courier metrics</p>
        </div>

        <div className="relative">
          <button
            id="shipment-filter-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <span>{period}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 text-xs font-medium"
              >
                {['Today', 'This Week', 'This Month'].map((p) => (
                  <button
                    key={p}
                    id={`shipment-filter-${p.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      setPeriod(p);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer ${
                      period === p ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{p}</span>
                    {period === p && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Donut Chart with Interactive Segments */}
      <div className="relative flex items-center justify-center py-4 sm:py-5">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 select-none"
        >
          {segmentArcs.map((seg, idx) => {
            const isHovered = hoveredSegment === seg.key;
            return (
              <motion.circle
                key={`${period}-${seg.key}`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: seg.offset }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: 'easeOut' }}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={`${seg.strokeDash} ${seg.strokeSpace}`}
                strokeLinecap="round"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredSegment(seg.key)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => setHoveredSegment(hoveredSegment === seg.key ? null : seg.key)}
              />
            );
          })}
        </svg>

        {/* Center Hover Info with AnimatePresence */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {hoveredSegment ? (
              (() => {
                const seg = segments.find((s) => s.key === hoveredSegment);
                if (!seg) return null;
                return (
                  <motion.div
                    key={seg.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="text-center"
                  >
                    <span className="text-2xl font-extrabold text-slate-800">
                      {seg.percent}%
                    </span>
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      {seg.label}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-600">
                      {seg.count.toLocaleString()} parcels
                    </p>
                  </motion.div>
                );
              })()
            ) : (
              <motion.div
                key={`total-${period}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <span className="text-2xl font-extrabold text-slate-800">
                  {totalShipped.toLocaleString()}
                </span>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Shipped
                </p>
                <p className="text-[10px] text-slate-400">TCS / Leopard / Swyft</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend below donut chart: 2x2 Grid with real values */}
      <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 pt-3 border-t border-slate-100">
        {segments.map((seg) => {
          const isSelected = hoveredSegment === seg.key;
          return (
            <motion.div
              key={seg.key}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredSegment(seg.key)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => setHoveredSegment(hoveredSegment === seg.key ? null : seg.key)}
              className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-100 ring-1 ring-slate-200'
                  : hoveredSegment
                  ? 'opacity-40 hover:opacity-100'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-slate-700 truncate">{seg.label}</span>
              </div>
              <span className="font-bold text-slate-800 ml-1">
                {seg.percent}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
