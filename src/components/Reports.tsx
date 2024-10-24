import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors, ChartOptions, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import useUser from '../hooks/useUser';



export default function Reports(): React.ReactElement {
    const [user] = useUser()
    const [labels, setLabels] = useState<Date[]>([])

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors, annotationPlugin);
    ChartJS.register(...registerables);
    ChartJS.register(MatrixController, MatrixElement);
    ChartJS.defaults.color = '#DDD';

    // Set up labels
    useEffect(() => {
        if (user.logs.length === 0) {
            return
        }
        if (labels.length !== 0) { return }
        const labels2 = structuredClone(labels)
        // Set up the relevant date window
        let monday = new Date(Date.now());
        while (monday.getDay() !== 1) {
            monday = new Date(monday.getTime() - 86400000)
        }
        for (let i = 0; i < 7; i++) {
            labels2.push(new Date(monday))
            monday.setDate(monday.getDate() + 1);
        }
        setLabels(labels2)
    }, [labels, user.logs])

    function changeWeek(forward: boolean) {
        const tempWindow: Date[] = []
        // Set up the relevant date window
        let monday = new Date(labels[0].getTime() + 7 * 24 * 60 * 60_000 * (forward ? 1 : -1))
        while (monday.getDay() !== 1) {
            monday = new Date(monday.getTime() - 86400000)
        }
        for (let i = 0; i < 7; i++) {
            tempWindow.push(new Date(monday))
            monday.setDate(monday.getDate() + 1);
        }
        setLabels(tempWindow)
    }

    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()


    // const sortedLogs = user.logs.sort((a, b) => a.timeStarted > b.timeStarted ? 1 : -1)

    // Construct datasets
    const my_datasets = []
    for (const project of user.projects) {
        console.log(project)
        console.log(user.logs)
        const projectLogs = user.logs.filter(idk => idk.project === project)
        console.log(projectLogs)
        let my_data = []
        for (const myDay of labels) {
            const sameDayLogs = projectLogs.filter(idk => isSameDay(new Date(idk.timeStarted), new Date(myDay)))
            let x = 0
            for (const sameDayLog of sameDayLogs) { x += sameDayLog.duration }
            my_data.push(x / 60)
        }
        my_datasets.push({ label: project, data: my_data })
    }

    const data = { labels: labels.map(idk => idk.toLocaleString().split(",")[0].slice(0, -5)), datasets: my_datasets }
    let totalMinutes = 0
    for (const log of user.logs) {
        totalMinutes += log.duration
    }

    // function getStreak() {
    //     if (user.logs.length === 0) {
    //         return 0
    //     }
    //     // Get streak, starting from today, but today isn't really necessary.
    //     const sortedDateList = user.logs.map(idk => new Date(idk.timeStarted).getTime()).sort().reverse()
    //     const today = new Date();
    //     // yesterday.setDate(yesterday.getDate() - 1);
    //     today.setHours(0, 0, 0, 0);
    //     let streak = 0
    //     // Handle today: special case
    //     const coolThingLol = new Date(sortedDateList[0])
    //     coolThingLol.setHours(0, 0, 0, 0)
    //     if (today.getTime() === coolThingLol.getTime()) {
    //         streak += 1
    //     }
    //     today.setDate(today.getDate() - 1);
    //     for (let i = 0; i < sortedDateList.length; i++) {
    //         const currentDate = new Date(sortedDateList[i]);
    //         currentDate.setHours(0, 0, 0, 0);
    //         if (currentDate.getTime() === today.getTime()) {
    //             streak++;
    //             today.setDate(today.getDate() - 1);
    //         }
    //     }
    //     return streak
    // }

    // const streak = getStreak()
    const streak = 0


    // const daysPassed = Math.ceil((new Date().getTime() - new Date("2024-02-19").getTime()) / (24 * 60 * 60 * 1_000))

    const stats: [string, number, number][] = [
        ["Total hours", Math.round(totalMinutes / 60 * 10) / 10, 0],
        ["Total intervals", user.logs.length, 1],
        ["Streak", streak, 1],
        // ["Average daily hours", Math.round(totalMinutes / (60 * daysPassed) * 10) / 10, 0]

    ]

    const statsHTML = (info: [string, number, number]) => {
        return <div key={info[0]} className={`flex flex-col gap-1 items-center ${info[2] === 0 ? "hidden md:block md:opacity-100" : ""}`}>
            <h3 className='text-lg'>{info[0]}</h3>
            <p className='text-2xl text-[#4da88d]'>{info[1]}</p>
        </div>
    }

    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: 'rgba(255, 255, 255, 0.5)', // Change this to your desired text color
                }
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
                color: 'rgba(255, 255, 255, 0.5)', // Change this to your desired text color
            },
            annotation: {
                annotations: {
                    box1: {
                    //     // Indicates the type of annotation
                        type: "line",
                        yMin: 3,
                        yMax: 3,
                        borderColor: 'rgba(185, 50, 50, 1)',
                        borderDash: [10],
                        borderWidth: 1
                    }
                }
            }
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
                borderRadius: 5
            }
        }
    };

    return <div className='px-7 md:px-32 pt-10'>
        <h1 className="text-4xl mb-5">Reports</h1>
        <div className='flex flex-row justify-around text-center'>
            {
                stats.map(idk => statsHTML(idk))
            }
        </div>
        <div className='mx-auto m-0 md:m-10 md:mx-auto mt-32 max-w-screen-lg'>
            <div className='flex flex-row justify-end gap-2'>
                <button className='px-2 bg-gray-700 rounded-md text-center' onClick={() => changeWeek(false) }>&lt;</button>
                <button className='px-2 bg-gray-700 rounded-md text-center' onClick={() => changeWeek(true)}>&gt;</button>
            </div>
            <div className='w-10 h-10 bg-[rgba(54,162,235,0.5)]'>hu</div>

            <Bar options={options} data={data} />
        </div>
    </div>
}