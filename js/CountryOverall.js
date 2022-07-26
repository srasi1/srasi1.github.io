const d3 = require("react-d3-library");

var Overall = {
    display: async function() {
        d3.select("#Overall").selectAll("text").remove();
        d3.select("#Overall").selectAll("svg").remove();

        var margins = {top: 50, right: 100, botton: 70, left: 260};
        var width  = 1300 - margins.left - margins.right;
        var height = 500 - margins.top - margins.botton;
        var data = await(d3.csv("https://raw.githubusercontent.com/srasi1/srasi1.github.io/main/data/athlete_events.csv"));
        
        var countryList = [];
        var gmedals = {};
        var smedals = {};
        var bmedals = {};
        var totalMedals = {};

        // Preparing Country List
        for(var i=0; i < data.length; i++) {
            if(countryList.indexOf(data[i].NOC) === -1) {
                countryList.push(data[i].NOC);
                gmedals[data[i].NOC] = 0;
                smedals[data[i].NOC] = 0;
                bmedals[data[i].NOC] = 0;
                totalMedals[data[i].NOC] = 0;
            }
        }
        
        // Preparing Number of medals (Gold, Silver and Bronze) for each country
        for(var i=0; i < data.length; i++) {
            if(data[i].Medal === "Gold") {
                gmedals[data[i].NOC] = parseInt(gmedals[data[i].NOC]) + 1;
                totalMedals[data[i].NOC] = parseInt(totalMedals[data[i].NOC]) + 1;
            }
            if(data[i].Medal === "Silver") {
                smedals[data[i].NOC] = parseInt(smedals[data[i].NOC]) + 1;
                totalMedals[data[i].NOC] = parseInt(totalMedals[data[i].NOC]) + 1;
            }
            if(data[i].Medal === "Bronze") {
                bmedals[data[i].NOC] = parseInt(bmedals[data[i].NOC]) + 1;
                totalMedals[data[i].NOC] = parseInt(totalMedals[data[i].NOC]) + 1;
            }
            
        }

    }
}