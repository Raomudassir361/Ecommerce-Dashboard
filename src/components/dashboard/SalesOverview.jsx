import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { salesOverviewCategories } from '../../data/mockData';

export default function SalesOverview() {
  const categories = salesOverviewCategories;
  const [hoveredCat, setHoveredCat] = useState(null);

  return (
    <motion.div
      id="sales-overview-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100/90 flex flex-col justify-between"
    >
      {/* Title & Total Metric */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Sales Overview
          </h2>
          <span className="text-[11px] font-medium text-slate-400">By Apparel</span>
        </div>

        <p className="text-xs font-medium text-slate-400">
          Total Store Volume
        </p>

        <div className="flex items-center gap-3 mt-1 mb-5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            9,824
          </span>
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#e4f9ee] text-[#10b981] text-xs font-bold"
          >
            +4.9%
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          </motion.span>
        </div>
      </div>

      {/* Progress Bars by Category with Animated Progress Width */}
      <div className="space-y-3.5">
        {categories.map((cat, idx) => {
          const isHovered = hoveredCat === cat.name;
          return (
            <div
              key={cat.name}
              onMouseEnter={() => setHoveredCat(cat.name)}
              onMouseLeave={() => setHoveredCat(null)}
              className={`group p-1.5 -mx-1.5 rounded-xl transition-all cursor-pointer ${
                isHovered ? 'bg-slate-50' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                <span className="group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {cat.percentage}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="bg-slate-100 h-3.5 rounded-full overflow-hidden relative flex items-center p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${cat.gradient} transition-all duration-300`}
                  style={{
                    filter: isHovered ? 'brightness(1.12)' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Top performer: Kurta & Lawn</span>
        <span className="text-emerald-600 font-semibold">Updated today</span>
      </div>
    </motion.div>
  );
}
