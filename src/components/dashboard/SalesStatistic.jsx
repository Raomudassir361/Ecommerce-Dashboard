import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { salesStatisticTimeframes } from '../../data/mockData';

export default function SalesStatistic() {
  const [timeframe, setTimeframe] = useState('Monthly');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activePointIndex, setActivePointIndex] = useState(5); // Default to June
  const [isHovering, setIsHovering] = useState(false);
  const svgRef = useRef(null);

  const activeConfig = salesStatisticTimeframes[timeframe] || salesStatisticTimeframes.Monthly;
  const currentData = activeConfig.data;
  const yLabels = activeConfig.yLabels;
  const maxValue = activeConfig.maxValue;

  // Reset active point when timeframe switches
  useEffect(() => {
    const highlightedIdx = currentData.findIndex((d) => d.isHighlighted);
    setActivePointIndex(highlightedIdx !== -1 ? highlightedIdx : Math.floor(currentData.length / 2));
  }, [timeframe, currentData]);

  // Chart coordinate mapping
  const width = 820;
  const height = 270;
  const paddingLeft = 52;
  const paddingRight = 24;
  const paddingTop = 32;
  const paddingBottom = 42;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute points
  const points = currentData.map((item, index) => {
    const x = paddingLeft + (index / (currentData.length - 1)) * chartWidth;
    const valueRatio = item.value / maxValue;
    const y = paddingTop + chartHeight - Math.min(Math.max(valueRatio, 0.05), 0.98) * chartHeight;
    return { x, y, ...item, index };
  });

  // Create smooth Bezier curve
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} ${
    paddingTop + chartHeight
  } L ${points[0].x} ${paddingTop + chartHeight} Z` : '';

  const activePoint = points[activePointIndex] || points[0] || {};

  // Interactive mouse move / scrub handler
  const handlePointerMove = (e) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (!clientX) return;

    const svgX = ((clientX - rect.left) / rect.width) * width;

    let closestIdx = 0;
    let minDistance = Infinity;

    points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setActivePointIndex(closestIdx);
    setIsHovering(true);
  };

  const peakPoint = points.reduce(
    (max, p) => (p.value > max.value ? p : max),
    points[0] || {}
  );

  return (
    <motion.div
      id="sales-statistic-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100/90 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Header: Title, Live Metrics & Timeframe Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Sales Statistic
            </h2>
            <motion.span
              key={activeConfig.growth}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold"
            >
              <TrendingUp className="w-3 h-3" />
              {activeConfig.growth}
            </motion.span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-slate-400">
              Total {timeframe} Revenue:
            </p>
            <motion.span
              key={activeConfig.totalRevenue}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-slate-800"
            >
              {activeConfig.totalRevenue}
            </motion.span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-emerald-600">
              Peak: {peakPoint?.label} ({peakPoint?.totalSale})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Pill Switcher with Animated Layout Pill */}
          <div className="hidden md:flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/50 text-xs font-medium relative">
            {['Weekly', 'Monthly', 'Yearly'].map((tf) => (
              <button
                key={tf}
                id={`timeframe-tab-${tf.toLowerCase()}`}
                onClick={() => setTimeframe(tf)}
                className={`relative px-3 py-1.5 rounded-lg transition-colors cursor-pointer z-10 ${
                  timeframe === tf
                    ? 'text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {timeframe === tf && (
                  <motion.div
                    layoutId="activeTimeframePill"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                {tf}
              </button>
            ))}
          </div>

          {/* Timeframe Dropdown (mobile & accessible) */}
          <div className="relative">
            <button
              id="sales-timeframe-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-medium text-slate-700 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{timeframe}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  id="sales-timeframe-menu"
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs font-medium text-slate-700"
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Timeframe
                  </div>
                  {['Weekly', 'Monthly', 'Yearly'].map((tf) => (
                    <button
                      key={tf}
                      id={`dropdown-timeframe-${tf.toLowerCase()}`}
                      onClick={() => {
                        setTimeframe(tf);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer ${
                        timeframe === tf ? 'text-emerald-700 font-semibold bg-emerald-50/70' : ''
                      }`}
                    >
                      <span>{tf}</span>
                      {timeframe === tf && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Interactive Active Point Summary Strip */}
      <motion.div
        key={`${timeframe}-${activePoint?.label}`}
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-r from-emerald-50/60 via-slate-50 to-emerald-50/40 rounded-xl px-3.5 py-2 mb-2 border border-emerald-100/60 flex flex-wrap items-center justify-between gap-2 text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-800">
            {activePoint?.fullLabel || activePoint?.label}:
          </span>
          <span className="font-extrabold text-emerald-700 text-sm">
            {activePoint?.totalSale}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span>Orders: <strong className="text-slate-700 font-semibold">{activePoint?.orders || 'N/A'}</strong></span>
          <span>•</span>
          <span className="text-slate-400">Hover or click graph to inspect</span>
        </div>
      </motion.div>

      {/* SVG Chart Area with Live Scrubbing */}
      <div className="relative w-full overflow-x-auto select-none pt-2">
        <div className="min-w-[580px]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible cursor-crosshair"
            onMouseMove={handlePointerMove}
            onTouchMove={handlePointerMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <defs>
              <linearGradient id="salesGreenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>

              <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="tooltipShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.14" floodColor="#047857" />
              </filter>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {yLabels.map((label, i) => {
              const y = paddingTop + (i / (yLabels.length - 1)) * chartHeight;
              return (
                <g key={`${label}-${i}`}>
                  <text
                    x={paddingLeft - 14}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[11px] fill-slate-400 font-medium select-none"
                  >
                    {label}
                  </text>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* Green Area Fill with Animation */}
            <motion.path
              key={`area-${timeframe}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              d={areaPath}
              fill="url(#salesGreenGradient)"
            />

            {/* Green Main Stroke with Animated Path Draw */}
            <motion.path
              key={`line-${timeframe}`}
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              d={linePath}
              fill="none"
              stroke="#0e8749"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Vertical Guide Line on Active Point */}
            {activePoint && (
              <g className="transition-all duration-150">
                <line
                  x1={activePoint.x}
                  y1={paddingTop}
                  x2={activePoint.x}
                  y2={paddingTop + chartHeight}
                  stroke="#0e8749"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                  opacity={isHovering ? '0.75' : '0.4'}
                />
              </g>
            )}

            {/* Interactive Points on curve */}
            {points.map((pt, i) => {
              const isActive = i === activePointIndex;
              return (
                <g
                  key={`${pt.label}-${i}`}
                  onClick={() => setActivePointIndex(i)}
                  onMouseEnter={() => setActivePointIndex(i)}
                  className="cursor-pointer group"
                >
                  <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                  {isActive ? (
                    <g className="transition-transform duration-200">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        fill="#0e8749"
                        opacity="0.25"
                        className="animate-ping"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="7"
                        fill="#0e8749"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        filter="url(#pointGlow)"
                      />
                    </g>
                  ) : (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#0e8749"
                      opacity="0.4"
                      className="group-hover:opacity-100 group-hover:scale-125 transition-all"
                    />
                  )}
                </g>
              );
            })}

            {/* Active Tooltip Badge matching design screenshot */}
            {activePoint && (
              <g
                transform={`translate(${Math.max(50, Math.min(width - 60, activePoint.x))}, ${Math.max(
                  45,
                  activePoint.y - 44
                )})`}
                className="pointer-events-none transition-transform duration-150 ease-out"
              >
                <rect
                  x="-52"
                  y="-18"
                  width="104"
                  height="36"
                  rx="7"
                  fill="#86efac"
                  filter="url(#tooltipShadow)"
                  className="fill-[#86efac]"
                />
                <polygon
                  points="0,23 -6,18 6,18"
                  className="fill-[#86efac]"
                />
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-800 select-none"
                >
                  {activePoint.fullLabel?.length > 18
                    ? activePoint.fullLabel.slice(0, 16) + '...'
                    : activePoint.fullLabel || activePoint.label}
                </text>
                <text
                  x="0"
                  y="10"
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-700 select-none"
                >
                  Total sale {activePoint.totalSale}
                </text>
              </g>
            )}

            {/* X-Axis Month/Day/Year Labels */}
            {points.map((pt, i) => {
              const isSelected = i === activePointIndex;
              return (
                <g key={`x-label-${pt.label}-${i}`} className="cursor-pointer">
                  {isSelected && (
                    <rect
                      x={pt.x - 18}
                      y={height - 24}
                      width="36"
                      height="20"
                      rx="10"
                      fill="#dcfce7"
                      className="transition-all duration-150"
                    />
                  )}
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    onClick={() => setActivePointIndex(i)}
                    className={`text-xs font-semibold select-none transition-colors ${
                      isSelected
                        ? 'fill-[#0e8749] font-bold'
                        : 'fill-slate-500 hover:fill-slate-800'
                    }`}
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
