var data = {
	"[\"8 am Planned\", \"8 am Actual\"]":[166, 124],
	"[\"10 am Planned\", \"10 am Actual\"]":[185,149],
	"[\"12 pm Planned\", \"12 pm Actual\"]":[175,146],
	"[\"2 pm Planned\", \"2 pm Actual\"]":[135, 195],
	"[\"4 pm Planned\", \"4 pm Actual\"]":[163, 108],
	"[\"6 pm Planned\", \"6 pm Actual\"]":[118, 171],
	"[\"8 pm Planned\", \"8 pm Actual\"]":[180, 131],
	"[\"ORHA Planned\", \"ORHA Actual\"]":[180, 131],
	"[\"BEDA Planned\", \"BEDA Actual\"]":[180, 131],
	"[\"NZWA Planned\", \"NZWA Actual\"]":[180, 131],
	"[\"BVYA Planned\", \"BVYA Actual\"]":[180, 131],
	"[\"PVDA Planned\", \"PVDA Actual\"]":[180, 131],
	"[\"PSMA Planned\", \"PSMA Actual\"]":[180, 131],
	"[\"BGRA Planned\", \"BGRA Actual\"]":[180, 131],
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
			label: 'Packages Per Hour',
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
			for(var i = 1; i <= 7; i++) {
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
						display: false
						
					},
					scales: { 
						yAxes: [{
							ticks: {
								display: i == 1,
								max: 200,
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