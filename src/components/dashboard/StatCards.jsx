import React from 'react';
import { TrendingUp, Users, ClipboardList, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export default function StatCards({ onCardClick }) {
  const cards = [
    {
      id: 'stat-sales',
      title: 'Total Sales',
      value: '₨ 10.4M',
      bgColor: 'bg-[#f4effe]',
      textColor: 'text-[#8b5cf6]',
      icon: TrendingUp,
      page: 'dashboard',
    },
    {
      id: 'stat-customers',
      title: 'Total Customers',
      value: '20.4K',
      bgColor: 'bg-[#e2f6fd]',
      textColor: 'text-[#0ea5e9]',
      icon: Users,
      page: 'user',
    },
    {
      id: 'stat-products',
      title: 'Total Products',
      value: '2.4K',
      bgColor: 'bg-[#fdeadc]',
      textColor: 'text-[#f97316]',
      icon: ClipboardList,
      page: 'list',
    },
    {
      id: 'stat-orders',
      title: 'Total Orders',
      value: '1.6K',
      bgColor: 'bg-[#e4f9ee]',
      textColor: 'text-[#10b981]',
      icon: ShoppingBag,
      page: 'order',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            id={card.id}
            variants={cardVariants}
            whileHover={{
              y: -4,
              scale: 1.015,
              boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.08)',
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCardClick && onCardClick(card.page)}
            className={`${card.bgColor} rounded-2xl p-5 sm:p-6 cursor-pointer flex items-center justify-between relative overflow-hidden group border border-black/3`}
          >
            <div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium tracking-tight">
                {card.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2 tracking-tight">
                {card.value}
              </h3>
            </div>

            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.textColor} transition-transform duration-200`}
            >
              <Icon className="w-8 h-8 stroke-[1.8]" />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
