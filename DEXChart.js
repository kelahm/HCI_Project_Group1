var total = 0;

function showChartView() {
	document.getElementById("chooseChart").className = "chosen";
	document.getElementById("chooseMap").className = "notChosen";
	document.getElementById("map").style.display = "none";
	document.getElementById("chart").style.display = "block";
	document.getElementById("tierNames").className = "chartTierNames";
	document.getElementById("chart-container").style.display = "block";

	showChart();
}

function showMapView() {
	document.getElementById("chooseMap").className = "chosen";
	document.getElementById("chooseChart").className = "notChosen";

	document.getElementById("map").style.display= "block";
	document.getElementById("chart").style.display= "none";
	document.getElementById("tierNames").className = "mapTierNames";
	document.getElementById("chart-container").style.display = "inline-flex";

	showMap();
}

function showTitles() {
	var container = document.getElementById("tierNames");
	container.innerHTML = "";

	var percent;
	for (var tier in tiers) {
		percent = Math.floor(tiers[tier].length / exceptions.length * 100);
		container.innerHTML += "<div class='tiers' style='width:" +percent+ "%;font-size:20px'><h5>" + tier + "</h5><p id='" + tier + "' style='font-size:14px;text-align:center'></p></div>"
	}
}

var tooltipData = [];
var tooltipLabels = [];

var animationDuration = 1000;

function generateData() {
	var color = "rgb(76, 76, 127)";
	var gridColor = "rgba(0, 0, 0, 0.1)";
	var labels = [];
	var colors = [];
	var data = [];
	var gridlines = ["rgba(0, 0, 0, 0.1)"];
	var tierTotal;
	var tierNum = 1;

	for(var tier in tiers) {
		var label = tiers[tier];
		tierTotal = 0;
		for (var i = 0; i < label.length; i++) {
			labels.push(label[i]);
			data.push(getDEXData(label[i]));
			colors.push(color);
			if (i > 0) gridlines.push(gridColor);

			tierTotal += getDEXData(label[i]);
			total += getDEXData(label[i]);
		}
		gridlines.push('black');

		document.getElementById(tier).innerHTML = "Total: " + tierTotal;
		tierNum++;

		if(color == "rgb(76, 76, 127)") color = "rgb(204, 173, 143)";
		else color = "rgb(76, 76, 127)";

	}

	return {data: {
			labels: labels,
			datasets: [{
				label: 'Exception Count:',
				backgroundColor:  colors,
				borderColor:  colors,
				borderWidth: 1,
				data: data
			}]
		},
		gridColors: gridlines};
}

function generateMapData() {
	var labels = [];
	var tierNum = 1;
	var datasets = [];
	var data = [];
	var color = ['rgb(38, 38, 76)', 'rgb(76, 76, 127)', 'rgb(125, 125, 178)'];
	var datasetLabels = [];
	var maxLength = 0;
	var maxTotal = 0;
	tooltipData = [];
	tooltipLabels = [];
	for(var tier in tiers) {
		var label = tiers[tier];
		tierTotal = 0;

		for (var i = 0; i < label.length; i++) {
			if (!data[i]) {
				data.push([]);
				tooltipData.push([]);
				tooltipLabels.push([]);
				if (i > maxLength) maxLength = i;
			}

			for(var t = data[i].length; t < tierNum - 1; t++) {
					data[i].push(0);
					tooltipData[i].push(0);
					tooltipLabels[i].push("");
			}


			data[i].push(getDEXData(label[i]));
			tooltipLabels[i].push(label[i]);
			tooltipData[i].push(getDEXData(label[i]));

			tierTotal += getDEXData(label[i]);
			total += getDEXData(label[i]);

		}

		document.getElementById(tier).innerHTML = "Total: " + tierTotal;
		if (tierTotal > maxTotal) maxTotal = tierTotal;
		labels.push(tier);
		tierNum++;
	}

	console.log(tooltipLabels);

	var total = 0;
	for(var i = 0; i < Object.keys(tiers).length; i++) {
		total = 0;
		for (var j = 0; j <= maxLength; j++) {
			if (i >= data[j].length) break;

			total += data[j][i];
		}

		for (var j = 0; j <= maxLength; j++) {
			if (i >= data[j].length) break;
			data[j][i] *= maxTotal / total;
		}
	}

	for (var i = 0; i <= maxLength; i++) {
		datasets.push({
			label: "", //datasetLabels[0],
			borderWidth: 5,
			data: data[i],
			backgroundColor:  color[i % 3],
			borderColor:  'white'
		});
	}

	return {data: {
			labels: labels,
			datasets: datasets
		}};
}

var hovering = 0;
function showChart() {
			var ctx ;
			var chartData = generateData();

			document.getElementById("chart").innerHTML = "<canvas id='canvas'></canvas>";

			ctx = document.getElementById('canvas').getContext('2d');
			var chart = new Chart(ctx, {
				type: 'bar',
				data: chartData.data,
				options: {
					animation: {
						duration: animationDuration
					},
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
						custom: function(tooltip) {
							hovering = tooltip.opacity;
						},
						displayColors: false
					},
					title: {
						display: false,
					},
					scales: {
						yAxes: [{
							ticks: {
								display: true
							},
						}],
						xAxes: [{
							ticks: {
								autoSkip: false,
							},
							gridLines: {
								color: chartData.gridColors
							}
						}]
					}
				}
			});
			animationDuration = 0;
		};

		Chart.plugins.register({
			afterDatasetsDraw: function(chart) {
				if(chart.chart.config.type != "bar") return;

				var ctx = chart.chart.ctx;

				chart.data.datasets.forEach(function(dataset, i) {
					var meta = chart.getDatasetMeta(i);
					if (!meta.hidden) {
						meta.data.forEach(function(element, index) {
							// Draw the text in black, with the specified font
							ctx.fillStyle = 'rgb(0, 0, 0)';

							var fontSize = 10;
							var fontStyle = 'normal';
							var fontFamily = 'Verdana, "Geneva", sans-serif';
							ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

							// Just naively convert to string for now
							var dataString = dataset.data[index].toString();

							// Make sure alignment settings are correct
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';

							var padding = 5;
							var position = element.tooltipPosition();
							ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
						});
					}
				});
			}
		});

var mapChart;
function showMap() {
			var ctx ;
			var chartData = generateMapData();

			if (mapChart) {
				mapChart.destroy();
			}
			ctx = document.getElementById('mapCanvas').getContext('2d');
			mapChart = new Chart(ctx, {
				type: 'horizontalBar',
				data: chartData.data,
				options: {
					animation: {
						duration: animationDuration
					},
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
						custom: function(tooltip) {
							hovering = tooltip.opacity;
						},
						displayColors: false,
						callbacks: {
							label: function(tooltipItems, data) {
								return tooltipLabels[tooltipItems.datasetIndex][tooltipItems.index] + ' : ' + tooltipData[tooltipItems.datasetIndex][tooltipItems.index];
							}
						},
						axis: 'y'
					},
					title: {
						display: false
					},
					scales: {
						xAxes: [{
							stacked: true,
							display: false
						}],
						yAxes: [{
							categoryPercentage: 1.0,
							barPercentage: 1.0,
							stacked: true,
							display: false
						}],
					}
				},
				plugins: [{
        afterDatasetsDraw: function (chart) {
			var ctx = chart.chart.ctx;
			ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
			ctx.textAlign = 'left';
			ctx.textBaseline = 'bottom';

			for(var d in chart.data.datasets) {
				var dataset = chart.data.datasets[d];
				var padding = 15;
				for (var i = 0; i < dataset.data.length; i++) {
					if ((d %3) < 2) ctx.fillStyle = '#FFF'; // label color
					else ctx.fillStyle = '#000';
					ctx.font = "10pt Verdana";
					var label = tooltipLabels[d][i];

					var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;

					var yPos = model.y + 8;
					var xPos = model.x - ctx.measureText(label).width - padding;

					if (d > 0 && chart.data.datasets[d-1]._meta[Object.keys(chart.data.datasets[d-1]._meta)[0]].data[i]) {
						var model2 = chart.data.datasets[d-1]._meta[Object.keys(chart.data.datasets[d-1]._meta)[0]].data[i]._model;
						if (xPos-padding > model2.x) ctx.fillText(label, xPos, yPos);
					} else {
						if (xPos > padding) ctx.fillText(label, xPos, yPos);
					}


				}
            }
        }
       }]
	});
	animationDuration = 0;
};

window.onload = function() {
	showTitles();
	showChart();
	setInterval(function() {
		if (!hovering) {
		updateTime(function() {
			if (document.getElementById("chooseChart").className == "chosen")
				showChart();
			else
				showMap();
		});
		}
	}, 1000);
}

function refreshData() {
	if (document.getElementById("chooseChart").className == "chosen")
				showChart();
			else
				showMap();
}
