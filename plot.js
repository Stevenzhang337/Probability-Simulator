
function plotData() {
    var dataPoints = [];
    var table = document.getElementById("valueTable").children[2].children
    for (var i = 0; i < table.length; i ++) {
        var val = parseFloat(table[i].cells[1].innerHTML)
        if (!isNaN(val))
        {
            dataPoints[i] = val
        }
    }
    console.log(dataPoints)
    
    var trace = {
        x: dataPoints,
        type: 'histogram',
    };
    var data = [trace];

    var layout = {
        height : 320,
    }
    Plotly.newPlot('plotGraph', data, layout, {displayModeBar: false}, {staticPlot: true});
}
function culumativePlot() {
    var dataPoints = [];
    var table = document.getElementById("valueTable").children[2].children
    for (var i = 0; i < table.length; i ++) {
        var val = parseFloat(table[i].cells[1].innerHTML)
        if (!isNaN(val))
        {
            dataPoints[i] = val
        }
    }
    
    var trace = {
        x: dataPoints,
        type: 'histogram',
        cumulative : {enabled: true}
    };
    var data = [trace];

    var layout = {
        height : 320,
    }
    Plotly.newPlot('plotGraph', data, layout, {displayModeBar: false}, {staticPlot: true});
}

document.getElementById("plot").onclick = function() {
    plotData()
}
document.getElementById("plotCul").onclick = function() {
    culumativePlot()
}
plotData()