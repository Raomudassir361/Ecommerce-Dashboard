import React from 'react';
import StatCards from '../components/dashboard/StatCards';
import SalesStatistic from '../components/dashboard/SalesStatistic';
import ShipmentStatus from '../components/dashboard/ShipmentStatus';
import RecentOrders from '../components/dashboard/RecentOrders';
import SalesOverview from '../components/dashboard/SalesOverview';

export default function DashboardPage({ orders, onSelectOrder, onNavigate }) {
  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* 4 Metric Cards */}
      <StatCards onCardClick={onNavigate} />

      {/* Middle Section: Sales Statistic (2 cols) & Shipment Status (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-8">
          <SalesStatistic />
        </div>
        <div className="lg:col-span-4">
          <ShipmentStatus />
        </div>
      </div>

      {/* Bottom Section: Recent Orders (2 cols) & Sales OverView (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-8">
          <RecentOrders orders={orders} onSelectOrder={onSelectOrder} />
        </div>
        <div className="lg:col-span-4">
          <SalesOverview />
        </div>
      </div>
    </div>
  );
}
