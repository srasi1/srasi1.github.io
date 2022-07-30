var Overall = {
    display: async function() {
        d3.select("#Overall").selectAll("text").remove();
        d3.select("#Overall").selectAll("svg").remove();

        

        var margins = {top: 50, right: 50, bottom: 50, left: 50};
        var width = 5000;
        var height = 1200;

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

        sortableCntList.sort(function(a, b) {
            return b[1] - a[1];
        });

        var svg = d3.select("svg")
              .attr("width", width + 2 * margins.left)
              .attr("height", height + 2 * margins.bottom);
              
              var x = d3.scaleBand()
              .domain(sortableCntList.map(function(d) { return d.toString().split(",")[0] ; }))
              .range([0, width]);

              var y = d3.scaleLinear()
              //.domain(sortableCntList.map(function(d) { return parseInt(d.toString().split(",")[1]) ; }))
              .domain([0, maxMedals])
              .range([height, 0]);

              svg.append("g").attr("transform", "translate("+ margins.left +","+ margins.right +")").selectAll("rect")
                .data(sortableCntList)
                .enter().append("rect")
                .attr("x", function(d, i) { return x(d.toString().split(",")[0]); })
                .attr("y", function(d, i) { return y(parseInt(d.toString().split(",")[1])); } )
                .attr("width", x.bandwidth())
              //.attr("width", 10)
                //.attr("height", function(d, i) { return y(parseInt(d.toString().split(",")[1])); });
                .attr("height", function(d, i) { return height - y(parseInt(d.toString().split(",")[1])); });


              d3.select("svg").append("g")
                .attr("transform", "translate("+margins.top+","+margins.bottom+")")
                .call(d3.axisLeft(y));

              var g = d3.select("svg").append("g")
              .attr("transform", "translate("+margins.top+","+(height+margins.bottom)+")")
              .call(d3.axisBottom(x));


    }
}