// import React, { useEffect, useState } from 'react';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors, ChartOptions, registerables } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import annotationPlugin from 'chartjs-plugin-annotation';
// import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
// import useUser from '../../hooks/useUser';


// export default function DashboardChart(): React.ReactElement {
//     const [user] = useUser()
//     const [labels, setLabels] = useState<string[]>([])
//     const [data, setData] = useState<{labels: string[], datasets: {label: string, data: number[]}[]}>({ labels: [], datasets: []})

//     ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors, annotationPlugin);
//     ChartJS.register(...registerables);
//     ChartJS.register(MatrixController, MatrixElement);
//     ChartJS.defaults.color = '#DDD';

//     // Set up labels
//     useEffect(() => {
//         if (user.logs.length === 0) {
//             return
//         }
//         if (labels.length !== 0) { return }
//         setLabels(user.projects)

//         const same_week_logs = user.logs.filter(idk => (new Date().getTime() - new Date(idk.timeStarted).getTime()) / (24 * 60 * 60_000) < 7)

//         // Construct datasets
//         const my_data = []
//         for (let i = 0; i < user.projects.length; i++) {
//             const projectLogs = same_week_logs.filter(idk => idk.project === user.projects[i])

//             let x: number[] = new Array(user.projects.length).fill(0);
//             for (const projectLog of projectLogs) { x[i] += projectLog.duration/60 }
//             my_data.push({ label: user.projects[i], data: x })
//         }
//         setData({ labels: user.projects, datasets: my_data })
//     }, [labels, user.logs])

//     console.log(data)

//     const options: ChartOptions<'bar'> = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: "top",
//                 labels: {
//                     color: 'rgba(255, 255, 255, 0.5)', // Change this to your desired text color
//                 }
//             },
//             title: {
//                 display: false,
//                 text: 'Chart.js Bar Chart',
//                 color: 'rgba(255, 255, 255, 0.5)', // Change this to your desired text color
//             },
//             annotation: {
//                 annotations: {
//                     box1: {
//                         //     // Indicates the type of annotation
//                         type: "line",
//                         yMin: 3,
//                         yMax: 3,
//                         borderColor: 'rgba(185, 50, 50, 1)',
//                         borderDash: [10],
//                         borderWidth: 1
//                     }
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 stacked: true,
//             },
//             y: {
//                 stacked: true,
//             },
//         },
//         datasets: {
//             bar: {
//                 borderRadius: 5
//             }
//         }
//     };

//     return <div className='px-7 pt-10'>
//         <h1 className="text-4xl mb-5">Reports</h1>
//         {/* <div className='w-full mx-auto m-0 md:m-10 md:mx-auto mt-32 max-w-screen-lg'> */}
//         <div className='w-full'>
//             <Bar options={options} data={data} />
//         </div>
//     </div>
// }