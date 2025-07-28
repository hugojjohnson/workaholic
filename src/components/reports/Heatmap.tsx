import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { useLogs } from '~/hooks/LogsContext';
import 'react-calendar-heatmap/dist/styles.css';
import '~/styles/heatmap.css';
import { useUser } from '~/hooks/UserContext';


type Props = {
  startDate: Date;
  endDate: Date;
};


// startedAt: string; // ISO date string, e.g. '2024-07-28T15:30:00Z'
//   duration: number;  // in minutes (or seconds, whatever you got)

const Heatmap: React.FC<Props> = ({ startDate, endDate }) => {
  const { logs } = useLogs();
  const { user } = useUser();
  // Step 1: Aggregate logs by date string (YYYY-MM-DD)
  const countsByDate: Record<string, number> = {};

  logs.forEach(({ startedAt, duration }) => {
    const date = startedAt.toISOString().slice(0, 10); // quick YYYY-MM-DD from ISO string
    countsByDate[date] = (countsByDate[date] || 0) + duration;
  });

  // Step 2: Convert aggregated map to array format react-calendar-heatmap wants
  const values = Object.entries(countsByDate).map(([date, count]) => ({
    date: new Date(new Date(date).setDate(new Date(date).getDate() - 1)).toISOString().slice(0, 10),
    count: Math.min(Math.floor(count/(user?.preferences.goal ?? 1) * 5 / 60 + 0.5), 4), // TODO: Could be better
  }));

  console.log(values)

  return (
    <CalendarHeatmap
      startDate={startDate}
      endDate={endDate}
      values={values}
      // classForValue={(value) => {
      //   if (!value || !value.count) return 'color-empty';
      //   const intensity = Math.floor((value.count / 1) * 4); // 0 to 4 scale
      //   return `color-scale-${intensity}`;
      // }}
      // You can add optional props like:
      classForValue={(value) => value?.count ? `color-github-${value.count}` : 'color-empty'}
      // showWeekdayLabels
    />
  );
};

export default Heatmap;
