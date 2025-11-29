"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const uData = [45, 80, 120, 90, 150, 200, 170];
const xLabels = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export function TrafficChart() {
  return (
    <div className='w-full h-[350px] flex items-center justify-center'>
      <BarChart
        height={350}
        series={[
          {
            data: uData,
            label: "Pengunjung",
            color: "#3b82f6", // Menggunakan warna Biru cerah (Blue-500)
            id: "uvId",
          },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
        grid={{ horizontal: true }}
        borderRadius={6}
        sx={{
          // Efek Hover pada batang
          "& .MuiBarElement-root:hover": {
            fill: "#2563eb", // Biru lebih gelap saat hover
            cursor: "pointer",
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
          },
          // Warna teks label
          "& .MuiChartsAxis-tickLabel": {
            fill: "currentColor !important",
          },
        }}
        className='text-zinc-600 dark:text-zinc-400'
      />
    </div>
  );
}
