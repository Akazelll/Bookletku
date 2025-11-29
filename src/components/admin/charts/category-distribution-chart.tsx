"use client";

import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { MenuItem } from "@/types/menu";

interface CategoryChartProps {
  menus: MenuItem[];
}

// Styled Text untuk Label di Tengah Donut
const StyledText = styled("text")({});

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 - 10}
        // Menggunakan class Tailwind untuk SVG text di tengah
        className='fill-zinc-900 dark:fill-zinc-100 text-4xl font-extrabold'
        textAnchor='middle'
        dominantBaseline='central'
      >
        {children}
      </StyledText>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 + 20}
        className='fill-zinc-400 dark:fill-zinc-500 text-xs font-semibold uppercase tracking-widest'
        textAnchor='middle'
        dominantBaseline='central'
      >
        Total Menu
      </StyledText>
    </>
  );
}

// Palet Warna Modern
const vibrantPalette = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f43f5e", // Rose
];

export function CategoryDistributionChart({ menus }: CategoryChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const data = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    menus.forEach((menu) => {
      counts[menu.category] = (counts[menu.category] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value], index) => ({
      id: index,
      value,
      label,
      color: vibrantPalette[index % vibrantPalette.length],
    }));
  }, [menus]);

  const isMobile = width < 400;

  if (data.length === 0) {
    return (
      <div className='flex h-[350px] items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl'>
        Belum ada data kategori.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className='w-full h-[350px] flex items-center justify-center'
    >
      <PieChart
        series={[
          {
            data,
            innerRadius: isMobile ? 80 : 100,
            outerRadius: isMobile ? 110 : 130,
            paddingAngle: 3,
            cornerRadius: 8,
            startAngle: -90,
            endAngle: 270,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        height={350}
        margin={
          isMobile
            ? { top: 10, bottom: 100, left: 10, right: 10 }
            : { top: 10, bottom: 10, left: 10, right: 200 }
        }
        slotProps={{
          legend: {
            direction: isMobile ? "horizontal" : "vertical",
            // PERBAIKAN: Hapus semua properti styling manual (labelStyle, markGap, dll)
            // yang menyebabkan error pada elemen <ul>
            position: isMobile
              ? { vertical: "bottom", horizontal: "center" }
              : { vertical: "middle", horizontal: "end" },
          },
        }}
        sx={{
          // --- FIX DARK MODE LEGEND ---
          // Menggunakan selector class spesifik dari MUI Charts
          "& .MuiChartsLegend-label": {
            // PENTING: Gunakan var(--foreground) agar sinkron dengan globals.css
            color: "var(--foreground) !important", // Untuk legend HTML
            fill: "var(--foreground) !important", // Untuk legend SVG (fallback)
            fontSize: "13px !important",
            fontWeight: 600,
          },

          // --- FIX TOOLTIP AGAR SESUAI TEMA ---
          "& .MuiChartsTooltip-root": {
            // Gunakan variable background tema (putih di light, hitam di dark)
            backgroundColor: "var(--background) !important",
            border: "1px solid var(--border) !important",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1) !important",
            borderRadius: "8px !important",
            padding: "8px 12px !important",
          },
          "& .MuiChartsTooltip-table": {
            // Text tooltip mengikuti warna foreground tema
            color: "var(--foreground) !important",
          },
          "& .MuiChartsTooltip-mark": {
            borderRadius: "4px !important",
          },
        }}
      >
        <PieCenterLabel>{menus.length}</PieCenterLabel>
      </PieChart>
    </div>
  );
}
