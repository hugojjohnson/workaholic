"use client";

import React from 'react';
import CalendarHeatmap, { type TooltipDataAttrs } from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import 'react-calendar-heatmap/dist/styles.css';
import { formatDateAU } from './Heatmap';

const demoEndDate = new Date("2026-01-01T00:00:00.000Z");

export default function DemoHeatmap() {
  const randomValues = getRange(200).map(index => {
  const date = shiftDate(demoEndDate, -index);
  const count = getDeterministicInt(index, 1, 3);
  return {
    date,
    count,
    tooltip: `${formatDateAU(date)} | ${count} hours`,
  };
});
  return (
    <div className='md:px-10 mt-20'>
      <CalendarHeatmap
        startDate={shiftDate(demoEndDate, -150)}
        endDate={demoEndDate}
        values={randomValues}
        classForValue={value => {
          if (!value) {
            return 'color-empty';
          }
          return `color-github-${value.count as number}`;
        }}
        tooltipDataAttrs={(value): TooltipDataAttrs => {
          return {
            "data-tooltip-id": "demo-tooltip",
            "data-tooltip-content": value?.tooltip as string ?? "",
          } as TooltipDataAttrs;
        }}
        showWeekdayLabels={true}
      />
      <Tooltip id="demo-tooltip" />
    </div>
  );
}

function shiftDate(date: Date | string, numDays: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

function getRange(count: number) {
  return Array.from({ length: count }, (_, i) => i);
}

function getDeterministicInt(seed: number, min: number, max: number): number {
  return (seed % (max - min + 1)) + min;
}
