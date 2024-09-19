// import { PieChart } from 'react-minimal-pie-chart';

// const myColours = ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)']
// const dataPie = user.projects.map((idk, index) => {
//     return {
//         title: `${idk}: ${Math.round((user.logs.filter(hm => hm.project === idk).reduce((sum, ah) => sum + ah.duration, 0)) / 6) / 10}`,
//         value: user.logs.filter(hm => hm.project === idk).reduce((sum, ah) => sum + ah.duration, 0),
//         color: myColours[index]
//     }
// })

// <PieChart
//     data={dataPie || []}
//     label={({ dataEntry }) => dataEntry.title}
//     labelStyle={{
//         fontSize: '5px',
//         fontFamily: 'sans-serif',
//     }}
//     viewBoxSize={[100, 100]}
// />