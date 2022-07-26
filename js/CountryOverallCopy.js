var overview={
    display: async function () {      
      d3.select("#Overview").selectAll("text").remove();
      d3.select("#Overview").selectAll("svg").remove();

    var margin = {top: 50, right: 100, bottom: 70, left: 260},
    width = 1300 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
       atheleteData = await(d3.csv("https://srasi1.github.io/data/athlete_events.csv"))

var countryList = [];
var temp = {};
var y = {};
var totalMedals = 0;
var gMedals = 0;
var sMedals = 0;
var bMedals = 0;
for(var i = 0; i < atheleteData.length; i++){
temp = {};

y = countryList.find(o=>o.NOC === atheleteData[i].NOC);
if(y !== undefined)
	{
  
  if(atheleteData[i].Medal === "Gold") {
    y["gMedals"] = parseInt(y["gMedals"]) + 1;
    y["totalMedals"] = parseInt(y["totalMedals"]) + 1;
  }
  if(atheleteData[i].Medal === "Silver") {
    y["sMedals"] = parseInt(y["sMedals"]) + 1;
    y["totalMedals"] = parseInt(y["totalMedals"]) + 1;
  }
  if(atheleteData[i].Medal === "Bronze") {
    y["bMedals"] = parseInt(y["bMedals"]) + 1;
    y["totalMedals"] = parseInt(y["totalMedals"]) + 1;
  }

	}
	else
	{
		temp["NOC"] = atheleteData[i].NOC;
		
    if(atheleteData[i].Medal === "Gold") {
      temp["gMedals"] = 1;
      temp["totalMedals"] = 1;
    }
    if(atheleteData[i].Medal === "Silver") {
      temp["sMedals"] = 1;
      temp["totalMedals"] = 1;
    }
    if(atheleteData[i].Medal === "Bronze") {
      temp["bMedals"] = 1;
      temp["totalMedals"] = 1;
    }

		countryList.push(temp);
	}	
}


var maxcase = 0, maxCountry = '';
for(i = 0; i < countryList.length; i++)
{
	var x = parseInt(countryList[i]["totalMedals"]);
	if (maxcase < x)
	{
		maxcase = x;
		maxCountry = countryList[i]["NOC"]
	}
}

//The following statement snippet sorts the array by medals in ascending order:
			countryList.sort((a, b) => {
    return b.totalMedals - a.totalMedals;
});
            var max = d3.max(countryList, function(d) { return parseInt(d.totalMedals); });
			

 countryList.sort((a, b) => {
    return b.totalMedals - a.totalMedals;
});

      d3.select("#Overview").append("svg").attr("height",20).append("g").append('text').transition().duration(300).attr("x", 0).attr("y", 10).attr("id","annotation")
      .text("*Hover over the Bars for more details").attr("font-size", "14px")
      .attr("font-weight","italic").style("fill", "red").attr("font-weight","bold")
  
          
	  var svg = d3.select("#Overview")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")"); 
				  
 
  //X axis
  var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(countryList.map(function(d) { return d.NOC; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("id","x")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    svg.append("text")
    .attr("class", "x label")
    .attr("x", width )
    .attr("y", height - 6)
    .text("Country Name");

// Y axis
console.log(max);
var y = d3.scaleLinear()
  .domain([0, max])
  .range([ height, 0]);
svg.append("g")
  .attr("id","y")
  .call(d3.axisLeft(y));
svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("x",18)
  .attr("y",-60)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Number of Cases");


  var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

   svg.selectAll("bar")
  .data(countryList)
  .enter()
  .append("rect")
    .attr("id","bar")
    .attr("x", function(d) { return x(d.NOC); })
    .attr("y", function(d) { return y(parseInt(d.totalMedals)); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) {return height - y(parseInt(d.totalMedals)); })
    .attr("fill", "red")
    .on("mouseover", function(d) {
      console.log(d.NOC);
      if(d3.select(this).style("opacity") != 0){
        d3.select(this).transition()        
            .duration(200)      
            .style("opacity", .85); 
    }
    var html  = "<span style = 'font-size:15px;color:black'><b>" + d.NOC + "</b></span></br>" +
    "<span style='font-size:12px;color:black'><b> Cases: </b>" + d.totalMedals + "</span></br>" +
    "<span style='font-size:12px;color:black'><b> Deaths: </b>" + d.gMedals + "</span>";
    div.transition()
    .duration(200)
    .style("opacity", 1);
    div.html(html)
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY +10 ) + "px")
    .style("width",130)
    .style("height",80)
    .style("background",function(){ return("lightblue");})

    })
    
    .on("mouseout", function(d) {
        div.transition()
        .duration(300)
        .style("opacity", 0);
        d3.select(this).transition()        
                .duration(200)      
                .style("opacity", 1); 
    })


    var rect = svg.append('rect').attr("x", 200).transition().duration(1000).attr("y", -50).attr("width", 400)
    .attr("height", 30).attr("fill","lightblue").attr("stroke","black").text("As of July 2022")

svg.append("g").append("text").attr("id","annotation").transition().duration(1000).attr("x", 210).attr("y", -30)
	.text("Medals by Countries in descending order of Medals").attr("font-size", "14px").attr("fill", "black").attr("font-weight","bold")

}};