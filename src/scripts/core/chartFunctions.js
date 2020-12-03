import Chart from "chart.js";

export function createGraph({ x, y }, type) {
	console.log({ x, y });
	const chartCanvas = document?.getElementById("chartCanvas")?.getContext("2d");

	Chart.defaults.global.defaultFontSize = 11;

	new Chart(chartCanvas, {
		type: type || "line",
		data: {
			labels: x,
			datasets: [
				{
					label: "Minutes worked",
					data: y,
					backgroundColor: Array(x.length).fill("rgba(73, 89, 197, 0.6)"),
					borderColor: Array(x.length).fill("rgba(73, 89, 197, 1.0)"),
					borderWidth: 1,
					pointBorderWidth: 0,
					pointRadius: 1,
				},
			],
		},
		options: {
			showLines: true,
			legend: {
				display: true,
				position: "bottom",
			},
			scales: {
				yAxes: [
					{
						display: true,
						gridLines: {
							display: true,
							color: "rgba(255, 255, 255, 0.1)",
						},
						ticks: {
							stepSize: 60,
							beginAtZero: true,
						},
					},
				],
				xAxes: [
					{
						display: true,
						gridLines: {
							display: false,
							color: "rgba(255, 255, 255, 0.1)",
						},
						ticks: {
							stepSize: 5,
							beginAtZero: true,
						},
					},
				],
			},
			hover: {
				mode: "nearest",
				intersect: true,
			},
		},
	});
}
