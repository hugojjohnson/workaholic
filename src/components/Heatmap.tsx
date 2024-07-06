import { Chart as ChartJS } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

import { Log } from '../Interfaces';

export function Heatmap({ logs, projects }: { logs: Log[], projects: string[]}) {

    ChartJS.register(MatrixController, MatrixElement);


    // // Aggregate the logs into minute intervals
    // const heatmapData = {};

    // logs.forEach(log => {
    //     const currentTime = new Date(log.timeStarted);

    //     while (currentTime <= log.timeFinished) {
    //         const hour = currentTime.getHours();
    //         const minute = currentTime.getMinutes();
    //         const key = `${hour}:${minute}`;

    //         if (!heatmapData[key]) {
    //             heatmapData[key] = 0;
    //         }
    //         heatmapData[key]++;

    //         currentTime.setMinutes(currentTime.getMinutes() + 1);
    //     }
    // });

    // const data = {
    //     labels: Array.from({ length: 24 * 60 }, (_, i) => {
    //         const hour = Math.floor(i / 60);
    //         const minute = i % 60;
    //         return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
    //     }),
    //     datasets: [{
    //         label: 'Heatmap',
    //         data: Object.keys(heatmapData).map(key => {
    //             const [hour, minute] = key.split(':').map(Number);
    //             return {
    //                 x: hour * 60 + minute,
    //                 y: 0,
    //                 v: heatmapData[key]
    //             };
    //         })
    //     }]
    // };

    // const options = {
    //     scales: {
    //         x: {
    //             type: 'linear',
    //             position: 'bottom',
    //             min: 0,
    //             max: 24 * 60 - 1,
    //             ticks: {
    //                 callback: (value) => {
    //                     const hour = Math.floor(value / 60);
    //                     const minute = value % 60;
    //                     return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
    //                 },
    //                 stepSize: 60 // Display one tick per hour
    //             }
    //         },
    //         y: {
    //             type: 'linear',
    //             position: 'left',
    //             min: -1,
    //             max: 1,
    //             display: false
    //         }
    //     },
    //     plugins: {
    //         legend: {
    //             display: false
    //         },
    //         tooltip: {
    //             callbacks: {
    //                 label: function (context) {
    //                     const hour = Math.floor(context.raw.x / 60);
    //                     const minute = context.raw.x % 60;
    //                     return `Time: ${hour}:${minute < 10 ? '0' : ''}${minute}, Count: ${context.raw.v}`;
    //                 }
    //             }
    //         }
    //     }
    // };

    // const ctx = document.getElementById('myChart').getContext('2d');
    // new Chart(ctx, {
    //     type: 'matrix',
    //     data: data,
    //     options: options
    // });

    return <p>hi</p>
}