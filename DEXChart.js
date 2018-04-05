var dexData = {
	"[\"Package Not Delivered\", \"Incorrect Address\", \"Security Delay\"]":[932, 212, 23],
	"[\"Refused By Recipient\", \"Not In/Business Closed\", \"Damaged- Not Complete\"]":[521, 324, 34],
	"[\"Damaged- Complete\", \"C O D Delivery\", \"Sorted to Wrong Route\"]":[545, 32, 23],
	"[\"Business Closed Due to Strike\", \"Payment Recieved\", \"Future Delivery\"]":[381, 342, 334],
	"[\"Release Signiture on File\", \"Delivered to Wrong Address\", \"Not Attempted\"]":[545, 322, 23],
	"[\"Shipment Refused\", \"Security Delay\", \"Wrong Route\"]":[921, 832, 634],
};
var total = 0;

function showChartView() {
	document.getElementById("chooseChart").className = "chosen";
	document.getElementById("chooseMap").className = "notChosen";
	document.getElementById("map").style.display = "none";
	document.getElementById("chart").style.display = "block";
}

function showMapView() {
	document.getElementById("chooseMap").className = "chosen";
	document.getElementById("chooseChart").className = "notChosen";
	
	document.getElementById("map").style.display= "block";
	document.getElementById("chart").style.display= "none";
	
	showMap();
}

function generateData() {
	var color = "rgb(75, 19, 136)";
	var gridColor = "rgba(0, 0, 0, 0.1)";
	var labels = [];
	var colors = [];
	var data = [];
	var gridlines = ["rgba(0, 0, 0, 0.1)"];
	var tierTotal;
	var tierNum = 1;
	
	for(var tier in dexData) {
		var label = JSON.parse(tier);
		tierTotal = 0;
		for (var i = 0; i < label.length; i++) {
			labels.push(label[i]);
			data.push(dexData[tier][i]);
			colors.push(color);
			if (i > 0) gridlines.push(gridColor);
			
			tierTotal += dexData[tier][i];
			total += dexData[tier][i];
		}
		gridlines.push('black');
		
		document.getElementById("tier"+tierNum).innerHTML = "Total: " + tierTotal;
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
	var data = [[], [], []];
	var color = ['rgb(42, 2, 68)', 'rgb(102, 54, 132)', 'rgb(205, 167, 229)'];
	
	for(var tier in dexData) {
		var label = JSON.parse(tier);
		tierTotal = 0;
		
		for (var i = 0; i < label.length; i++) {
			data[i].push(dexData[tier][i]);
			
			tierTotal += dexData[tier][i];
			total += dexData[tier][i];
			
		}

		document.getElementById("tier"+tierNum).innerHTML = "Total: " + tierTotal;
		labels.push("TIER " + tierNum + " Total: " + tierTotal);
		tierNum++;
	}
	
	var max = 0;
	var total = 0;
	for(var i = 0; i < 6; i++) {
		total = data[0][i] + data[1][i] + data[2][i];
		if (total > max) max = total;
	}
	
	for(var i = 0; i < 6; i++) {
		total = data[0][i] + data[1][i] + data[2][i];
		data[0][i] *= max / total;
		data[1][i] *= max / total;
		data[2][i] *= max / total;
	}
	
			datasets.push({
				label: 'Exception Count:',
				borderWidth: 5,
				data: data[0],
				backgroundColor:  color[0],
				borderColor:  'black'
			});
			
			datasets.push({
				label: 'Exception Count:',
				borderWidth: 5,
				data: data[1],
				backgroundColor:  color[1],
				borderColor:  'black'
			});
			
			datasets.push({
				label: 'Exception Count:',
				borderWidth: 5,
				data: data[2],
				backgroundColor:  color[2],
				borderColor:  'black'
			});
	
			
	
	return {data: {
			labels: labels,
			datasets: datasets
		}};
}

function showChart() {
			var ctx ;
			var chartData = generateData();
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
					tooltip: {
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
			console.log(chart);
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
						displayColors: false
					},
					title: {
						display: false,
					},
					scales: {
     xAxes: [{
          stacked: true,
		  display: false  
     }],
     yAxes: [{
		 categoryPercentage: 1.0,
            barPercentage: .9,
          stacked: true
     }]
}
				}
			});
			console.log(chart);
		};

window.onload = showChart;