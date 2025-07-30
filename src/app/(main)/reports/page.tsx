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
import { useUser } from "~/hooks/UserContext";
import { useLogs } from "~/hooks/LogsContext";
import type { ColourType } from "@prisma/client";
import { Button } from "~/components/ui/button";
import LoadingPage from "~/components/welcome/LoadingPage";
import Heatmap from "~/components/reports/Heatmap";

// TODO: Purple is actually grey here!!
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

export default function Reports() {
  const { user } = useUser();
  const logs = useLogs();
  const [labels, setLabels] = useState<Date[]>([]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin,
  );
  ChartJS.register(...registerables);
  ChartJS.register(MatrixController, MatrixElement);
  ChartJS.defaults.color = "#DDD";

  // Set up labels
  useEffect(() => {
    if (logs.logs.length === 0) {
      return;
    }
    if (labels.length !== 0) {
      return;
    }
    const labels2 = structuredClone(labels);
    // Set up the relevant date window
    let monday = new Date(Date.now());
    while (monday.getDay() !== 1) {
      monday = new Date(monday.getTime() - 86400000);
    }
    for (let i = 0; i < 7; i++) {
      labels2.push(new Date(monday));
      monday.setDate(monday.getDate() + 1);
    }
    setLabels(labels2);
  }, [labels, logs.logs]);

  function changeWeek(forward: boolean) {
    const tempWindow: Date[] = [];
    // Set up the relevant date window
    let monday = new Date(
      labels[0]!.getTime() + 7 * 24 * 60 * 60_000 * (forward ? 1 : -1),
    ); // TODO: Sus
    while (monday.getDay() !== 1) {
      monday = new Date(monday.getTime() - 86400000);
    }
    for (let i = 0; i < 7; i++) {
      tempWindow.push(new Date(monday));
      monday.setDate(monday.getDate() + 1);
    }
    setLabels(tempWindow);
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // const sortedLogs = user.logs.sort((a, b) => a.timeStarted > b.timeStarted ? 1 : -1)

  // Construct datasets
  const my_datasets = [];
  if (!user) {
    return <LoadingPage />;
  }
  for (const project of user.subjects) {
    const projectLogs = logs.logs.filter((idk) => idk.subjectId === project.id);
    const my_data = [];
    for (const myDay of labels) {
      const sameDayLogs = projectLogs.filter((idk) =>
        isSameDay(new Date(idk.startedAt), new Date(myDay)),
      );
      let x = 0;
      for (const sameDayLog of sameDayLogs) {
        x += sameDayLog.duration;
      }
      my_data.push(x / 60);
    }
    // TODO: Type checking here
    my_datasets.push({
      label: project.name,
      data: my_data,
      backgroundColor: backgroundColours[project.colour as ColourType],
      borderColor: borderColours[project.colour as ColourType],
    });
  }

  const data = {
    labels: labels.map((idk) =>
      idk.toLocaleString().split(",")[0]?.slice(0, -5),
    ),
    datasets: my_datasets,
  };
  let totalMinutes = 0;
  for (const log of logs.logs) {
    totalMinutes += log.duration;
  }

  // const daysPassed = Math.ceil((new Date().getTime() - new Date("2024-02-19").getTime()) / (24 * 60 * 60 * 1_000))

  const stats: [string, number, number][] = [
    ["Total hours", Math.round((totalMinutes / 60) * 10) / 10, 0],
    ["Total intervals", logs.logs.length, 1],
    [logs.funFact.title, logs.funFact.number, 2],
    // ["Average daily hours", Math.round(totalMinutes / (60 * daysPassed) * 10) / 10, 0]
  ];

  const statsHTML = (info: [string, number, number]) => {
    return (
      <div
        key={info[0]}
        className={`flex flex-col items-center gap-1 ${info[2] === 0 ? "hidden md:block md:opacity-100" : ""}`}
      >
        <h3 className="text-lg">{info[0]}</h3>
        <p className="text-2xl text-[#4da88d]">{info[1]}</p>
      </div>
    );
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.5)", // Change this to your desired text color
        },
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
        color: "rgba(255, 255, 255, 0.5)", // Change this to your desired text color
      },
      annotation: {
        annotations: {
          box1: {
            //     // Indicates the type of annotation
            type: "line",
            yMin: user.preferences.goal,
            yMax: user.preferences.goal,
            borderColor: "rgba(185, 50, 50, 1)",
            borderDash: [10],
            borderWidth: 1,
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    datasets: {
      bar: {
        borderRadius: 5,
      },
    },
  };

  // Fingers crossed this works
  const lastMonday = new Date(
    new Date().setDate(
      new Date().getDate() - ((new Date().getDay() + 6) % 7) - 3,
    ),
  );
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + 100);

  return (
    <div className="px-7 pt-10 md:px-32">
      <h1 className="mb-5 text-4xl">Reports</h1>
      <div className="flex flex-row justify-around text-center">
        {stats.map((idk) => statsHTML(idk))}
      </div>
      <div className="m-0 mx-auto mt-32 max-w-screen-lg md:m-10 md:mx-auto">
        <div className="flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => changeWeek(false)}>
            &lt;
          </Button>
          <Button variant="outline" onClick={() => changeWeek(true)}>
            &gt;
          </Button>
        </div>

        <Bar options={options} data={data} />
        <div className="flex items-center justify-center">
          <div className="my-20 w-[600px]">
            <Heatmap startDate={lastMonday} endDate={end} />
          </div>
        </div>
      </div>
    </div>
  );
}
