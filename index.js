//set up variables
let upgradeBaseCost = [10,50,100,250];
let upgradeCostMult = [0.5,0.35,0.75,2];
let upgradeLevel = [0,0,0,0];
let upgradeStep = [1,0.1,0.05,0.01];

let moolah = 1;
let mpt = 0;
let tickspeed = 1;
let running = true;
let framerate = 24;


function calculateMPT() {
    //calculate Money per Tick
    let addition = 1 + upgradeLevel[0] * upgradeStep[0];
    let multiplication = 1 + upgradeLevel[1] * upgradeStep[1];
    let exponentiation = 1 + upgradeLevel[2] * upgradeStep[2];
    let tetration = 1 + upgradeLevel[3] * upgradeStep[3];

    return(Math.pow(Math.pow((addition * multiplication), exponentiation), tetration));
}


function updateValues() {
    let addition = 1 + upgradeLevel[0] * upgradeStep[0];
    let multiplication = 1 + upgradeLevel[1] * upgradeStep[1];
    let exponentiation = 1 + upgradeLevel[2] * upgradeStep[2];
    let tetration = 1 + upgradeLevel[3] * upgradeStep[3];

    //calculate values
    mpt = calculateMPT();
    moolah += mpt/framerate;
    formula = "{[(" + (notation(addition)) + ") * " + (notation(multiplication)) + "] ^ " + (notation(exponentiation)) + "} ^ " + (notation(tetration));
}

function drawValues() {
    //draw values onto screen
    document.getElementById('moolahDisplayVar').innerHTML = notation(moolah);
    document.getElementById('mpsDisplayVar').innerHTML = notation(mpt * tickspeed);
    document.getElementById('tickspeedDisplayVar').innerHTML = notation(tickspeed);
    document.getElementById('formulaDisplayVar').innerHTML = formula;

    //draw button values onto screen

    document.getElementById('upgradeStep1').innerHTML = notation(upgradeStep[0]);
    document.getElementById('upgradeCost1').innerHTML = notation(calculateCost(0));
    document.getElementById('upgradePower1').innerHTML = notation(1 + upgradeLevel[0] * upgradeStep[0]);
    
    document.getElementById('upgradeStep2').innerHTML = notation(upgradeStep[1]);
    document.getElementById('upgradeCost2').innerHTML = notation(calculateCost(1));
    document.getElementById('upgradePower2').innerHTML = notation(1 + upgradeLevel[1] * upgradeStep[1]);
    
    document.getElementById('upgradeStep3').innerHTML = notation(upgradeStep[2]);
    document.getElementById('upgradeCost3').innerHTML = notation(calculateCost(2));
    document.getElementById('upgradePower3').innerHTML = notation(1 + upgradeLevel[2] * upgradeStep[2]);
    
    document.getElementById('upgradeStep4').innerHTML = notation(upgradeStep[3]);
    document.getElementById('upgradeCost4').innerHTML = notation(calculateCost(3));
    document.getElementById('upgradePower4').innerHTML = notation(1 + upgradeLevel[3] * upgradeStep[3]);
}

function notation(val, type) {
    let exp = Math.floor(Math.log10(val));
    let valstring = val.toString()
    let suffixes = ["", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc" ]
    if (type == null) {type = 0;}
    
    // NOTATION TYPES: 0 = Mixed Notation, 1 = Scientific Notation, 2 = Standard Notation

    if (exp < 3) {
        return(val.toFixed(2));
    } else {
        if (type == 0) {
            if (val < 1_000_000_000_000_000_000_000_000_000_000_000) { //1 decillion
                switch (exp % 3) {
                    case 0:
                        return(valstring.charAt(0) + "." + valstring.charAt(1) + valstring.charAt(2) + valstring.charAt(3) + suffixes[Math.floor(exp / 3)])
                    case 1:
                        return(valstring.charAt(0) + valstring.charAt(1) + "." + valstring.charAt(2) + valstring.charAt(3) + valstring.charAt(4) + suffixes[Math.floor(exp / 3)])
                    case 2:
                        return(valstring.charAt(0) + valstring.charAt(1) + valstring.charAt(2) + "." + valstring.charAt(3) + valstring.charAt(4) + valstring.charAt(5) + suffixes[Math.floor(exp / 3)])
                }
            } else {
                return(valstring.charAt(0) + "." + valstring.charAt(1) + valstring.charAt(2) + valstring.charAt(3) + "e" + exp)
            }
        } else if (type == 1) {
            return(valstring.charAt(0) + "." + valstring.charAt(1) + valstring.charAt(2) + valstring.charAt(3) + "e" + exp)
        } else if (type == 2) {
            
            switch (exp % 3) {
                case 0:
                    return(valstring.charAt(0) + "." + valstring.charAt(1) + valstring.charAt(2) + valstring.charAt(3) + suffixes[Math.floor(exp / 3)])
                case 1:
                    return(valstring.charAt(0) + valstring.charAt(1) + "." + valstring.charAt(2) + valstring.charAt(3) + valstring.charAt(4) + suffixes[Math.floor(exp / 3)])
                case 2:
                    return(valstring.charAt(0) + valstring.charAt(1) + valstring.charAt(2) + "." + valstring.charAt(3) + valstring.charAt(4) + valstring.charAt(5) + suffixes[Math.floor(exp / 3)])
            }
        }
    }

}

function frame() {
    updateValues();
    drawValues();
}

function attemptPurchase(id) {
    cost = calculateCost(id);

    if (moolah >= cost) {
        moolah -= cost;
        upgradeLevel[id] += 1;
        drawValues();
    }
}

function save() {
    let save = [];
    
    let i = 0;
    while(i < upgradeLevel.length) {
        save.push(upgradeLevel[i]);
        i++;
    }
    save.push(moolah);

    console.log(save);
}

function load() {
    let load = prompt('insert save here');

    let i = 0;
    while (i < upgradeLevel.length) {
        upgradeLevel[i] = load[i];
        i++
    }
    moolah = load[i]
}

function calculateCost(id) { return(upgradeBaseCost[id] * Math.pow((1 + upgradeCostMult[id]),upgradeLevel[id])); }

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

document.addEventListener('DOMContentLoaded', (event) => {
    setInterval(frame, (1000/framerate))
});

