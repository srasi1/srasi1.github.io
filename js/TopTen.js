var TopTen={
    display: async function() {
        d3.select("#TopTen").selectAll("text").remove();
        d3.select("#TopTen").selectAll("svg").remove();
        
        var margins = {top: 50, right: 50, bottom: 50, left: 50};
        //var width = 5000;
        //var height = 1200;
        var width = 800;
        var height = 800;


        const data = await d3.csv('https://srasi1.github.io/data/athlete_events.csv');
        //const data = await d3.csv("https://raw.githubusercontent.com/srasi1/srasi1.github.io/main/data/athlete_events.csv");

        var countryList = [];
        var gMedals = {};
        var sMedals = {};
        var bMedals = {};
        var totalMedals = {};

        for(var i = 0; i < data.length; i++){
            gMedals[data[i].NOC] = 0;
            sMedals[data[i].NOC] = 0;
            bMedals[data[i].NOC] = 0;
            totalMedals[data[i].NOC] = 0;
        }

        for(var i=0; i < data.length; i++) {
            country = data[i].NOC;
            countryList.push(country);

            if(data[i].Medal === "Gold") {
                gMedals[data[i].NOC]  = parseInt(gMedals[data[i].NOC]) + 1;
                totalMedals[data[i].NOC] = parseInt(totalMedals[data[i].NOC]) + 1;
            }

            if(data[i].Medal === "Silver") {
                sMedals[data[i].NOC]  = parseInt(sMedals[data[i].NOC]) + 1;
                totalMedals[data[i].NOC] = parseInt(totalMedals[data[i].NOC]) + 1;
            }

            if(data[i].Medal === "Bronze") {
                bMedals[data[i].NOC]  = parseInt(bMedals[data[i].NOC]) + 1;
                totalMedals[data[i].NOC] = parseInt(totalMedals[data[i].NOC]) + 1;
            }
        }

        var maxMedals = 0, maxCountry = '';

        for(const [cnty, totMed] of Object.entries(totalMedals)) {
            var x = parseInt(totMed);
            if (maxMedals < x) {
                maxMedals = x;
                maxCountry = cnty;
            }
        }


        let sortableCntList = [];
        for (var country in totalMedals) {
            sortableCntList.push([country, totalMedals[country]]);
        }

        // filtering for only countries with more than 0 medals in total
        sortableCntList = sortableCntList.filter(function (d) { 
            return parseInt(d.toString().split(",")[1]) > 600 
          });

        sortableCntList.sort(function(a, b) {
            return b[1] - a[1];
        });
        

        var svg = d3.select("#TopTen").append("svg")
            .attr("width", width + 2 * margins.left)
            .attr("height", height + 2 * margins.bottom);
              
        var x = d3.scaleBand()
            .domain(sortableCntList.map(function(d) { return d.toString().split(",")[0] ; }))
            .range([0, width])
            .padding(0.1);       

        var y = d3.scaleLinear()
            .domain([0, maxMedals + 100])
            .range([height, 0]);

        svg.append("g").attr("transform", "translate("+ margins.left +","+ margins.right +")").selectAll("rect")
            .data(sortableCntList)
            .enter().append("rect")
            .attr("x", function(d, i) { return x(d.toString().split(",")[0]); })
            .attr("y", function(d, i) { return y(parseInt(d.toString().split(",")[1])); } )
            //.attr("width", x.bandwidth())
            .attr("width", 20)
            //.attr("height", function(d, i) { return height - y(parseInt(d.toString().split(",")[1])); })
            .attr("height", function(d, i) { 
                    var cntry = d.toString().split(",")[0];
                    var tMedals = parseInt(gMedals[cntry]) + parseInt(sMedals[cntry]) + parseInt(bMedals[cntry]);
                    return height - y(tMedals); 
                })
            .on("mouseover", dv_onMouseOver)
            .on("mouseout", dv_OnMouseOut);

        //d3.select("#TopTen")
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

        var y_label = d3.select('#TopTen')
            .append('div')
            .attr('class', 'y label');

        //d3.select("svg").append("g").append("text")
        svg.append("text")
            .attr("class", "y label")
            //.attr("text-anchor", "end")
            .attr("x", 100)
            .attr("y", height - 800)
            .attr("dy", ".75em")
            //.selectAll("text")
            .attr("transform", "translate(0," + height + ") rotate(-90)")
            .text("Total Number of Medals Won");
        
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

        var dv_tooltip = d3.select('#TopTen')
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
            var html = "<span style = 'font-size:15px;color:mediumorchid'><b> Country: </b>" + d.toString().split(",")[0] + "</span></br>" +
            //"<span style = 'font-size:12px;color:mediumorchid'><b> Total Medals: </b>" + parseInt(d.toString().split(",")[1]) + "</span>";
            "<span style = 'font-size:12px;color:mediumorchid'><b> Gold Medals: </b>" + gMedals[d.toString().split(",")[0]] + "</span></br>" +
            "<span style = 'font-size:12px;color:mediumorchid'><b> Silver Medals: </b>" + sMedals[d.toString().split(",")[0]] + "</span></br>" +
            "<span style = 'font-size:12px;color:mediumorchid'><b> Bronze Medals: </b>" + bMedals[d.toString().split(",")[0]] + "</span>";
            
            dv_tooltip
            .style('display', 'inline')
            .html(html)
            .style('position', "absolute")
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY + 10) + 'px')
            .style('width', 100)
            .style('height', 80)
            .style('background', function(){ return("lightgrey"); });

        }

        function dv_OnMouseOut() {
            d3.select(this).attr("r", 4);
            dv_tooltip.style('display', 'none');
        }

        // Adding Annotation Code here
        //alert(sortableCntList[0]);
        var cntName = "United States Of America";
        var usaMedals = parseInt(sortableCntList[0].toString().split(",")[1]);

        const annotations = [
            {
                note: {
                    label: "" + cntName + " --> " + usaMedals + " ",
                    lineType: "none",
                    bgPadding: {"top": 10, "left": 10, "right": 10, "bottom": 10},
                    title: "Highest Number of Medals Won",
                    orientation: "leftRight",
                    "align": "middle"
                },
                type: d3.annotationCalloutElbow,
                connector: { end: "arrow" },
                subject: {radius: 5},
                x: x + 5,
                y: y + usaMedals,
                dx: "60",
                dy: "60"
            },
        ];

        const calloutWithArrow = d3.annotationCustomType(d3.annotationCalloutElbow, {
            connector: { end: "arrow" },
          });

        //const makeAnnotations = d3.annotation().type(calloutWithArrow).annotations(annotations);
        const makeAnnotations = d3.annotation().annotations(annotations);

        d3.select("svg")
            .append("g")
            .attr("transform",
                "translate(" + margins.left + "," + margins.top + ")")
            .attr("class", "annotation-group")
            .call(makeAnnotations)

        // Annotation code ends here

    }
}