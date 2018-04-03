var data = {
	"[\"8 am Planned\", \"8 am Actual\"]":[166, 124],
	"[\"10 am Planned\", \"10 am Actual\"]":[185,149],
	"[\"12 pm Planned\", \"12 pm Actual\"]":[175,146],
	"[\"2 pm Planned\", \"2 pm Actual\"]":[135, 195],
	"[\"4 pm Planned\", \"4 pm Actual\"]":[163, 108],
	"[\"6 pm Planned\", \"6 pm Actual\"]":[118, 171],
	"[\"8 pm Planned\", \"8 pm Actual\"]":[180, 131],
	"[\"ORHA Planned\", \"ORHA Actual\"]":[894, 1310],
	"[\"BEDA Planned\", \"BEDA Actual\"]":[1300, 1189],
	"[\"NZWA Planned\", \"NZWA Actual\"]":[982, 999],
	"[\"BVYA Planned\", \"BVYA Actual\"]":[754, 1214],
	"[\"PVDA Planned\", \"PVDA Actual\"]":[1008, 1079],
	"[\"PSMA Planned\", \"PSMA Actual\"]":[1345, 1395],
	"[\"BGRA Planned\", \"BGRA Actual\"]":[1245, 1195],
	"[\"BGRA Planned\", \"BGRA Actual\"]":[923, 786],
};

function padLabels(labels) {
	var longest = ("10 am Planned").length;
	var newLabels = [];
	var currLabel = "";
	for(var label in labels) {
		currLabel = labels[label];
		while(currLabel.length < longest) {
			currLabel = " " + currLabel;
		}
		newLabels.push(currLabel);
	}
	return newLabels;
}


function generateData() {
	var barChartData = [];
	var color = "rgb(75, 19, 136)";
	for(var labels in data) {
		var newLabels = padLabels(JSON.parse(labels));
		console.log(newLabels);

	barChartData.push({
		labels: newLabels,
		datasets: [{
			label: 'Packges Per Hour',
			backgroundColor:  color,
			borderColor:  color,
			borderWidth: 1,
			data: data[labels]
			
		}]
		
	});
		
	if(color == "rgb(75, 19, 136)") color = "rgb(234, 98, 20)";
	else color = "rgb(75, 19, 136)";

	}
	
	return barChartData;
}

		window.onload = function() {
			var ctx ;
			var chartData = generateData();
			for(var i = 1; i <= 14; i++) {
				ctx = document.getElementById('canvas'+i).getContext('2d');
				var chart = new Chart(ctx, {
				type: 'bar',
				data: chartData[i-1],
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					title: {
						display: true
						
					},
					scales: { 
						yAxes: [{
							ticks: {
								display: i == 1,
								max: 1400,
								min: 0
							},
						}],
						xAxes: [{
							ticks: {
								fontFamily: 'monospace',
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90
								
							},
						}]
					}
				}
			});
			}
		};