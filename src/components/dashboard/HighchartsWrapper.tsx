"use client";

import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface HighchartsWrapperProps {
  options: Highcharts.Options;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export default function HighchartsWrapper({
  options,
  containerProps,
}: HighchartsWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure chart reflows smoothly when window or sidebar resizes
  useEffect(() => {
    if (mounted && chartComponentRef.current && chartComponentRef.current.chart) {
      chartComponentRef.current.chart.reflow();
    }
  }, [mounted, options]);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center">
        <div className="h-7 w-7 rounded-full border-2 border-[#FFA500] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div {...containerProps} className={`w-full h-full ${containerProps?.className || ""}`}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        containerProps={{ style: { height: "100%", width: "100%" } }}
      />
    </div>
  );
}
