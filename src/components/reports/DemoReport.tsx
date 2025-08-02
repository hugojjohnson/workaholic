"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  registerables,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Button } from "~/components/ui/button"; // Or replace with a regular button if this errors
import type { ColourType } from "@prisma/client";

const COLOURS = ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "PINK", "PURPLE"] as const;

const borderColours: Record<ColourType, string> = {
  RED: "rgb(255, 99, 132)",
  ORANGE: "rgb(255, 159, 64)",
  YELLOW: "rgb(255, 205, 86)",
  GREEN: "rgb(75, 192, 192)",
  BLUE: "rgb(54, 162, 235)",
  PINK: "rgb(153, 102, 255)",
  PURPLE: "rgb(201, 203, 207)",
};
const backgroundColours: Record<ColourType, string> = {
  RED: "rgba(255, 99, 132, 0.5)",
  ORANGE: "rgba(255, 159, 64, 0.5)",
  YELLOW: "rgba(255, 205, 86, 0.5)",
  GREEN: "rgba(75, 192, 192, 0.5)",
  BLUE: "rgba(54, 162, 235, 0.5)",
  PINK: "rgba(153, 102, 255, 0.5)",
  PURPLE: "rgba(201, 203, 207, 0.5)",
};

// -------------------- Demo Data Setup --------------------

type Subject = {
  id: string;
  name: string;
  colour: ColourType;
};

type Log = {
  startedAt: Date;
  duration: number; // in minutes
  subjectId: string;
};

const projects = ["MATH1061", "COMP2123", "BIOS1167", "PSYC1002"]

const createRandomSubjects = (n: number): Subject[] => {
  return Array.from({ length: n }, (_, i) => ({
    id: `subject-${i}`,
    name: projects[i] ?? `Project ${i + 1}`,
    colour: COLOURS[i % COLOURS.length]!,
  }));
};

const createRandomLogs = (subjects: Subject[], start: Date, end: Date): Log[] => {
  const logs: Log[] = [];
  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    const numLogs = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numLogs; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      logs.push({
        startedAt: new Date(day),
        duration: Math.floor(Math.random() * 120) + 15,
        subjectId: subject?.id ?? "",
      });
    }
  }
  return logs;
};

// -------------------- Main Component --------------------

export default function DemoReport() {
  const [labels, setLabels] = useState<Date[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const goalHours = 4;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin,
    ...registerables,
    MatrixController,
    MatrixElement,
  );
  ChartJS.defaults.color = "#DDD";

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Setup week window
  useEffect(() => {
    const monday = getMonday(new Date());
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(monday.getTime() + i * 86400000));
    }
    setLabels(week);

    const newSubjects = createRandomSubjects(4);
    setSubjects(newSubjects);
    setLogs(createRandomLogs(newSubjects, week[0] ?? new Date(), week[6] ?? new Date()));
  }, []);

  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  function changeWeek(forward: boolean) {
    const offset = forward ? 7 : -7;
    const newStart = new Date(labels[0] ?? "");
    newStart.setDate(newStart.getDate() + offset);
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(newStart.getTime() + i * 86400000));
    }
    setLabels(week);
    setLogs(createRandomLogs(subjects, week[0] ?? new Date(), week[6] ?? new Date()));
  }

  // Chart datasets
  const my_datasets = subjects.map((subject) => {
    const my_data = labels.map((day) => {
      const total = logs
        .filter((log) => log.subjectId === subject.id && isSameDay(log.startedAt, day))
        .reduce((acc, log) => acc + log.duration, 0);
      return total / 60; // Convert to hours
    });

    return {
      label: subject.name,
      data: my_data,
      backgroundColor: backgroundColours[subject.colour],
      borderColor: borderColours[subject.colour],
    };
  });

  const chartData = {
    labels: labels.map((d) => d.toDateString().slice(0, 10)),
    datasets: my_datasets,
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      title: {
        display: false,
      },
      annotation: {
        annotations: {
          goalLine: {
            type: "line",
            yMin: goalHours,
            yMax: goalHours,
            borderColor: "rgba(185, 50, 50, 1)",
            borderDash: [10],
            borderWidth: 1,
          },
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    datasets: {
      bar: {
        borderRadius: 5,
      },
    },
  };

  return (
    <div className="px-0 pt-0 md:px-20">
      <div className="m-0 mx-auto mt-32 max-w-screen-lg md:m-10 md:mx-auto flex flex-col items-center">
        <div className="flex flex-row justify-between w-full gap-2">
          <Button variant="outline" onClick={() => changeWeek(false)}>
            &lt;
          </Button>
          <Button variant="outline" onClick={() => changeWeek(true)}>
            &gt;
          </Button>
        </div>
          <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
