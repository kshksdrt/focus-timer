const Chart = require("chart.js");
Chart.defaults.global.defaultFontSize = 11;

export function registerCanvas(type = "bar", canvasId) {
	return new Chart(document?.getElementById(canvasId)?.getContext("2d"), {
		type,
		data: {
			labels: [],
			datasets: [
				{
					label: "Minutes spent working",
					data: [],
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

export function createGraph(chart, mode, { x = [], y = [] }) {
	chart.data.labels = [...x];
	chart.data.datasets[0].data = [...y];
	chart.data.datasets[0].backgroundColor = Array(x.length).fill(
		"rgba(73, 89, 197, 0.6)"
	);
	chart.data.datasets[0].borderColor = Array(x.length).fill(
		"rgba(73, 89, 197, 1.0)"
	);
	chart.update({ duration: 0 });
}
