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
		container.innerHTML += "<div class='tiers' style='width:" +percent+ "%'><h5>" + tier + "</h5><p id='" + tier + "'></p></div>"
	}
}

var tooltipData = [];
var tooltipLabels = [];
function generateData() {
	var color = "rgb(75, 19, 136)";
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
		
		if(color == "rgb(75, 19, 136)") color = "rgb(234, 98, 20)";
		else color = "rgb(75, 19, 136)";
		
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
	var color = ['rgb(42, 2, 68)', 'rgb(102, 54, 132)', 'rgb(205, 167, 229)'];
	var datasetLabels = [];
	var maxLength = 0;
	var maxTotal = 0;
	tooltipData = [];
	
	for(var tier in tiers) {
		var label = tiers[tier];
		tierTotal = 0;
		
		for (var i = 0; i < label.length; i++) {
			if (!data[i]) {
				data.push([]);
				tooltipData.push([]);
				tooltipLabels.push([]);
				if (i > maxLength) maxLength = i;
				
				for(var t = 0; t < tierNum - 1; t++) {
					data[i].push(0);
					tooltipData[i].push(0);
					tooltipLabels[i].push("");
				}
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

	var total = 0;
	for(var i = 0; i < Object.keys(tiers).length; i++) {
		total = 0;
		for (var j = 0; j < maxLength; j++) {
			if (i >= data[j].length) break;
			
			total += data[j][i];
		}
		console.log(total);
		
		for (var j = 0; j < maxLength; j++) {
			if (i >= data[j].length) break;
			data[j][i] *= maxTotal / total;
		}
	}
	
	for (var i = 0; i < maxLength; i++) {
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

function showChart() {
			var ctx ;
			var chartData = generateData();
			
			document.getElementById("chart").innerHTML = "<canvas id='canvas'></canvas>";
			
			ctx = document.getElementById('canvas').getContext('2d');
			var chart = new Chart(ctx, {
				type: 'bar',
				data: chartData.data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
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
								maxRotation: 90,
								minRotation: 90,
							},
							gridLines: {
								color: chartData.gridColors
							}
						}]
					}
				}
			});
		};
		
function showMap() {
			var ctx ;
			var chartData = generateMapData();
			ctx = document.getElementById('mapCanvas').getContext('2d');
			var chart = new Chart(ctx, {
				type: 'horizontalBar',
				data: chartData.data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
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
					if (d < 2) ctx.fillStyle = '#FFF'; // label color
					else ctx.fillStyle = '#000';
					ctx.font = "15pt Verdana";
					var label = tooltipLabels[d][i];
					
					var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
					
					var yPos = model.y + 8;
					var xPos = model.x - ctx.measureText(label).width - padding;
					
					if (d > 0) {
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
};

window.onload = function() {
	showTitles();
	showChart();
}
