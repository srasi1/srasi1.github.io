var YearCountry={
    // Year-Season (Games) is Dropdown
    display: async function() {
        d3.select("#YearCountry").selectAll("text").remove();
        d3.select("#YearCountry").selectAll("svg").remove();
        d3.select("#YearCountry").selectAll("#gameDiv").remove();
        
        var margins = {top: 50, right: 50, bottom: 50, left: 50};
        //var width = 5000;
        //var height = 1200;
        var width = 1000;
        var height = 500;

        const data = await d3.csv('https://srasi1.github.io/data/athlete_events.csv');
        //const data = await d3.csv("https://raw.githubusercontent.com/srasi1/srasi1.github.io/main/data/athlete_events.csv");

        var gamesList = data.map(rec => rec["Games"]);
        gamesList = [...new Set(gamesList)].sort();

        var countryList = data.map(rec => rec["NOC"]);
        countryList = [...new Set(countryList)];
        
        var maxMedals = 0, maxCountry = '';

        function getSortedList(game) {
            var filteredData = data.filter(function (d) { return d.Games === game; });

            var gMedals = {};
            var sMedals = {};
            var bMedals = {};
            var totalMedals = {};
            var sortableCntList = [];

            for(var i = 0; i < filteredData.length; i++){
                gMedals[filteredData[i].NOC] = 0;
                sMedals[filteredData[i].NOC] = 0;
                bMedals[filteredData[i].NOC] = 0;
                totalMedals[filteredData[i].NOC] = 0;
            }

            for(var i=0; i < filteredData.length; i++) {
    
                if(filteredData[i].Medal === "Gold") {
                    gMedals[filteredData[i].NOC]  = parseInt(gMedals[filteredData[i].NOC]) + 1;
                    totalMedals[filteredData[i].NOC] = parseInt(totalMedals[filteredData[i].NOC]) + 1;
                }
    
                if(filteredData[i].Medal === "Silver") {
                    sMedals[filteredData[i].NOC]  = parseInt(sMedals[filteredData[i].NOC]) + 1;
                    totalMedals[filteredData[i].NOC] = parseInt(totalMedals[filteredData[i].NOC]) + 1;
                }
    
                if(filteredData[i].Medal === "Bronze") {
                    bMedals[filteredData[i].NOC]  = parseInt(bMedals[filteredData[i].NOC]) + 1;
                    totalMedals[filteredData[i].NOC] = parseInt(totalMedals[filteredData[i].NOC]) + 1;
                }
            }

            for(const [cnty, totMed] of Object.entries(totalMedals)) {
                var x = parseInt(totMed);
                if (maxMedals < x) {
                    maxMedals = x;
                    maxCountry = cnty;
                }
            }

            for (var country in totalMedals) {
                sortableCntList.push([country, totalMedals[country]]);
            }

            sortableCntList = sortableCntList.filter(function (d) { 
                return parseInt(d.toString().split(",")[1]) > 0 
            });

            sortableCntList.sort(function(a, b) {
                return b[1] - a[1];
            });

            return sortableCntList;

        }

        /*d3.select("#YearCountry").append("svg")
            .attr("height", 20)
            .append("g")
            .append("text")
            .transition()
            .duration(100)
            .attr("x", 0).attr("y", 20)
            .attr("id", "annotation")
            .text("Hover the mouse")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .style("fill", "blue");*/

        d3.select("#YearCountry").append("div")
            .attr("id", "gameDiv")
            .append("label")
            .text("Select a Game (Year Season): ")
            .attr("style", "font-size:15px;font-weight:bold;");

        d3.select("#YearCountry")
            .select("#gameDiv")
            .append("select")
            .attr("id", "gameButton")
            .selectAll("myOptions")
            .data(gamesList)
            .enter().append("option")
            .text(function (d) { return d; })
            .attr("value", function(d) { return d; });
        
        //var initList = getSortedList('1896 Summer');
        refreshChart('1896 Summer');
        
        d3.select('#gameButton').on("change", function(d) {
            var selectedGame = d3.select(this).property("value");
            refreshChart(selectedGame);
        })
        
        function refreshChart(game) {

            d3.select("#YearCountry").selectAll("text").remove();
            d3.select("#YearCountry").selectAll("svg").remove();
            d3.select("#YearCountry").selectAll("g").remove();
            //console.log("All removed");

            var sortedList = getSortedList(game);

            var svg = d3.select("#YearCountry").append("svg")
                .attr("width", width + 2 * margins.left)
                .attr("height", height + 2 * margins.bottom);

            var x = d3.scaleBand()
                .domain(sortedList.map(function(d) { return d.toString().split(",")[0] ; }))
                .range([0, width])
                .padding(0.1);
            
            var y = d3.scaleLinear()
                .domain([0, maxMedals + 100])
                .range([height, 0]);

            svg.append("g").attr("transform", "translate("+ margins.left +","+ margins.right +")").selectAll("rect")
                .data(sortedList)
                .enter().append("rect")
                .attr("x", function(d, i) { return x(d.toString().split(",")[0]); })
                .attr("y", function(d, i) { return y(parseInt(d.toString().split(",")[1])); } )
                .attr("width", x.bandwidth())
                .attr("height", function(d, i) { return height - y(parseInt(d.toString().split(",")[1])); })
                .on("mouseover", dv_onMouseOver)
                .on("mouseout", dv_OnMouseOut);
            
            //d3.select("#YearCountry")
            svg.append("svg")
                .attr("height",20)
                .append("g")
                .append('text')
                .transition().duration(300)
                    .attr("x", 0).attr("y", 20)
                    .attr("id","annotation")
                .text("Hover the mouse over the Bars for more details")
                    .attr("font-size", "12px")
                    .attr("font-weight","italic").style("fill", "mediumorchid").attr("font-weight","bold");

            //d3.select("svg").append("g")
            svg.append("g")
                .attr("id", "y")
                .attr("transform", "translate("+margins.top+","+margins.bottom+")")
                .call(d3.axisLeft(y));

            svg.append("text")
                .attr("class", "y label")
                //.attr("text-anchor", "end")
                .attr("x", 100)
                .attr("y", height - 500)
                .attr("dy", ".75em")
                //.selectAll("text")
                .attr("transform", "translate(0," + height + ") rotate(-90)")
                .text("Number of Medals Won");
            
            //var g = d3.select("svg").append("g")
            svg.append("g")
                .attr("transform", "translate("+margins.top+","+(height+margins.bottom)+")")
                .attr("id", "x")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10, 0)rotate(-45)")
                .style("text-anchor", "end");

            svg.append("text")
                .attr("class", "x label")
                .attr("x", 500)
                .attr("y", height + 95)
                .text("Country - Olympic Country Code")

            // Tooltip code starts here

            var dv_tooltip = d3.select('#YearCountry')
                .append('div')
                .attr('class', 'tooltip')
                .style('display', 'none');
        
            function dv_onMouseOver() {
                d3.select(this)
                .attr("r", 10)
                .transition()
                .duration(200)
                .style("opacity", 1.85);
            
                var d = d3.select(this).data()[0]
                var html = "<span style = 'font-size:15px;color:mediumorchid;position:center'><b>" + game + "</b></span></br>" +
                "<span style = 'font-size:15px;color:mediumorchid'><b> Country: </b>" + d.toString().split(",")[0] + "</span></br>" +
                "<span style = 'font-size:12px;color:mediumorchid'><b> Total Medals: </b>" + parseInt(d.toString().split(",")[1]) + "</span>";
            
                dv_tooltip
                    .style('display', 'inline')
                    .html(html)
                    .style('position', "absolute")
                    .style('left', (d3.event.pageX + 10) + 'px')
                    .style('top', (d3.event.pageY + 10) + 'px')
                    .style('width', 150)
                    .style('height', 100)
                    .style('background', function(){ return("lightgrey"); });

            }

            function dv_OnMouseOut() {
                d3.select(this).attr("r", 4);
                dv_tooltip.style('display', 'none');
            }

            // Tooltip code ends here

        }

    }
}