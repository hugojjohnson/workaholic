// Heatmap2.tsx
import { useEffect, useRef } from 'react';
import { Log } from '../Interfaces';
import { TooltipItem } from 'chart.js';


export function Heatmap2({ chart, logs }: { chart: any, logs: Log[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<typeof chart | null>(null);

    const xLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const yLabels = ["12:00 am", "1:00 am", "2:00 am", "3:00 am", "4:00 am", "5:00 am", "6:00 am", "7:00 am",
        "8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm",
        "5:00 pm", "6:00 pm", "7:00 pm", "8:00 pm", "8:00 pm", "10:00 pm", "11:00 pm",
    ];


    useEffect(() => {
        const logs2 = [logs[0]]
        console.log(logs2)
        const myTest = new Date(logs2[0].timeStarted)
        console.log((myTest.getHours() + (myTest.getMinutes() / 60) + 16) % 24,)
        if (canvasRef.current) {
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            interface MatrixTooltipItem extends TooltipItem<'matrix'> {
                raw: {
                    x: number;
                    y: number;
                    h: number;
                    log: Log;
                };
            }

            chartRef.current = new chart(canvasRef.current, {
                type: 'matrix',
                data: {
                    datasets: [{
                        label: 'My Heatmap2',
                        data: logs.map(log => {
                            const myDay = new Date(log.timeStarted)
                            return {
                                x: myDay.getDay() + (myDay.getDay() === 0 ? 7 : 0),
                                y: (myDay.getHours() + (myDay.getMinutes() / 60)+3),
                                h: log.description === "[notes]" ? 0 : log.duration,
                                log: log
                            }
                        }),
                        backgroundColor: () => {
                            return `rgba(0, 0, 255, ${0.05})`;
                        },
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                        // width: (context) => context.chart.chartArea.width / 3 - 2,
                        width: 130,
                        height: (context: MatrixTooltipItem) => {
                            return context.raw.h
                        },
                        hoverBackgroundColor: 'rgba(0, 0, 255, 0.8)',
                        hoverBorderColor: 'rgba(0, 0, 0, 0.8)',
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'linear',
                            offset: false,
                            ticks: {
                                max: 2,
                                stepSize: 1,
                                callback:((value: number) => xLabels[value-1])
                            },
                        },
                        y: {
                            type: 'linear',
                            offset: false,
                            ticks: {
                                max: 2,
                                stepSize: 1,
                                callback: ((value: number) => yLabels[value])
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context: MatrixTooltipItem) => {
                                    const myDay = new Date(context.raw.log.timeStarted)
                                    return `${(myDay.getHours())} + ${(myDay.getMinutes() / 60)} = ${(myDay.getHours() + (myDay.getMinutes() / 60))}`
                                }
                            }
                        }
                    }
                }
            });
        }
        // Clean up the chart instance on unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return <canvas ref={canvasRef} />;
}

export default Heatmap2;
