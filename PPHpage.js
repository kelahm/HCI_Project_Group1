var time = {
	"8 am":[166, 124],
	"10 am":[185,149],
	"12 am":[175,146],
	"2 pm":[135, 195],
	"4 pm":[163, 108],
	"6 pm":[118, 171],
	"8 pm":[180, 131],
};

var timeJustData = [[166, 124],
	[185,149],
	[175,146],
	[135, 195],
	[163, 108],
	[118, 171],
	[180, 131],
];

var place = {
	"ORHA":[1310, 894],
	"BEDA":[1300, 1189],
	"NZWA":[982, 999],
	"BVYA":[754, 1214],
	"PVDA":[1008, 1079],
	"PSMA":[1345, 1395],
	"BGRA ":[1245, 1195],
};

var placeJustData = [
	[1310, 894],
	[1300, 1189],
	[982, 999],
	[754, 1214],
	[1008, 1079],
	[1345, 1395],
	[1245, 1195],
];

var DrillDownLabel = "";
var axisLabel;

function generateData(data) {
	var plannedData = [];
	var actualData = [];
	var actualColors = [];
	var plannedColors = [];
	var labels = [];
	
	for(var label in data) {
		labels.push(label);
		if(data[label][0] > data[label][1]) {
			plannedData.push(data[label][0]);
			actualData.push(data[label][0]-data[label][1]);
			actualColors.push( "rgb(75, 19, 136)");
			plannedColors.push('rgb(234, 98, 20)');
		} else {
			plannedData.push(data[label][1]);
			actualData.push(data[label][1]-data[label][0]);
			plannedColors.push( "rgb(75, 19, 136)");
			actualColors.push('rgb(234, 98, 20)');
		}
		
	}
	
	console.log(plannedData);
	
	return {
		labels: labels,
		datasets: [{
			label: 'Planned',
			backgroundColor: plannedColors,
			borderColor:  plannedColors,
			borderWidth: 1,
			data: plannedData,
			xAxisID: 'plannedx',
			stack: 1
		},
		{
			label: 'Actual',
			backgroundColor:  actualColors,
			borderColor: actualColors,
			borderWidth: 1,	
			data: actualData,
			xAxisID: 'actualx',
			stack: 1
		}]
	};
}

		window.onload = drawPPHCharts;
var chart;		
var placeChart;
var hoveringOver = "";

function drawPPHCharts() {
	updatePPHData();
	var ctx ;
	var chartData = generateData(time);
	ctx = document.getElementById('canvas').getContext('2d');
	
	if (chart) chart.destroy();
	
	chart = new Chart(ctx, {
		type: 'bar',
		data: chartData,
		options: {
			responsive: true,
			maintainAspectRatio: false,
			title: {
				display: true,
				text: 'Time',
				fontSize: 30
			},
			scales: { 
				yAxes: [{
					stacked: true,
					scaleLabel: {
						display: true,
						labelString: axisLabel,
					},
					ticks: {
                              beginAtZero: true,
					}
				}, ],
				xAxes: [{
					display: true,
					ticks: {
						autoSkip: false,
					},
					stacked: true,
					id: 'actualx',
					barPercentage: .4
				},
				{
					display: false,
					ticks: {
						autoSkip: false,
					},
					stacked: true,
					id: 'plannedx',
					type: 'category',
                          categoryPercentage: 1,
                          barPercentage: .7,
                          gridLines: {
                              offsetGridLines: true
                          }
				}]
			},
			tooltips: {
				displayColors: false,
				callbacks: {
					label: function(tooltipItems, data) { 
						return  ['Actual: ' + timeJustData[tooltipItems.index][0], "Planned: " + timeJustData[tooltipItems.index][1]];
					},
				}
			},
		}
	});
			
	if (placeChart) placeChart.destroy();
	if (DrillDownLabel) {
			var chartData = generateData(place);
				ctx = document.getElementById('canvas2').getContext('2d');
				placeChart = new Chart(ctx, {
				type: 'bar',
				data: chartData,
				options: {
					onClick: handleLocationClick,
					responsive: true,
					maintainAspectRatio: false,
					tooltips: {
						displayColors: false,
						callbacks: {
							label: function(tooltipItems, data) { 
								hoveringOver = tooltipItems.xLabel;
								return  ['Actual: ' + placeJustData[tooltipItems.index][0], "Planned: " + placeJustData[tooltipItems.index][1]];
							},
						}
					},
					title: {
						display: true,
						text: DrillDownLabel,
						fontSize: 30
					},
					scales: { 
						yAxes: [{
							stacked: true,
							scaleLabel: {
        display: true,
        labelString: 'Average Packages Per Hour',
      }
						}],
						xAxes: [{
							display: true,
							id: "actualx",
							ticks: {
								autoSkip: false,
							},
							stacked: true,
							barPercentage: .4,
						}, {
					display: false,
					ticks: {
						autoSkip: false,
					},
					stacked: true,
					id: 'plannedx',
					type: 'category',
                          categoryPercentage: 1,
                          barPercentage: .7,
                          gridLines: {
                              offsetGridLines: true
                          }
				}]
					}
				}
			});
	}
};

function handleLocationClick(data) {
	drillDownTo(hoveringOver);
	drawPPHCharts();
}