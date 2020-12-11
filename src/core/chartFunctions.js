import Chart from "chart.js";

export function createGraph({ x, y }, mode) {
	const chartCanvas = document
		?.getElementById(`${mode}Canvas`)
		?.getContext("2d");
	let type;
	mode === "week" || mode === "year" ? (type = "bar") : (type = "line");

	Chart.defaults.global.defaultFontSize = 11;
	new Chart(chartCanvas, {
		type,
		data: {
			labels: x,
			datasets: [
				{
					label: "Minutes spent working",
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
