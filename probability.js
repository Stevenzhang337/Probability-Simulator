var prob = (function() {
    //discrete random variables
    class Discrete {
        static uniform (a, b) {
            if (a > b) {throw new Error("require a <= b")}
            return Math.floor((b - a + 1) * Math.random()) + a
        }
        static binomial (n, p) {
            if (0 > p || 1 < p) {throw new Error("require 0 <= p <= 1")}
            var res = 0
            for (let i = 0; i < n; i++) {
                if (Math.random() < p) {
                    res++
                }
            }
            return res
        }
        static geometric (p) {
            if (0 > p || 1 < p) {throw new Error("require 0 <= p <= 1")}
            var res = 0
            while (p < Math.random()) {
                res++
            }
            return res
        }
        //knuth algorithm
        static poisson (lambda) {
            let L = Math.E ** (-1 * lambda)
            let k = 0; let p = 1
            while (p > L) {
                k++
                p = p * Math.random()
            }
            return k - 1
        }
    }
    class Continous {
        static uniform (a, b) {
            if (a > b) {throw new Error("require a <= b")}
            return ((b - a) * Math.random() + a)
        }
        static normal (mean, vari) {
            let std = Math.sqrt (-2 * Math.log(Math.random())) * Math.cos (2 * Math.PI * Math.random())
            return (std * vari + mean)
        }
        static exp (lambda) {
            if (lambda <= 0) throw new Error("require lambda must be positive")
            return (-1 * Math.log (Math.random ()) / lambda)
        }
    }
    return {
        Discrete : Discrete,
        Continous : Continous 
    }
})()

function EV(dataset) {
    var sum = 0
    for (let i = 0; i < dataset.length; i++) {
        sum += dataset[i]
    }
    return sum / dataset.length
}
function Var(dataset, EV)  {
    var sum = 0
    for (let i = 0; i < dataset.length; i++) {
        sum += (dataset[i] - EV)**2
    }
    return sum / dataset.length
}

var ExpectedValue = (function() {
    return {
        UniformEV : (a, b) => (a + b) / 2,
        BinomialEV : (n, p) => n * p,
        GeometricEV : (p) => 1 / p,
        PoissonEV : (lambda) => lambda,
        NormalEV : (mean, vari) => mean,
        ExpEV : (lambda) => 1 / lambda
    }
})()

var Variance = (function() {
    return {
        UniformVar : (a, b) => (a + b) / 2,
        BinomialVar : (n, p) => n * p * (1 - p),
        GeometricVar : (p) => (1 - p) / p**2,
        PoissonVar : (lambda) => lambda,
        NormalVar : (mean, vari) => vari,
        ExpVar : (lambda) => 1 / lambda**2
    }
})()

var probability = (function() {

    function UniformProb(a, b, i) {
        return 1 / (b - a)
    }
    function factorial(n) {
        if (n == 0) return 1
        else return n * factorial(n - 1)

    }
    function combinations(n, k) {
        return factorial(n) / (factorial(n - k) * factorial(k))

    }
    function BinomialProb(n, p, k) {
        return combinations(n, k) * (p ** k) * ((1 - p) ** (n - k))
    }
    function GeometricProb(p, k) {
        return ((1 - p) ** k) * p
    }
    function PoissonProb(lambda, k) {
        return (lambda ** k) * Math.E**(-1 * lambda) / factorial(k)
    }

    function UniformCul(a, b, i) {
        return (i - a) / (b - a)
    }
    function BinomialCul(n, p, k) {
        var sum = 0
        for (let i = 0; i <= k; i++) {
            sum += BinomialProb(n, p, i)
        }
        return sum
    }
    function GeometricCul(p, k) {
        return 1 - (1 - p)**(k + 1)
    }
    function PoissonCul(lambda, k) {
        sum = 0
        for (let i = 0; i <= k; i++) {
            sum += PoissonProb(lambda, i)
        }
        return sum
    }

    function ExpCul(lambda, k) {
        return 1 - Math.E**(-1 * lambda * k)
    }
    return {
        UniformProb : (a, b, i) => UniformProb(a, b, i),
        BinomialProb : (n, p, k) => BinomialProb(n, p, k),
        GeometricProb : (p, k) => GeometricProb(p, k), 
        PoissonProb : (lambda, k) => PoissonProb(lambda, k),
        UniformCProb : (a, b, i) => 0,
        NormalProb : (mean, vari, k) => 0,
        ExpProb : (lambda, k) => 0,
        UniformCul : (a, b, i) => UniformCul(a, b, i),
        BinomialCul : (n, p, k) => BinomialCul(n, p, k),
        GeometricCul : (p, k) => GeometricCul(p, k),
        PoissonCul : (lambda, k) => PoissonCul(lambda, k),
        ExpCul : (lambda, k) => ExpCul(lambda, k)
    }
})()