"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

interface PopularChartProps {
  data: { name: string; count: number }[];
}

const rankColors = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#6366f1"];

export function PopularProductsChart({ data }: PopularChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='h-[350px] flex flex-col items-center justify-center text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50'>
        <p>Belum ada data interaksi menu.</p>
      </div>
    );
  }

  const rankedData = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      nameWithRank: `${index + 1}. ${item.name}`,
    }));
  }, [data]);

  return (
    <div className='w-full overflow-x-auto pb-4 text-zinc-900 dark:text-zinc-100'>
      <div className='h-[350px] min-w-[500px] md:min-w-0 md:w-full'>
        <BarChart
          dataset={rankedData}
          yAxis={[
            {
              scaleType: "band",
              dataKey: "nameWithRank",
              categoryGapRatio: 0.4,
              barGapRatio: 0.1,
            },
          ]}
          xAxis={[
            {
              label: "Jumlah Pesanan",
              tickMinStep: 1,
            },
          ]}
          series={[
            {
              dataKey: "count",
              label: "Jumlah Pesanan",
              valueFormatter: (value) => `${value} kali`,
            },
          ]}
          barLabel='value'
          layout='horizontal'
          grid={{ vertical: true }}
          height={350}
          margin={{ left: 150, right: 20, top: 20, bottom: 50 }}
          borderRadius={4}
          sx={{
            // 1. FIX WARNA TEKS SUMBU (Axis Labels)
            [`.${axisClasses.left} .${axisClasses.label}`]: {
              transform: "translate(-10px, 0)",
              fontWeight: 600,
              fontSize: "13px",
            },
            "& .MuiChartsAxis-tickLabel": {
              fill: "currentColor !important",
              fontSize: "12px !important",
              fontWeight: 500,
            },
            "& .MuiChartsAxis-label": {
              fill: "currentColor !important",
              fontWeight: "bold",
            },

            // 2. GARIS & GRID
            "& .MuiChartsAxis-line": {
              stroke: "currentColor !important",
              strokeOpacity: 0.2,
            },
            "& .MuiChartsAxis-tick": {
              stroke: "currentColor !important",
              strokeOpacity: 0.2,
            },
            "& .MuiChartsGrid-line": {
              stroke: "currentColor !important",
              strokeOpacity: 0.1,
            },

            // 3. BAR STYLING
            "& .MuiBarElement-series-auto-generated-id-0:nth-of-type(1)": {
              fill: rankColors[0],
            },
            "& .MuiBarElement-series-auto-generated-id-0:nth-of-type(2)": {
              fill: rankColors[1],
            },
            "& .MuiBarElement-series-auto-generated-id-0:nth-of-type(3)": {
              fill: rankColors[2],
            },
            "& .MuiBarElement-series-auto-generated-id-0:nth-of-type(4)": {
              fill: rankColors[3],
            },
            "& .MuiBarElement-series-auto-generated-id-0:nth-of-type(5)": {
              fill: rankColors[4],
            },

            "& rect": { fillOpacity: 0.9, transition: "all 0.3s ease" },
            "& rect:hover": {
              fillOpacity: 1,
              filter: "brightness(1.1)",
              cursor: "pointer",
            },

            // 4. BAR VALUE LABEL (Angka di ujung batang)
            "& .MuiBarLabel-root": {
              fill: "currentColor !important",
              fontSize: "12px",
              fontWeight: "bold",
            },

            // 5. TOOLTIP FIX
            "& .MuiChartsTooltip-root": {
              backgroundColor: "rgba(255, 255, 255, 0.95) !important",
              border: "1px solid #e4e4e7 !important",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1) !important",
              borderRadius: "8px !important",
            },
            "& .MuiChartsTooltip-table": {
              color: "#18181b !important",
            },
          }}
        />
      </div>
    </div>
  );
}
