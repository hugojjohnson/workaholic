import React from "react";
import CalendarHeatmap, { type TooltipDataAttrs } from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import { useLogs } from "~/hooks/LogsContext";
import "react-calendar-heatmap/dist/styles.css";
import "~/styles/heatmap.css";
import { useUser } from "~/hooks/UserContext";


function formatDateAU(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

// startedAt: string; // ISO date string, e.g. '2024-07-28T15:30:00Z'
//   duration: number;  // in minutes (or seconds, whatever you got)
const Heatmap: React.FC = () => {
  const { logs } = useLogs();
  const { user } = useUser();

  const startDate = user?.preferences.semesterStart ?? new Date();
  const endDate = user?.preferences.semesterFinish ?? new Date();
  console.log("--")
  console.log(startDate.toISOString().slice(0, 10))
  console.log(endDate.toISOString().slice(0, 10))
  console.log("--")

  // Step 1: Aggregate logs by date string (YYYY-MM-DD)
  const countsByDate: Record<string, number> = {};

  logs.forEach(({ startedAt, duration }) => {
    const date = startedAt.toISOString().slice(0, 10); // quick YYYY-MM-DD from ISO string
    countsByDate[date] = (countsByDate[date] ?? 0) + duration;
  });

  // Step 2: Fill in all dates with 0 if they don't exist in logs
  const allDates: { date: string; count: number; tooltip: string }[] = [];
  const current = new Date(startDate);


  while (current <= endDate) {
    const isoDate = current.toISOString().slice(0, 10);
    const rawCount = countsByDate[isoDate] ?? 0;

    let tooltip = formatDateAU(current);
    if (rawCount > 0) {
      tooltip += " |";
      if (rawCount > 60) {
        tooltip += " " + Math.floor(rawCount / 60) + "hr";
      }
      if (rawCount % 60 !== 0) {
        tooltip += " " + Math.floor(rawCount % 60) + "min";
      }
    }

    allDates.push({
      date: isoDate,
      count: Math.min(
        Math.floor(((rawCount / (user?.preferences.goal ?? 1)) * 5) / 60 + 0.5),
        4,
      ),
      tooltip,
    });

    current.setDate(current.getDate() + 1);
  }

  console.log(allDates);

  return (
    <>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={allDates}
        // You can add optional props like:
        classForValue={(value) =>
          value?.count ? `color-github-${value.count}` : "color-empty"
        }
        // showMonthLabels={false}  // <- THIS hides the months
        // showWeekdayLabels
        tooltipDataAttrs={(value): TooltipDataAttrs => {
          const tooltipContent = typeof value?.tooltip === "string" ? value.tooltip : "";
          return {
            "data-tooltip-id": "my-tooltip",
            "data-tooltip-content": tooltipContent,
          } as TooltipDataAttrs;
        }}
      />
      <Tooltip id="my-tooltip" />
    </>
  );
};

export default Heatmap;
