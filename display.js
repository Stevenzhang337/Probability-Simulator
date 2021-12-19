//Random Variable Buttons
function activeButton(id, output) {
    document.getElementById(id).onclick = function() {
        document.getElementById("mathDisplay").value += output
    }
}
activeButton("uniformD", "UniformD(")
activeButton("binomial", "Binomial(")
activeButton("geometric", "Geometric(")
activeButton("poisson", "Poisson(")

activeButton("uniformC", "UniformC(")
activeButton("normal", "Normal(")
activeButton("exponential", "Exponential(")

activeButton("power", "^")
activeButton("sqrt", "sqrt(")
activeButton("log", "ln(")
activeButton("sin", "sin(")
activeButton("cos", "cos(")
activeButton("tan", "tan(")
activeButton("e", "e")
activeButton("pi", "pi")

//evaluate functions
var currRV = ""
function evalForm() {
    var display = document.getElementById("mathDisplay").value

    display = display.replace(" ", "")
    //discrete
    display = display.replaceAll("UniformD", "prob.Discrete.uniform")
    display = display.replaceAll("Binomial", "prob.Discrete.binomial")
    display = display.replaceAll("Geometric", "prob.Discrete.geometric")
    display = display.replaceAll("Poisson", "prob.Discrete.poisson")
    //continous
    display = display.replaceAll("UniformC", "prob.Continous.uniform")
    display = display.replaceAll("Normal", "prob.Continous.normal")
    display = display.replaceAll("Exponential", "prob.Continous.exp")

    //math operations
    display = display.replaceAll("^", "**")
    display = display.replaceAll("sqrt", "Math.sqrt")
    display = display.replaceAll("ln", "Math.log")
    display = display.replaceAll("sin", "Math.sin")
    display = display.replaceAll("cos", "Math.cos")
    display = display.replaceAll("tan", "Math.tan")
    display = display.replaceAll("e^", "Math.E*")
    display = display.replaceAll("e+", "Math.E+")
    display = display.replaceAll("e-", "Math.E-")
    display = display.replaceAll("e*", "Math.E*")
    display = display.replaceAll("e/", "Math.E/")
    display = display.replaceAll("e)", "Math.E)")
    display = display.replaceAll("pi", "Math.PI")
    return display
}
function evaluate() {
    var display = evalForm()

    if (document.getElementById("mathDisplay").value != currRV) {
        findEV()
        findVar()
        if (currRV != "") appendRVToTable()
    }
    currRV = document.getElementById("mathDisplay").value
    appendRV()

    var content = document.getElementById("show")
    try {
        var val = eval(display).toFixed(3)
        content.innerHTML = val
        appendTable(num, val)
        num++
    }
    catch(err) {
        content.innerHTML = "Invalid Input"
    }
}

document.getElementById("eval").onclick = function() {
    evaluate()
    setRange()
}
document.getElementById("eval20").onclick = function() {
    for (let i = 0; i < 20; i++) {
        evaluate()
    }
    setRange()
}
document.getElementById("eval100").onclick = function() {
    for (let i = 0; i < 100; i++) {
        evaluate()
    }
    setRange()
}


//table functions
var num = 1
function appendTable(num, val) {
    var table = document.getElementById("valueTable").children[2]
    var row = table.insertRow(0)
    var cell1 = row.insertCell(0)
    var cell2 = row.insertCell(1)
    cell1.innerHTML = num
    cell2.innerHTML = val
}
document.getElementById("reset").onclick = function() {
    var table = document.getElementById("valueTable")
    table.children[2].remove()
    table.appendChild(document.createElement("tbody"))
    num = 0
}
function appendRV() {
    document.getElementById("valueTable").children[1].innerHTML = currRV 
}
function appendRVToTable() {
    var table = document.getElementById("valueTable").children[2]
    var row = table.insertRow(0)
    var cell1 = row.insertCell(0)
    var cell2 = row.insertCell(1)
    cell1.innerHTML = "prev RV"
    cell2.innerHTML = currRV
}


//expected values and variance
function findEV() {
    var display = document.getElementById("mathDisplay").value
    display = display.replace(" ", "")
    if (isSimpleRV(display)) {
        display = display.replaceAll("UniformD", "ExpectedValue.UniformEV")
        display = display.replaceAll("Binomial", "ExpectedValue.BinomialEV")
        display = display.replaceAll("Geometric", "ExpectedValue.GeometricEV")
        display = display.replaceAll("Poisson", "ExpectedValue.PoissonEV")
    
        display = display.replaceAll("UniformC", "ExpectedValue.UniformEV")
        display = display.replaceAll("Normal", "ExpectedValue.NormalEV")
        display = display.replaceAll("Exponential", "ExpectedValue.ExpEV")

        document.getElementById("EV").childNodes[0].nodeValue = "E(X) = " + eval(display).toFixed(3)
        document.getElementById("EVButton").style.display = "none"
    }
    else {
        document.getElementById("EV").childNodes[0].nodeValue = "E(X) = "
        document.getElementById("EVButton").style.display = "inline"
    }

}

function findVar() {
    var display = document.getElementById("mathDisplay").value
    if (display == currRV) return
    display = display.replace(" ", "")
    if (isSimpleRV(display)) {
        display = display.replaceAll("UniformD", "Variance.UniformVar")
        display = display.replaceAll("Binomial", "Variance.BinomialVar")
        display = display.replaceAll("Geometric", "Variance.GeometricVar")
        display = display.replaceAll("Poisson", "Variance.PoissonVar")
    
        display = display.replaceAll("UniformC", "Variance.UniformVar")
        display = display.replaceAll("Normal", "Variance.NormalVar")
        display = display.replaceAll("Exponential", "Variance.ExpVar")

        display = display.replaceAll("^", "**")

        document.getElementById("Var").childNodes[0].nodeValue = "Var(X) = " + eval(display).toFixed(3)
        document.getElementById("VarButton").style.display = "none"
    }
    else {
        document.getElementById("Var").childNodes[0].nodeValue = "Var(X) = "
        document.getElementById("VarButton").style.display = "inline"
    }
}
document.getElementById("EVButton").onclick = function() {
    var EV = approxEV()
    document.getElementById("EV").childNodes[0].nodeValue = "E(X) = " + EV.toFixed(2)
    document.getElementById("EVButton").style.display = "none"
}

document.getElementById("VarButton").onclick = function() {
    var EV = approxEV()
    var Var = approxVar(EV)
    document.getElementById("Var").childNodes[0].nodeValue = "Var(X) = " + Var.toFixed(2)
    document.getElementById("VarButton").style.display = "none"
}

function approxEV() {
    var sum = 0
    for (let i = 0; i < 5000; i++) {
        var val = evalForm(display)
        sum += eval(val)
    }
    return sum / 5000
}
function approxVar(EV) {
    var sum = 0
    for (let i = 0; i < 5000; i++) {
        var val = evalForm(display)
        sum += (eval(val) - EV)**2
    }
    return sum / 5000
}

function setRange() {
    var display = document.getElementById("mathDisplay").value
    display = display.replace(" ", "")
    var isDiscrete = false

    if (isSimplierRV(display)) {
        if (display.includes("UniformD")) {
            display = display.replace("UniformD", "Math.max")
            max = eval(display)
            display = display.replace("max", "min")
            min = eval(display)
            isDiscrete = true
        }
        else if (display.includes("Binomial")) {
            display = display.replace("Binomial(", "")
            max = display.substring(0, display.indexOf(","))
            min = 0
            isDiscrete = true
        }
        else if (display.includes("Geometric")) {
            display = display.replace("Geometric(", "")
            display = display.replace(")", "")
            max = 8 / parseFloat(display)
            min = 0
            isDiscrete = true 
        }
        else if (display.includes("Poisson")) {
            display = display.replace("Poisson(", "")
            display = display.replace(")", "")
            max = 4 * parseFloat(display)
            min = 0
            isDiscrete = true 
        }
        else if (display.includes("UniformC")) {
            display = display.replace("UniformC", "Math.max")
            max = eval(display)
            display = display.replace("max", "min")
            min = eval(display)
            isDiscrete = false
        }
        else if (display.includes("Exponential")) {
            display = display.replace("Exponential(", "")
            display = display.replace(")", "")
            max = 8 / parseFloat(display)
            min = 0
            isDiscrete = false 
        }
        document.getElementById("approxProb").style.display = "none"

        document.getElementById("slider").min = min
        document.getElementById("slider").max = max
        document.getElementById("slider").value = (min + max) / 2
    
        document.getElementById("slider1").min = min
        document.getElementById("slider1").max = max
        document.getElementById("slider1").value = (min + max) / 2
        if (!isDiscrete) {
            document.getElementById("slider").step = .01
            document.getElementById("slider1").step = .01
        }
        else {
            document.getElementById("slider").step = 1
            document.getElementById("slider1").step = 1
        }
    }
    else {
        document.getElementById("approxProb").style.display = "inline"
        document.getElementById("slider").min = 0
        document.getElementById("slider").max = 0
        document.getElementById("slider").value = 0
        document.getElementById("prob").innerHTML = "P[X = k]"
        document.getElementById("slider1").min = 0
        document.getElementById("slider1").max = 0
        document.getElementById("slider1").value = 0
        document.getElementById("prob1").innerHTML = "P[X < k]"
        dataPoints = []
    }
    

}
var dataPoints = []
document.getElementById("approxProb").onclick = function() {
    isDiscrete = true
    var table = document.getElementById("valueTable").children[2].children
    for (var i = 0; i < table.length; i ++) {
        var val = parseFloat(table[i].cells[1].innerHTML)
        if (!isNaN(val)) dataPoints.push(val)
        if (!Number.isInteger(val)) isDiscrete = false
    }
    dataPoints = dataPoints.sort()

    var max = Math.max.apply(null, dataPoints)
    var min = Math.min.apply(null, dataPoints)

    document.getElementById("slider").min = min
    document.getElementById("slider").max = max
    document.getElementById("slider").value = (min + max) / 2

    document.getElementById("slider1").min = min
    document.getElementById("slider1").max = max
    document.getElementById("slider1").value = (min + max) / 2

    if (!isDiscrete) {
        document.getElementById("slider").step = .01
        document.getElementById("slider1").step = .01
    }
    else {
        document.getElementById("slider").step = 1
        document.getElementById("slider1").step = 1
    }

    document.getElementById("approxProb").style.display = "none"
}

document.getElementById("slider").oninput = function() {
    var val = document.getElementById("slider").value

    var display = document.getElementById("mathDisplay").value
    display = display.replace(" ", "")

    if (isSimplierRV(display)) {
            if (display.includes("UniformD(")) {
                display = display.replace("UniformD", "probability.UniformProb")
            }
            else if (display.includes("Binomial(")) {
                display = display.replace("Binomial", "probability.BinomialProb")
            }
            else if (display.includes("Geometric(")) {
                display = display.replace("Geometric", "probability.GeometricProb")
            }
            else if (display.includes("Poisson(")) {
                display = display.replace("Poisson", "probability.PoissonProb")
            }
            else if (display.includes("UniformC(")) {
                display = display.replace("UniformC", "probability.UniformCProb")
            }
            else if (display.includes("Normal(")) {
                display = display.replace("Normal", "probability.NormalProb")
            }
            else if (display.includes("Exponential(")) {
                display = display.replace("Exponential", "probability.ExpProb")
            }
            display = display.replace(")", "," + String(val) + ")")
            document.getElementById("prob").innerHTML = "P[X = " + val + "] = " + eval(display).toFixed(3)
        }
    else {
        var total = 0
        if (document.getElementById("slider").step == 1) {
            for (let i = 0; i < dataPoints.length; i++) {
                if (dataPoints[i] == val) total += 1
            }  
        }
        document.getElementById("prob").innerHTML = "P[X = " + val + "] = " + (total / dataPoints.length).toFixed(3)
    }



}
document.getElementById("slider1").oninput = function() {
    var val = document.getElementById("slider1").value

    var display = document.getElementById("mathDisplay").value
    display = display.replace(" ", "")

    if (isSimplierRV(display)) {
        if (display.includes("UniformD(")) {
            display = display.replace("UniformD", "probability.UniformCul")
        }
        else if (display.includes("Binomial(")) {
            display = display.replace("Binomial", "probability.BinomialCul")
        }
        else if (display.includes("Geometric(")) {
            display = display.replace("Geometric", "probability.GeometricCul")
        }
        else if (display.includes("Poisson(")) {
            display = display.replace("Poisson", "probability.PoissonCul")
        }
        else if (display.includes("UniformC(")) {
            display = display.replace("UniformC", "probability.UniformCul")
        }
        else if (display.includes("Normal(")) {
            display = display.replace("Normal", "probability.NormalCul")
        }
        else if (display.includes("Exponential(")) {
            display = display.replace("Exponential", "probability.ExpCul")
        }
        display = display.replace(")", "," + String(val) + ")")
        document.getElementById("prob1").childNodes[0].nodeValue = "P[X < " + val + "] = " + eval(display).toFixed(3)
    }
    else {
        var total = 0
        for (let i = 0; i < dataPoints.length; i++) {
            if (dataPoints[i] < val) total += 1
        }
        document.getElementById("prob1").innerHTML = "P[X < " + val + "] = " + (total / dataPoints.length).toFixed(3)
    }
    
}

function isSimpleRV(RV) {
    if (RV.includes("*")) return false
    if (RV.includes("/")) return false
    if (RV.includes("^")) return false
    if (RV.includes("sqrt")) return false
    if (RV.includes("sin")) return false
    if (RV.includes("cos")) return false
    if (RV.includes("tan")) return false
    if (RV.includes("ln")) return false
    return true
}
function isSimplierRV(RV) {
    if (RV.includes("+")) return false
    if (RV.includes("-")) return false
    if (!isSimpleRV(RV)) return false
    return true
}