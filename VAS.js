var randomVASData = [

["US Ops","Eastern","Bostonian","ORHA","WMC121A","Inbound","11:04 PM","Early","21"],
["US Ops","Eastern","Bostonian","BEDA","KJM123K","Inbound","6:36 AM","Early","9"],
["US Ops","Eastern","Bostonian","NZWA","MCM234D","Outbound","2:02 AM","Late","8"],
["US Ops","Eastern","Bostonian","BVYA","JDJ545B","Inbound","6:24 PM","On Time","0"],
["US Ops","Eastern","Bostonian","PVDA","MFS125W","Outbound","4:50 PM","Late","7"],
["US Ops","Eastern","Bostonian","PSMA","CSB678R","Inbound","4:22 PM","Late","11"],
["US Ops","Eastern","Big Apple","FOKA","5WEOWQW","outbound","2:13 PM","Late","0"],
["US Ops","Eastern","Capital","GAIA","TAP3LUJ","outbound","6:27 PM","Late","42"],
["US Ops","Eastern","Capital","HGRA","KRSGW7G","outbound","3:53 PM","Late","59"],
["US Ops","Eastern","Capital","DGNA","KAX5D1E","outbound","3:55 PM","Late","59"],
["US Ops","Eastern","Capital","CHOA","3HV7LX0","outbound","12:54 AM","Late","17"],
["US Ops","Eastern","Capital","ORFA","ILFCPUW","inbound","7:48 PM","Late","27"],
["US Ops","Western","Delta","WHHA","AB0KGGZ","inbound","7:36 PM","Late","50"],
["US Ops","Western","Delta","RIWA","N87XNJE","inbound","6:06 AM","Late","40"],
["US Ops","Western","Mountain","MTJA","G8LN3QL","outbound","8:50 PM","Late","42"],
["US Ops","Western","Mountain","SBSA","8SSF1GI","outbound","5:06 AM","Late","35"],
["US Ops","Western","Mountain","GCCA","Q18WD5N","outbound","7:08 AM","Late","32"],
["US Ops","Western","Pacific Northwest","LMTA","CWO2Z3B","outbound","10:48 PM","On Time","0"],
["US Ops","Western","Pacific Northwest","PAEA","O09FYKJ","outbound","3:06 AM","Late","5"],
["US Ops","Western","Pacific Northwest","MFRA","RNY95JX","inbound","4:52 AM","Late","3"],
["US Ops","Western","Pacific Northwest","CLMA","VIKOEW1","inbound","12:56 AM","Early","39"],
["US Ops","Central","Three Rivers","HLGA","3IOJTYM","Outbound","3:15 AM","Late","12"],
["US Ops","Central","Three Rivers","MGWA","UBNMUTU","inbound","12:23 PM","Late","6"],
["US Ops","Central","Three Rivers","MEJA","NOXRFK3","inbound","5:31 AM","Late","36"],
["US Ops","Central","Great Lakes","PLNA","57MH8UH","outbound","11:10 PM","Late","19"],
["US Ops","Central","South Florida","RDUA","D0WK3N3","outbound","11:16 PM","Early","26"],
["US Ops","Central","South Florida","RWIA","HN7OOO5","inbound","6:20 PM","Late","8"],
["US Ops","Central","South Florida","HKYA","JBYYHQV","inbound","8:22 PM","Early","43"],
["US Ops","Central","Piedmont","QWGA","T5B9YTB","inbound","1:45 PM","Early","55"],
["US Ops","Central","Piedmont","FAYA","46LW90P","inbound","10:19 PM","On Time","5"],
["US Ops","Central","Piedmont","MRNA","5U9UCJR","inbound","7:17 AM","On Time","43"],
["US Ops","Southern","Southeast","RMGA","AGS0YRL","inbound","6:21 AM","Late","54"],
["US Ops","Southern","Southeast","AVLA","YC3N5H0","inbound","9:45 AM","Late","56"],
["US Ops","Southern","Southeast","GSPA","8PK8OSI","outbound","2:25 AM","Late","44"]

];
$(document).ready(function() {
    var table = $('#example').DataTable( {
        "scrollY": "65vh",
        "paging": false,
        "bInfo": false,
        rowReorder: {
            selector: 'td:nth-child(3)'
            },
        responsive: true,
        data: randomVASData,
        columns: [
            { title: "Division" },
            { title: "Region" },
            { title: "District" },
            { title: "Location." },
            { title: "VehicleID" },
            { title: "Inbound/Outbound" },
            { title: "ETA"},
            { title: "Arrival Status" },
            { title: "Early/Late(mins)" }
        ],
   
        });
            
 
        $('a.toggle-vis').on( 'click', function (e) {
            e.preventDefault();
 
            // Get the column API object
            var column = table.column( $(this).attr('data-column') );
 
            // Toggle the visibility
            column.visible( ! column.visible() );
        });
        
        $('.dropdown-menu').on('change', function(){
            var region = document.getElementById("Region").value;
	        var district = document.getElementById("District").value;
	        var location = document.getElementById("Location").value;
 
            if (region == "None Selected") region = false;
	        if (district == "None Selected") district = false;
	        if (location == "None Selected") location = false;
            
            if(region)
            {
                table.search('').columns(1).search(region).draw();  
                if(district)
                    {
                        table.columns(2).search(district).draw();  
                    }
                        if(location)
                        {
                            table.columns(3).search(location).draw();  
                        }
            }
            
        });
        
       var earlyVal = 0;
        var earlyCount = 0;
        var lateVal = 0;
        var lateCount = 0;
        var onTimeCount = 0;
        
        var table = $('#example').DataTable();
        var arrival = table.column([7]).data();
        var minutes = table.column([8]).data();
        
        for(var i=0; i<arrival.length; i++)
        {
           if (arrival[i] == 'Early') 
           {
               earlyVal += Number(minutes[i]); 
               earlyCount++;
           }
           else if(arrival[i] == 'Late')
           {
               lateVal += Number(minutes[i]);
               lateCount++;
           }
           else{
               onTimeCount++;
           }
        }
        var earlyAverage = (earlyVal/earlyCount).toPrecision(2);
        var lateAverage = (lateVal/lateCount).toPrecision(2);
        var earlyPercentage = ((earlyCount/minutes.length)*100).toPrecision(2);
        var latePercentage = ((lateCount/minutes.length)*100).toPrecision(2);
        var onTimePercentage = ((onTimeCount/minutes.length)*100).toPrecision(2);
        document.getElementById("early").innerHTML = earlyAverage;
        document.getElementById("late").innerHTML = lateAverage;
        document.getElementById("earlyperc").innerHTML = earlyPercentage;
        document.getElementById("lateperc").innerHTML = latePercentage;
        document.getElementById("onTimeperc").innerHTML = onTimePercentage;
    });   


        

                
 
    

 
    
