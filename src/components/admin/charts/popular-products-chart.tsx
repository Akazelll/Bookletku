"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useTheme } from "next-themes";
import { TrendingUp, PackageOpen } from "lucide-react";

// --- Types ---
interface PopularChartProps {
  data: { name: string; count: number }[];
}

// --- Configuration ---
// Palet warna "Juara"
const CHART_COLORS = [
  "#8b5cf6", // Rank 1: Vivid Violet
  "#ec4899", // Rank 2: Hot Pink
  "#3b82f6", // Rank 3: Bright Blue
  "#10b981", // Rank 4: Emerald
  "#f59e0b", // Rank 5: Amber
];

// --- Sub-Component: Empty State ---
const EmptyState = () => (
  <div className='h-[400px] w-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-500'>
    <div className='w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm'>
      <PackageOpen className='w-8 h-8 opacity-50' />
    </div>
    <p className='font-medium text-sm'>Belum ada data penjualan</p>
    <p className='text-xs text-zinc-500 mt-1'>
      Menu terpopuler akan muncul di sini.
    </p>
  </div>
);

// --- Main Component ---
export function PopularProductsChart({ data }: PopularChartProps) {
  const { theme } = useTheme();

  // 1. Data Processing
  const chartData = React.useMemo(() => {
    if (!data) return [];
    return data
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
  }, [data]);

  // 2. Dynamic Styles for Bars
  const dynamicBarColors = React.useMemo(() => {
    return chartData.reduce((acc, item, index) => {
      return {
        ...acc,
        [`& .MuiBarElement-root:nth-of-type(${index + 1})`]: {
          fill: item.color,
        },
      };
    }, {});
  }, [chartData]);

  if (!chartData || chartData.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className='w-full relative group'>
      {/* Label Pojok Kanan Atas */}
      <div className='absolute top-0 right-0 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 pointer-events-none'>
        <TrendingUp className='w-3 h-3' />
        <span>Live Performance</span>
      </div>

      <div className='w-full h-[400px]'>
        <BarChart
          dataset={chartData}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "label",
              categoryGapRatio: 0.4,
              barGapRatio: 0.1,
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: {
                angle: 0,
                textAnchor: "middle",
              },
            },
          ]}
          yAxis={[
            {
              label: "",
              disableLine: true,
              disableTicks: true,
              tickMinStep: 1,
            },
          ]}
          series={[
            {
              dataKey: "count",
              valueFormatter: (v) => `${v} Sales`,
              highlightScope: {
                fade: "global",
                highlight: "item",
              },
            },
          ]}
          grid={{ horizontal: true }}
          margin={{ left: 40, right: 20, top: 40, bottom: 40 }}
          borderRadius={8}
          // [FIX] Menggunakan slotProps untuk konfigurasi tooltip
          slotProps={{
            tooltip: {
              trigger: "item",
            },
          }}
          sx={{
            // A. Inject Warna Dinamis
            ...dynamicBarColors,

            // B. Hapus Outline Fokus
            "& .MuiChartsSurface-root": {
              outline: "none !important",
            },

            // C. Styling Label Sumbu X (Nama Produk di Bawah)
            [`.${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
              fill: "var(--foreground) !important",
              fontWeight: 600,
              fontSize: "11px",
              fontFamily: "var(--font-sans)",
            },

            // D. Styling Label Sumbu Y (Angka di Kiri)
            [`.${axisClasses.left} .${axisClasses.tickLabel}`]: {
              fill: "var(--muted-foreground) !important",
              fontSize: "11px",
              fontWeight: 500,
            },

            // E. Styling Grid Horizontal
            "& .MuiChartsGrid-line": {
              stroke: "var(--border) !important",
              strokeDasharray: "4 4",
              strokeOpacity: 0.5,
            },

            // F. Interaksi Hover Batang
            "& .MuiBarElement-root": {
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.05))",
            },
            "& .MuiBarElement-root:hover": {
              filter:
                "brightness(1.1) drop-shadow(0px 8px 12px rgba(0,0,0,0.15))",
              cursor: "pointer",
              transform: "translateY(-4px)",
            },
            "& .MuiBarElement-series-auto-generated-id-0[opacity='0.3']": {
              opacity: 0.2,
              filter: "grayscale(0.8)",
            },

            // G. Tooltip Custom Styling
            "& .MuiChartsTooltip-root": {
              backgroundColor: "var(--card) !important",
              border: "1px solid var(--border) !important",
              color: "var(--foreground) !important",
              borderRadius: "12px !important",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1) !important",
              padding: "8px 12px !important",
            },
            "& .MuiChartsTooltip-table": {
              fontFamily: "var(--font-sans)",
            },
            "& .MuiChartsTooltip-mark": {
              borderRadius: "4px !important",
            },
          }}
        />
      </div>
    </div>
  );
}
