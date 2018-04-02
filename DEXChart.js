var data = {
	"[\"Package Not Delivered\", \"Incorrect Address\", \"Security Delay\"]":[932, 212, 23],
	"[\"Refused By Recipient\", \"Not In/Business Closed\", \"Damaged- Not Complete\"]":[521, 324, 34],
	"[\"Damaged- Complete\", \"C O D Delivery\", \"Sorted to Wrong Route\"]":[545, 32, 23],
	"[\"Business Closed Due to Strike\", \"Payment Recieved\", \"Future Delivery\"]":[381, 342, 334],
	"[\"Release Signiture on File\", \"Delivered to Wrong Address\", \"Not Attempted\"]":[545, 322, 23],
	"[\"Shipment Refused\", \"Security Delay\", \"Wrong Route\"]":[921, 832, 634],
};
function padLabels(labels) {
	var longest = ("Business Closed Due to Strike").length;
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
			label: 'Exception Count:',
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
			for(var i = 1; i <= 6; i++) {
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
						display: true,
						text: 'TIER '+ i
					},
					scales: {
						yAxes: [{
							ticks: {
								display: i == 1,
								max: 1000,
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
