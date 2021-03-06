function loadDates() {
	var today = new Date();
	var yesturday = new Date();
	yesturday.setDate(today.getDate() - 1);
	yesturday.setHours(today.getHours() + 1);
	document.getElementById('sddate').valueAsDate = yesturday;

	document.getElementById('edate').valueAsDate = today;
	document.getElementById('sdate').valueAsDate = yesturday;
	document.getElementById('stime').value = yesturday.toTimeString().substring(0, 8);
	document.getElementById('etime').value = today.toTimeString().substring(0, 8);
	
	liveData = true;
}

var liveData = true;
function updateTime(cb) {
	if (liveData) {
		var today = new Date();
		document.getElementById('etime').value = today.toTimeString().substring(0, 8);
		if (cb) cb();
	}
}

function createDropDownInput(label, options, selected, parentDiv, small) {
	if (!small) {
		parentDiv.innerHTML += "<label style='font-sixe:3vmin;'>" + label + "</label>";
		parentDiv.innerHTML += "</br>";
	}
	
	var wrapper = document.createElement("div");
	if (!small) wrapper.className = "selectWrapper";
	if(small) {
		wrapper.innerHTML += "<label style='margin-right:10px;width:35%;'>" + label + "</label>";
		wrapper.style.display = "inline-flex";
		wrapper.style.marginLeft = "10px";
		wrapper.style.marginTop = "1px";
		wrapper.style.width = "100%";
	}
	parentDiv.appendChild(wrapper);
	
	var select = document.createElement("select");
	if(small) select.id="Default"+label;
	else select.id=label;
	wrapper.appendChild(select);
	
	var option;
	options.unshift("None Selected");
	for (var item in options) {
		if (selected == options[item]) {
			var temp = options[item];
			options.splice(item, 1);
			options.unshift(temp);
			break;
		}
	}
	
	for (var item in options) {
		item = options[item];
		option = document.createElement("option");
		option.value = item;
		option.innerHTML = item;
		select.appendChild(option);
	}
	
	if (options.length <= 1) select.disabled = true;
	parentDiv.innerHTML += "</br>";
	
}

function populateDrillDownMenu(region, district, location) {
	var menuArea = document.getElementById("drill-down");
	menuArea.innerHTML = "";
	var data = formatDrillDownInfo();
	
	createDropDownInput("Region", Object.keys(data), region, menuArea);
	if (data.hasOwnProperty(region)) {
		createDropDownInput("District", Object.keys(data[region]), district, menuArea);
		if (data[region].hasOwnProperty(district)) {
			createDropDownInput("Location", Object.keys(data[region][district]), location, menuArea);
			if (data[region][district].hasOwnProperty(location)) {
				menuArea.innerHTML += '<p style="font-size:3vmin;">Manager:<br/><span style="font-size:2vmin">' + data[region][district][location] + '</span></p>';
			}
		} else {
			createDropDownInput("Location", [], location, menuArea);
		}
	} else {
		createDropDownInput("District", [], district, menuArea);
		createDropDownInput("Location", [], district, menuArea);
	}	

	menuArea.innerHTML += '<button onclick="resetDrillDown()" style="background-color:lightgray"> Reset to Default </button>';
}

function resetDrillDown() {
	var region = document.getElementById("DefaultRegion").value;
	var district = document.getElementById("DefaultDistrict").value;
	var location = document.getElementById("DefaultLocation").value;
	if (region == "None Selected") region = false;
	if (district == "None Selected") district = false;
	if (location == "None Selected") location = false;
	
	animationDuration = 1000;
	populateDrillDownMenu(region, district, location);
	refreshData();
}


function populateDefaultDrillDownMenu(region, district, location) {
	var menuArea = document.getElementById("default-drill-down");
	menuArea.innerHTML = "";
	var data = formatDrillDownInfo();

	createDropDownInput("Region", Object.keys(data), region, menuArea, true);
	if (data.hasOwnProperty(region)) {
		createDropDownInput("District", Object.keys(data[region]), district, menuArea, true);
		if (data[region].hasOwnProperty(district)) {
			createDropDownInput("Location", Object.keys(data[region][district]), location, menuArea, true);
		} else {
			createDropDownInput("Location", [], location, menuArea, true);
		}
	} else {
		createDropDownInput("District", [], district, menuArea, true);
		createDropDownInput("Location", [], district, menuArea, true);
	}							
}

function updateDrillDown() {
	var region = document.getElementById("Region").value;
	var district = document.getElementById("District").value;
	var location = document.getElementById("Location").value;
	if (region == "None Selected") region = false;
	if (district == "None Selected") district = false;
	if (location == "None Selected") location = false;
	populateDrillDownMenu(region, district, location);
}

function drillDownTo(next) {
	var region = document.getElementById("Region").value;
	var district = document.getElementById("District").value;
	var location = document.getElementById("Location").value;
	if (region == "None Selected") region = false;
	if (district == "None Selected") district = false;
	if (location == "None Selected") location = false;
	
	if (!region) region = next;
	else if(!district) district = next;
	else if(!location) location = next;
	populateDrillDownMenu(region, district, location);
}

function updateDefaultDrillDown() {
	var region = document.getElementById("DefaultRegion").value;
	var district = document.getElementById("DefaultDistrict").value;
	var location = document.getElementById("DefaultLocation").value;
	if (region == "None Selected") region = false;
	if (district == "None Selected") district = false;
	if (location == "None Selected") location = false;
	populateDefaultDrillDownMenu(region, district, location);
}


var drillDownInfo = ["Eastern	Bostonian	ORHA	Reginald Cruz",
"Eastern	Bostonian	BEDA	Molly Fisher",
"Eastern	Bostonian	NZWA	Lillie Barker",
"Eastern	Bostonian	BVYA	Ian Barton",
"Eastern	Bostonian	PVDA	Kelly Larson",
"Eastern	Bostonian	PSMA	Aubrey Cook",
"Eastern	Bostonian	BGRA	Sheila Fleming",
"Eastern	Bostonian	AUGA	Jody Williamson",
"Eastern	Bostonian	OWDA	Luke Richardson",
"Eastern	Bostonian	CEFA	Clayton Curtis",
"Eastern	Big Apple	NYCA	Andre Hunter",
"Eastern	Big Apple	JRBA	Ricardo French",
"Eastern	Big Apple	WTCA	Pearl Howell",
"Eastern	Big Apple	HPNA	Laverne Morgan",
"Eastern	Big Apple	LGAA	Jeannie Owens",
"Eastern	Big Apple	FIDA	June Benson",
"Eastern	Big Apple	JRAA	Kerry Ballard",
"Eastern	Big Apple	TSSA	Caroline Long",
"Eastern	Big Apple	FBTA	Rodney Norton",
"Eastern	Big Apple	FOKA	May Douglas",
"Eastern	Capital	GAIA	Leona Watson",
"Eastern	Capital	HGRA	Mae Ortega",
"Eastern	Capital	DGNA	Jermaine Jones",
"Eastern	Capital	CHOA	Misty Cannon",
"Eastern	Capital	ORFA	Matt Holloway",
"Eastern	Capital	JPNA	Theodore Warner",
"Eastern	Capital	MQIA	Mattie Christensen",
"Eastern	Capital	PHFA	Ed Townsend",
"Eastern	Capital	PTBA	Melinda Martin",
"Eastern	Capital	BCBA	Leroy Thompson",
"Western	Canyon	ZSYA	Melvin Carpenter",
"Western	Canyon	BTFA	Shelly Garner",
"Western	Canyon	MSCA	Kevin Stevenson",
"Western	Canyon	SGUA	Randall Clark",
"Western	Canyon	OGDA	Hazel Tyler",
"Western	Canyon	VGTA	Laurence Harper",
"Western	Canyon	JACA	Renee Cohen",
"Western	Canyon	ELPA	Gloria Medina",
"Western	Canyon	LHUA	Adrian Day",
"Western	Canyon	RKSA	Kelley Gross",
"Western	Mountain	BJCA	Leslie Watkins",
"Western	Mountain	WHHA	Erma Lowe",
"Western	Mountain	RIWA	Stacy Adkins",
"Western	Mountain	MTJA	Isaac Harris",
"Western	Mountain	SBSA	Hubert Lambert",
"Western	Mountain	GCCA	Delores Knight",
"Western	Mountain	SHRA	Cary Goodman",
"Western	Mountain	BKFA	Jorge Hansen",
"Western	Mountain	DENA	Jan Buchanan",
"Western	Mountain	FTCA	Terence Moreno",
"Western	Pacific Northwest	EATA	Tammy Davis",
"Western	Pacific Northwest	BVUA	Percy Sharp",
"Western	Pacific Northwest	SEAA	Diane McCarthy",
"Western	Pacific Northwest	LMTA	Juanita Wright",
"Western	Pacific Northwest	PAEA	Isabel Mann",
"Western	Pacific Northwest	MFRA	Erin Bell",
"Western	Pacific Northwest	CLMA	Jill Bradley",
"Western	Pacific Northwest	HIOA	Terrence Pratt",
"Western	Pacific Northwest	PDTA	Pauline Dean",
"Western	Pacific Northwest	BOIA	Lisa Munoz",
"Central	Three Rivers	LNNA	Gertrude Lawson",
"Central	Three Rivers	PITA	Bessie Owen",
"Central	Three Rivers	AGCA	Amy Miller",
"Central	Three Rivers	LBEA	Dallas Jenkins",
"Central	Three Rivers	ERIA	Janice White",
"Central	Three Rivers	AOOA	Marie Rose",
"Central	Three Rivers	JSTA	Lora Lee",
"Central	Three Rivers	HLGA	Derek Garcia",
"Central	Three Rivers	MGWA	Victor Wolfe",
"Central	Three Rivers	MEJA	Jon Santiago",
"Central	Great Lakes	PLNA	Veronica Holmes",
"Central	Great Lakes	CLUA	Deanna Byrd",
"Central	Great Lakes	TOLA	Cindy Payne",
"Central	Great Lakes	MZZA	Cheryl Mitchell",
"Central	Great Lakes	FWAA	Sonja Patrick",
"Central	Great Lakes	OKKA	Janet Harmon",
"Central	Great Lakes	MIEA	Flora Collins",
"Central	Great Lakes	BMGA	Mable Wells",
"Central	Great Lakes	HUFA	Kellie Ray",
"Central	Great Lakes	LAFA	Inez May",
"Central	Piedmont	ROAA	Sylvester Burgess",
"Central	Piedmont	LYHA	Elaine Parker",
"Central	Piedmont	CRWA	Cameron Hart",
"Central	Piedmont	PKBA	Howard Hines",
"Central	Piedmont	RDUA	Don Harrington",
"Central	Piedmont	RWIA	Corey Fuller",
"Central	Piedmont	HKYA	Chelsea Love",
"Central	Piedmont	QWGA	Francis Russell",
"Central	Piedmont	FAYA	Jerry Becker",
"Central	Piedmont	MRNA	Lee Fitzgerald",
"Southern	Southeast	RMGA	Jordan Casey",
"Southern	Southeast	AVLA	Ralph Webster",
"Southern	Southeast	GSPA	Kathleen Silva",
"Southern	Southeast	ANDA	Crystal Norris",
"Southern	Southeast	FTYA	Pat Ford",
"Southern	Southeast	MGEA	Douglas Nelson",
"Southern	Southeast	AHNA	Pete Griffin",
"Southern	Southeast	NCQA	Roosevelt Wade",
"Southern	Southeast	AGSA	Daisy Blake",
"Southern	Southeast	MCNA	Homer Chapman",
"Southern	South Florida	BCTA	Jessie Sims",
"Southern	South Florida	TMBA	Dawn Norman",
"Southern	South Florida	HSTA	Maria Bell",
"Southern	South Florida	PBIA	Rita Bowers",
"Southern	South Florida	SRQA	Bert Hubbard",
"Southern	South Florida	PIEA	Gladys Ryan",
"Southern	South Florida	LALA	Stephanie Stewart",
"Southern	South Florida	FMYA	Al Rios",
"Southern	South Florida	FPRA	Bobbie Schwartz",
"Southern	South Florida	APFA	Kristina Joseph",
"Southern	Delta	MQYA	Luz Jennings",
"Southern	Delta	BNAA	Melinda Chapman",
"Southern	Delta	OLVA	Lyle Brock",
"Southern	Delta	MKLA	Mitchell Daniel",
"Southern	Delta	TUPA	Olga Rodriquez",
"Southern	Delta	CRXA	Flora Vega",
"Southern	Delta	BWGA	Tammy Gordon",
"Southern	Delta	LITA	Israel Lawson",
"Southern	Delta	OKCA	Silvia Boyd",
"Southern	Delta	JBRA	Donna Gardner"];

var exceptions = ["Package Not Delivered", "Incorrect Address", "Security Delay", "Refused By Recipient", "Not In/Business Closed", "Damaged- Not Complete", "Damaged- Complete", "C O D Delivery", "Sorted to Wrong Route",
	"Business Closed Due to Strike", "Payment Recieved", "Future Delivery", "Release Signiture on File", "Not Attempted", "Shipment Refused"];
var tiers = {"Critical": exceptions.slice(0, 3), "High Priority": exceptions.slice(3, 6), "Medium Priority": exceptions.slice(6, 9), "Low Priority": exceptions.slice(9)};

var randomPPHData = [];
function generateRandomPPHData() {
	var data;
	randomPPHData = [];
	for (var area in drillDownInfo) {
		data = {expected:[], actual:[]};
		for(var i = 0; i <= 24; i++) {
			data.expected.push(Math.floor(Math.random()*1000));
			data.actual.push(Math.floor(Math.random()*1000));
		}
		randomPPHData.push(data);
	}
}

function updatePPHData() {
	var region = document.getElementById("Region").value;
	var district = document.getElementById("District").value;
	var location = document.getElementById("Location").value;
	if (region == "None Selected") region = false;
	if (district == "None Selected") district = false;
	if (location == "None Selected") location = false;
	
	var buckets = makeTimeBuckets();

	if (!region) DrillDownLabel = "Region";
	else if (!district) DrillDownLabel = "District";
	else if (!location) DrillDownLabel = "Location";
	else DrillDownLabel = false;
	
	timeJustData = [];
	for(var i = 0; i < buckets.length; i++) {
		timeJustData.push([0, 0]);
	}
	var area;
	for (var d in drillDownInfo) {
		area = drillDownInfo[d].split("\t");
		if (!region || region == area[0]) {
			if (!district || district == area[1]) {
				if (!location || location == area[2]) {
					for (var i = 0; i < buckets.length; i++) {
						timeJustData[i][0] += randomPPHData[d].expected[i];
						timeJustData[i][1] += randomPPHData[d].actual[i];
					}
				}
			}
		}
	}
	
	if (liveData) {
		var now = document.getElementById("etime").value;

		var percentIntoBucket = (parseInt(now.substring(3, 5)) * 60 + parseInt(now.substring(6, 8))) / 60 / 60;
		timeJustData[timeJustData.length-1][0] *= percentIntoBucket;
		timeJustData[timeJustData.length-1][0] = Math.floor(timeJustData[timeJustData.length-1][0]);
		timeJustData[timeJustData.length-1][1] *= percentIntoBucket;
		timeJustData[timeJustData.length-1][1]  = Math.floor(timeJustData[timeJustData.length-1][1]);
	}
	
	time = {};
	for (var i = 0; i < buckets.length; i++) {
		time[buckets[i]] = timeJustData[i];
	}

	if (!DrillDownLabel) return;
	place = {}
	placeJustData = [];
	
	for (var d in drillDownInfo) {
		area = drillDownInfo[d].split("\t");
		if (!region) area = area[0];
		else if (!district) {
			if (area[0] != region) continue;
			area = area[1];
		} else {
			if (area[0] != region || area[1] != district) continue;
			area = area[2];
		}
		
		if (!place.hasOwnProperty(area)) {
			place[area] = [0, 0];
			placeJustData.push([0, 0])
		}
			
		for(var i = 0; i <= 24; i++) {
			place[area][0] += randomPPHData[d].expected[i];
			place[area][1] += randomPPHData[d].actual[i];
			
			placeJustData[placeJustData.length-1][0] += randomPPHData[d].expected[i];
			placeJustData[placeJustData.length-1][1] += randomPPHData[d].actual[i];
		}
	}
	
}

function handleDateChange() {
	var sdate = document.getElementById("sdate").value;
	var stime = document.getElementById("stime").value;
	var edate = document.getElementById("edate").value;
	var etime = document.getElementById("etime").value;
	
	var start = new Date(sdate + "T" + stime);
	var end = new Date(edate + "T" + etime);
	var now = new Date();
	
	if (start - now > 0) {
		document.getElementById('sdate').valueAsDate = now;
		document.getElementById('stime').value = now.toTimeString().substring(0, 8);
	} 
	
	if (end - now > 0) {
		document.getElementById('edate').valueAsDate = now;
		document.getElementById('etime').value = now.toTimeString().substring(0, 8);
		liveData = true;
	}
}

var bucketRanges = {};
var bucketSize = 0;
function makeTimeBuckets() {
	var buckets = [];
	bucketRanges = {};
	
	var sdate = document.getElementById("sdate").value;
	var stime = document.getElementById("stime").value;
	var edate = document.getElementById("edate").value;
	var etime = document.getElementById("etime").value;
	
	var start = new Date(sdate + "T" + stime);
	var end = new Date(edate + "T" + etime);
	var hours = (end-start) /1000 / 60 / 60;
	
	if (hours <= 24) {
		bucketSize = 1;
		axisLabel = "Packages Per Hour";
		var hourWord;
		for (var i = parseInt(stime.substring(0, 2)); i <= parseInt(stime.substring(0, 2)) + hours; i++) {
			hourWord = i;
			if (hourWord > 24) hourWord -= 24;
			if (hourWord <=12) hourWord += " a.m.";
			else {
				hourWord -=12;
				hourWord += " p.m."
			}
			
			buckets.push(hourWord);
		}
	} else {
		axisLabel = "Average Packages Per Hour";
		var bucketDate = new Date(sdate);
		bucketSize = Math.ceil(hours / 24);
		var start = parseInt(stime.substring(0, 2));
		var description;
		
		if (start < 12) {
			description = " a.m.";
		} else { 
			description = " p.m.";
			if (start != 12) start -= 12;
		}
		
		var last = false;
		
		var showTime = true;
		var showYear = false;
	
		if (hours > 24 * 24) showTime = false;
		if (hours > 24 * 365) showYear = true;
		
		var label = "";
		while (hours > 0 && !last) {
			if (hours < 0) last = true;
			if (hours == 0) break;
			
			label = "";
			if (showTime) {
				if (start == 0) label += "12 a.m. ";
				else label += start+description+" ";
			}
			label += (bucketDate.getMonth()+1) + "/" + bucketDate.getDate();
			if (showYear) label += "/20" + (bucketDate.getYear()-100);
				
			bucketRanges[label] = new Date(bucketDate.getTime());
			
			buckets.push(label);
			start += bucketSize;
			
			while (start > 12) {
				start -= 12;
				if (description == " a.m.") description = " p.m.";
				else {
					description = " a.m.";
					bucketDate.setDate(bucketDate.getDate()+1);
				}
			}
			
			hours -= bucketSize;
		}
	}
	
	return buckets;
}


function showTiersInMenu() {
	var container;
	for (var tier in tiers) {
		if (document.getElementById(tier)) {
		container = document.getElementById(tier);
		for (var ex in tiers[tier]) {
			container.innerHTML += '<label id="'+  tiers[tier][ex] +'" class="noDrop" draggable="true" ondragstart="drag(event)" style="background-color: white; border: 1px solid; margin: 2px">' + tiers[tier][ex] + '</label>';
		}
		}
	}
}

var dexData = [];
function generateDEXData() {
	for (var i = 0; i < drillDownInfo.length; i++) {
		dexData.push([]);
		for(var e in exceptions) {
			dexData[i].push(Math.floor(Math.random() * 1000));
		}
	}
}

function getDEXData(exception) {
	var region = document.getElementById("Region").value;
	var district = document.getElementById("District").value;
	var location = document.getElementById("Location").value;
	
	var total = 0;
	var line;
	for(var l in drillDownInfo) {
		line = drillDownInfo[l].split("\t");
		if(region == "None Selected" || region == line[0]) {
			if (district == "None Selected" || district == line[1]) {
				if (location == "None Selected" || location == line[2]) {
					total += dexData[l][exceptions.indexOf(exception)] + Math.floor(Math.random() * 2);
				}
			}
		}
	}
	return total;
}
// formats the information about regions, districts, locations, etc as an object in the form
// {<district>: {
//     <region>: {
//	      <location>:<manager>,
//		  <location>:<manager>, ...
//		}, <region>: ...
//  }, <district> ...}
function formatDrillDownInfo() {
	var newInfo = {};
	for (var line in drillDownInfo) {
		line = drillDownInfo[line].split("\t");
		if (!(line[0] in newInfo)) newInfo[line[0]] = {};
		if (!(line[1] in newInfo[line[0]])) newInfo[line[0]][line[1]] = {};
		
		newInfo[line[0]][line[1]][line[2]] = line[3];
	}
	return newInfo;
}

populateDrillDownMenu();
generateRandomPPHData();
populateDefaultDrillDownMenu();
loadDates();
generateDEXData();
showTiersInMenu();
