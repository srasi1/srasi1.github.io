var YearCountry={
    // Year-Season (Games) is Dropdown
    display: async function() {
        d3.select("#YearCountry").selectAll("text").remove();
        d3.select("#YearCountry").selectAll("svg").remove();
        d3.select("#YearCountry").selectAll("#gameDiv").remove();
        
        var margins = {top: 50, right: 50, bottom: 50, left: 50};
        //var width = 5000;
        //var height = 1200;
        var width = 500;
        var height = 500;

        const data = await d3.csv('https://srasi1.github.io/data/athlete_events.csv');
        //const data = await d3.csv("https://raw.githubusercontent.com/srasi1/srasi1.github.io/main/data/athlete_events.csv");

        var gamesList = data.map(rec => rec["Games"]);
        gamesList = [...new Set(gamesList)].sort();

        var countryList = [];
        var gMedals = {};
        var sMedals = {};
        var bMedals = {};
        var totalMedals = {};
        var maxMedals = 0, maxCountry = '';
        var sortableCntList = [];

        function getSortedList(game) {
            var filteredData = data.filter(function (d) { return d.Games === game; });

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

            sortableCntList.sort(function(a, b) {
                return b[1] - a[1];
            });

            return sortableCntList;

        }

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
        
        d3.select('#gameButton').on("change", function(d) {
            var selectedGame = d3.select(this).property("value");
            refreshChart(selectedGame);
        })
        
        function refreshChart(game) {
            var sortedList = getSortedList(game);

            d3.select("#YearCountry").selectAll("text").remove();
            d3.select("#YearCountry").selectAll("svg").remove();

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
                .attr("height", function(d, i) { return height - y(parseInt(d.toString().split(",")[1])); });
            
            d3.select("#YearCountry")
                .append("svg")
                .attr("height",20)
                .append("g")
                .append('text')
                .transition().duration(300)
                    .attr("x", 0).attr("y", 10)
                    .attr("id","annotation")
                .text("Hover the mouse over the Bars for more details")
                    .attr("font-size", "12px")
                    .attr("font-weight","italic").style("fill", "blue").attr("font-weight","bold");

            d3.select("svg").append("g")
                .attr("transform", "translate("+margins.top+","+margins.bottom+")")
                .call(d3.axisLeft(y));
            
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("x", 5)
                .attr("y", -100) 
                .selectAll("text")
                .attr("transform", "rotate(-90)")
                .text("Number of Total Medals");
            
            var g = d3.select("svg").append("g")
                .attr("transform", "translate("+margins.top+","+(height+margins.bottom)+")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10, 0)rotate(-45)")
                .style("text-anchor", "end");

        } 

    }
}