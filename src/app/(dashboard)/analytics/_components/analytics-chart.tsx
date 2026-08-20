"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";

interface AnalyticsChartProps {
  data: {
    name: string;
    tasks: number;
  }[];
}

export const AnalyticsChart = ({ data }: AnalyticsChartProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis 
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.05)" }}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            fontSize: "12px",
            fontWeight: "bold",
            color: "black"
          }}
          itemStyle={{ color: "black" }}
        />
        <Bar 
          dataKey="tasks" 
          fill="currentColor" 
          radius={[4, 4, 0, 0]} 
          className="fill-black dark:fill-white" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
