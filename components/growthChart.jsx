"use client";

import { useMemo, useState, useId, useCallback } from "react";
import { formatCurrency } from "@/utils/formatCurrency";

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 400;
const PADDING = { top: 24, right: 20, bottom: 40, left: 64 };

function formatAxisValue(value) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `R${(value / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `R${(value / 1_000).toFixed(0)}k`;
  }
  return formatCurrency(value);
}

function sampleData(data, maxPoints = 120) {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter(
    (_, index) => index % step === 0 || index === data.length - 1,
  );
}

function buildLinePath(points) {
  if (points.length === 0) return "";
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function formatMonthYear(dateString) {
  return new Date(dateString).toLocaleDateString("en-ZA", {
    month: "short",
    year: "numeric",
  });
}

export default function GrowthChart({ calculatedData, inflationRate }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const chartLabelId = useId();

  const sampled = useMemo(
    () => sampleData(calculatedData),
    [calculatedData],
  );

  const chart = useMemo(() => {
    const plotWidth = VIEW_WIDTH - PADDING.left - PADDING.right;
    const plotHeight = VIEW_HEIGHT - PADDING.top - PADDING.bottom;

    const balanceValues = sampled.map((d) => d.balance);
    const inflationValues =
      inflationRate > 0 ? sampled.map((d) => d.balanceAfterInflation) : [];
    const allValues = [...balanceValues, ...inflationValues];
    const minY = Math.min(...allValues, 0);
    const maxY = Math.max(...allValues, 1);
    const yRange = maxY - minY || 1;

    const toPoint = (entry, index, key) => ({
      x: PADDING.left + (index / Math.max(sampled.length - 1, 1)) * plotWidth,
      y:
        PADDING.top +
        plotHeight -
        ((entry[key] - minY) / yRange) * plotHeight,
      entry,
      index,
    });

    const balancePoints = sampled.map((entry, index) =>
      toPoint(entry, index, "balance"),
    );
    const inflationPoints =
      inflationRate > 0
        ? sampled.map((entry, index) =>
            toPoint(entry, index, "balanceAfterInflation"),
          )
        : [];

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => {
      const value = minY + yRange * fraction;
      return {
        value,
        y: PADDING.top + plotHeight - fraction * plotHeight,
        label: formatAxisValue(value),
      };
    });

    const xTickCount = Math.min(6, sampled.length);
    const xTicks = Array.from({ length: xTickCount }, (_, tickIndex) => {
      const dataIndex = Math.round(
        (tickIndex / Math.max(xTickCount - 1, 1)) * (sampled.length - 1),
      );
      const entry = sampled[dataIndex];
      return {
        x:
          PADDING.left +
          (dataIndex / Math.max(sampled.length - 1, 1)) * plotWidth,
        label: new Date(entry.date).getFullYear().toString(),
      };
    });

    return {
      balancePoints,
      inflationPoints,
      yTicks,
      xTicks,
      plotWidth,
      plotHeight,
    };
  }, [sampled, inflationRate]);

  const finalBalance = calculatedData[calculatedData.length - 1]?.balance ?? 0;
  const startYear = new Date(calculatedData[0]?.date).getFullYear();
  const endYear = new Date(
    calculatedData[calculatedData.length - 1]?.date,
  ).getFullYear();

  const handlePointerMove = useCallback(
    (event) => {
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      const relativeX =
        ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH;
      const plotX = relativeX - PADDING.left;
      const ratio = plotX / chart.plotWidth;
      const index = Math.round(
        ratio * Math.max(chart.balancePoints.length - 1, 0),
      );
      const clamped = Math.max(
        0,
        Math.min(index, chart.balancePoints.length - 1),
      );
      setHoverIndex(clamped);
    },
    [chart.plotWidth, chart.balancePoints.length],
  );

  const hoverPoint =
    hoverIndex !== null ? chart.balancePoints[hoverIndex] : null;

  return (
    <div>
      <div
        role="img"
        aria-labelledby={chartLabelId}
        className="h-[250px] sm:h-[300px] md:h-[400px] print:h-[220px] motion-reduce:[&_*]:!transition-none"
      >
        <p id={chartLabelId} className="sr-only">
          Investment growth chart from {startYear} to {endYear}. Final balance{" "}
          {formatCurrency(finalBalance)}.
        </p>
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-full w-full"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
          aria-hidden="true"
        >
          {chart.yTicks.map((tick) => (
            <g key={tick.label}>
              <line
                x1={PADDING.left}
                x2={VIEW_WIDTH - PADDING.right}
                y1={tick.y}
                y2={tick.y}
                className="stroke-border"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={PADDING.left - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[11px]"
              >
                {tick.label}
              </text>
            </g>
          ))}

          <path
            d={buildLinePath(chart.balancePoints)}
            fill="none"
            className="stroke-[hsl(var(--chart-1))]"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {chart.inflationPoints.length > 0 && (
            <path
              d={buildLinePath(chart.inflationPoints)}
              fill="none"
              className="stroke-[hsl(var(--chart-2))]"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {chart.xTicks.map((tick) => (
            <text
              key={tick.label + tick.x}
              x={tick.x}
              y={VIEW_HEIGHT - 12}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {tick.label}
            </text>
          ))}

          {hoverPoint && (
            <>
              <line
                x1={hoverPoint.x}
                x2={hoverPoint.x}
                y1={PADDING.top}
                y2={PADDING.top + chart.plotHeight}
                className="stroke-muted-foreground"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <circle
                cx={hoverPoint.x}
                cy={hoverPoint.y}
                r={5}
                className="fill-[hsl(var(--chart-1))]"
              />
            </>
          )}
        </svg>
      </div>

      {hoverPoint && (
        <div
          className="mt-2 rounded-md border bg-background px-3 py-2 text-sm shadow-sm print:hidden"
          aria-live="polite"
        >
          <div className="font-medium">
            {formatMonthYear(hoverPoint.entry.date)}
          </div>
          <div>
            Balance: {formatCurrency(hoverPoint.entry.balance)}
          </div>
          {inflationRate > 0 && (
            <div className="text-muted-foreground">
              Today&apos;s value:{" "}
              {formatCurrency(hoverPoint.entry.balanceAfterInflation)}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-0.5 w-6 bg-[hsl(var(--chart-1))]"
            aria-hidden="true"
          />
          Investment growth
        </div>
        {inflationRate > 0 && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-0.5 w-6 bg-[hsl(var(--chart-2))]"
              aria-hidden="true"
            />
            Inflation adjusted
          </div>
        )}
      </div>

    </div>
  );
}
