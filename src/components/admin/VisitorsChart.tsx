import React, { useState } from 'react';
import { TrendingUp, Users, Eye, Clock, ArrowUpRight, BarChart3, Monitor, Smartphone, Tablet } from 'lucide-react';
import { VisitorAnalytics } from '../../types.ts';

interface VisitorsChartProps {
  analytics: VisitorAnalytics | null;
  compact?: boolean;
}

export const VisitorsChart: React.FC<VisitorsChartProps> = ({ analytics, compact = false }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '14d'>('14d');

  // Fallback demo data if backend hasn't populated yet
  const defaultHistory = [
    { date: '2026-02-22', visitors: 42, pageViews: 110 },
    { date: '2026-02-23', visitors: 56, pageViews: 145 },
    { date: '2026-02-24', visitors: 68, pageViews: 180 },
    { date: '2026-02-25', visitors: 61, pageViews: 155 },
    { date: '2026-02-26', visitors: 78, pageViews: 210 },
    { date: '2026-02-27', visitors: 94, pageViews: 260 },
    { date: '2026-02-28', visitors: 88, pageViews: 245 },
    { date: '2026-03-01', visitors: 72, pageViews: 195 },
    { date: '2026-03-02', visitors: 85, pageViews: 230 },
    { date: '2026-03-03', visitors: 98, pageViews: 280 },
    { date: '2026-03-04', visitors: 112, pageViews: 310 },
    { date: '2026-03-05', visitors: 105, pageViews: 295 },
    { date: '2026-03-06', visitors: 124, pageViews: 340 },
    { date: '2026-03-07', visitors: 138, pageViews: 385 }
  ];

  const rawHistory = analytics?.history && analytics.history.length > 0 ? analytics.history : defaultHistory;
  const history = timeRange === '7d' ? rawHistory.slice(-7) : rawHistory;

  const totalVisitors = analytics?.totalVisitors || 1284;
  const todayVisitors = analytics?.todayVisitors || (history[history.length - 1]?.visitors || 84);
  const totalPageViews = analytics?.totalPageViews || 3940;
  const avgDuration = analytics?.avgDuration || '3m 42s';
  const bounceRate = analytics?.bounceRate || '28.4%';

  // SVG Chart Calculations
  const chartHeight = 180;
  const chartWidth = 600;
  const paddingX = 35;
  const paddingY = 25;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  const maxVisitors = Math.max(...history.map((h) => h.visitors), 10);
  const maxViews = Math.max(...history.map((h) => h.pageViews), 20);

  // Points for visitors (emerald area/line)
  const points = history.map((item, idx) => {
    const x = paddingX + (idx / (history.length - 1 || 1)) * usableWidth;
    const y = chartHeight - paddingY - (item.visitors / maxVisitors) * usableHeight;
    return { x, y, ...item };
  });

  // Points for pageViews (cyan line)
  const viewPoints = history.map((item, idx) => {
    const x = paddingX + (idx / (history.length - 1 || 1)) * usableWidth;
    const y = chartHeight - paddingY - (item.pageViews / maxViews) * usableHeight;
    return { x, y, ...item };
  });

  const visitorPathD = points.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
  }, '');

  const areaPathD = `${visitorPathD} L ${points[points.length - 1].x.toFixed(1)},${chartHeight - paddingY} L ${points[0].x.toFixed(1)},${chartHeight - paddingY} Z`;

  const viewPathD = viewPoints.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
  }, '');

  const activeItem = hoveredIndex !== null ? history[hoveredIndex] : null;

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Total Visitors</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-100">{totalVisitors.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% this month</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Today's Visits</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">{todayVisitors.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500 font-mono">Active sessions logging</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Page Views</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-100">{totalPageViews.toLocaleString()}</div>
          <div className="text-[10px] text-cyan-400 font-mono">~3.1 views / visitor</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Avg Duration</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-100">{avgDuration}</div>
          <div className="text-[10px] text-zinc-500 font-mono">Bounce rate: {bounceRate}</div>
        </div>
      </div>

      {/* Main Interactive Chart Box */}
      <div className="p-5 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-zinc-100">Audience & Traffic Trends</h4>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daily unique visitors and aggregate page views
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Visitors</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Views</span>
              </span>
            </div>

            {/* Time range pills */}
            <div className="flex items-center rounded-xl bg-black border border-zinc-800 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setTimeRange('7d')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  timeRange === '7d' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('14d')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  timeRange === '14d' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                14 Days
              </button>
            </div>
          </div>
        </div>

        {/* SVG Container */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[500px] overflow-visible"
          >
            <defs>
              <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.33, 0.66, 1].map((ratio, i) => {
              const y = chartHeight - paddingY - ratio * usableHeight;
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#27272a"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    fill="#71717a"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {Math.round(ratio * maxVisitors)}
                  </text>
                </g>
              );
            })}

            {/* Area fill for visitors */}
            <path d={areaPathD} fill="url(#visitorGradient)" />

            {/* Page views line (cyan) */}
            <path
              d={viewPathD}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.8"
            />

            {/* Visitors line (emerald) */}
            <path
              d={visitorPathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points & Hover Targets */}
            {points.map((pt, idx) => {
              const isHovered = hoveredIndex === idx;
              const dateObj = new Date(pt.date);
              const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

              return (
                <g key={idx}>
                  {/* Invisible wide column for hover target */}
                  <rect
                    x={pt.x - usableWidth / (history.length * 2)}
                    y={paddingY}
                    width={usableWidth / history.length}
                    height={usableHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Vertical hover guide */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={paddingY}
                      x2={pt.x}
                      y2={chartHeight - paddingY}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Dot on visitors */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3}
                    fill="#10b981"
                    stroke="#09090b"
                    strokeWidth="1.5"
                  />

                  {/* X Axis Date labels */}
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    fill={isHovered ? '#10b981' : '#71717a'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {activeItem && hoveredIndex !== null && (
            <div className="absolute top-2 right-4 p-3 rounded-xl bg-black/90 border border-zinc-700 shadow-xl backdrop-blur-md text-xs font-mono space-y-1 pointer-events-none animate-in fade-in duration-100">
              <div className="text-zinc-400 font-bold border-b border-zinc-800 pb-1">
                {new Date(activeItem.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center justify-between gap-4 text-emerald-400">
                <span>Visitors:</span>
                <span className="font-bold text-zinc-100">{activeItem.visitors}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-cyan-400">
                <span>Page Views:</span>
                <span className="font-bold text-zinc-100">{activeItem.pageViews}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Extra Analytics Details (shown on non-compact mode) */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Top Referrers */}
          <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400">
              Traffic Acquisition Sources
            </h4>
            <div className="space-y-2 text-xs font-mono">
              {[
                { source: 'Direct / Portfolio Link', pct: 45, color: 'bg-emerald-400' },
                { source: 'LinkedIn Professional Profile', pct: 28, color: 'bg-blue-400' },
                { source: 'GitHub Repos & READMEs', pct: 16, color: 'bg-purple-400' },
                { source: 'WhatsApp Shared Resume', pct: 11, color: 'bg-teal-400' }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span>{item.source}</span>
                    <span className="font-bold text-zinc-100">{item.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400">
              Device & Browser Distribution
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <Monitor className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                <div className="text-base font-black font-mono text-zinc-100">64%</div>
                <div className="text-[10px] text-zinc-400 font-mono">Desktop</div>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <Smartphone className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
                <div className="text-base font-black font-mono text-zinc-100">31%</div>
                <div className="text-[10px] text-zinc-400 font-mono">Mobile</div>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <Tablet className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                <div className="text-base font-black font-mono text-zinc-100">5%</div>
                <div className="text-[10px] text-zinc-400 font-mono">Tablet</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed font-mono">
              Top locations: Pakistan (62%), United States (18%), United Kingdom (9%), Other (11%).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
