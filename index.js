import Decimal from "./modules/breakinfinity.js";
import * as notationengine from "./modules/notationengine.js";

const ts = new Date();

var game = {
    checkedForSave: false,
    currentTimestamp: 0,
    currentPage: 0,
}

var player = {
    money: new Decimal(10),
    tickspeed: new Decimal(1),
    base_tickspeed: new Decimal(1),
    formula: "",
    mpt: new Decimal(0),
    upgrades: {
        upgradeLevel: [
            0, 0, 0, 0, // OPERATIONS
            0,          // TICKSPEED
            0, 0, 0, 0, // GENERATORS
        ],
        upgradeBaseCost: [
            10, 50, 100, 250,   // OPERATIONS
            1000,               // TICKSPEED
            100, 250, 500, 1000, // GENERATORS
        ],
        upgradeCostMult: [
            0.3, 0.5, 0.75, 1, // OPERATIONS
            9,                 // TICKSPEED
            0.4, 0.7, 1, 1.2,   // GENERATORS
        ],
        upgradeStep: [
            1, 0.1, 0.02, 0.005,      // OPERATIONS
            0.125,                    // TICKSPEED
            0.01, 0.005, 0.001, 0.0005, // GENERATORS
        ],
        upgradeCurrentDecpoint: [
            2, 2, 2, 3,  //OPERATIONS
            3,           // TICKSPEED
            2, 3, 4, 4,  // GENERATORS
        ],
    },
    generators: {
        addition: new Decimal(0),
        multiplication: new Decimal(0),
        exponentiation: new Decimal (0),
        tetration: new Decimal(0)
    },
    settings: {
        framerate: 24,
    },
    stats: {
        timestamp_since_last_update: 0,
    },
    operationPresets: [
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
    ]
}

function drawValues() {
    // Display Vars
    document.getElementById('moneyDisplayVar').innerHTML = notationengine.biNotation(player.money, notationengine.floorLog10(player.money), 2);
    document.getElementById('moneyDisplayVarCorner').innerHTML = notationengine.biNotation(player.money, notationengine.floorLog10(player.money), 2);
    document.getElementById('mpsDisplayVar').innerHTML = notationengine.biNotation(player.mpt.mul(player.tickspeed), notationengine.floorLog10( player.mpt * player.tickspeed), 3);
    document.getElementById('tickspeedDisplayVar').innerHTML = notationengine.biNotation(player.tickspeed, notationengine.floorLog10(player.tickspeed), 3);
    document.getElementById('formulaDisplayVar').innerHTML = player.formula;

    // Upgrade Vars
    let i = 0;
    while(i < player.upgrades.upgradeLevel.length) {
        document.getElementById('upgradeStep' + (i+1)).innerHTML = player.upgrades.upgradeStep[i];
        document.getElementById('upgradeCost' + (i+1)).innerHTML = notationengine.biNotation(calculateCost(i), notationengine.floorLog10(calculateCost(i)), 2);
            i++;
    }

    // Settings Vars
    if(game.currentPage == 1) {
        document.getElementById('currentFramerate').innerHTML = player.settings.framerate;
    }

    // Button Background
    let j = 0;
    while (j < player.upgrades.upgradeLevel.length) {
        if(player.money.gte(calculateCost(j))) {
            document.getElementById('upgradeButton' + (j+1)).style = "background-color: rgba(100, 255, 100, 0.5); border-color: green; color: black;";
        } else {
            document.getElementById('upgradeButton' + (j+1)).style = "background-color: rgba(255, 75, 75, 0.6); border-color: red; color: white;";
        }
        j++;
    }
}

function updateValues() {
    // Generator Vars
    player.generators.addition = player.generators.addition.plus(player.upgrades.upgradeLevel[5] * (player.upgrades.upgradeStep[5])/(player.settings.framerate));
    player.generators.multiplication = player.generators.multiplication.plus(player.upgrades.upgradeLevel[6] * (player.upgrades.upgradeStep[6])/(player.settings.framerate));
    player.generators.exponentiation = player.generators.exponentiation.plus(player.upgrades.upgradeLevel[7] * (player.upgrades.upgradeStep[7])/(player.settings.framerate));
    player.generators.tetration = player.generators.tetration.plus(player.upgrades.upgradeLevel[8] * (player.upgrades.upgradeStep[8])/(player.settings.framerate));

    // Operation Vars
    player.operationPresets[0] = (player.generators.addition.plus(player.upgrades.upgradeLevel[0] * player.upgrades.upgradeStep[0]));
    player.operationPresets[1] = (player.generators.multiplication.plus(1 + player.upgrades.upgradeLevel[1] * player.upgrades.upgradeStep[1]));
    player.operationPresets[2] = (player.generators.exponentiation.plus(1 + player.upgrades.upgradeLevel[2] * player.upgrades.upgradeStep[2]));
    player.operationPresets[3] = (player.generators.tetration.plus(1 + player.upgrades.upgradeLevel[3] * player.upgrades.upgradeStep[3]));

    // Display Vars
    player.money = player.money.plus(player.mpt.mul(player.tickspeed).div(player.settings.framerate));
    player.mpt = player.operationPresets[0].mul(player.operationPresets[1].pow(player.operationPresets[2].pow(player.operationPresets[3])));
    player.tickspeed = player.base_tickspeed.mul(1 + player.upgrades.upgradeStep[4]).pow(player.upgrades.upgradeLevel[4])
    player.formula = "((" + notationengine.biNotation(player.operationPresets[0], notationengine.floorLog10(player.operationPresets[0]), 2) + " * " + notationengine.biNotation(player.operationPresets[1], notationengine.floorLog10(player.operationPresets[1]), 2) + ") ^ " + notationengine.biNotation(player.operationPresets[2], notationengine.floorLog10(player.operationPresets[2]), 3) + ") ^ " + notationengine.biNotation(player.operationPresets[3], notationengine.floorLog10(player.operationPresets[3]), 3);

    // Settings Vars
    player.settings.framerate = document.getElementById('framerateSlider').value;
    
}

function frame() {
    updateValues();
    drawValues();
}

function calculateCost(id) { 
    let exit = new Decimal(player.upgrades.upgradeBaseCost[id] * Math.pow((1 + player.upgrades.upgradeCostMult[id]), player.upgrades.upgradeLevel[id]));
    return (exit);
}

function attemptPurchase(id) {
    let cost = calculateCost(id);

    if (player.money.gte(cost)) {
        player.money = player.money.minus((cost));
        player.upgrades.upgradeLevel[id] += 1;
        updateValues();
        drawValues();
    } 
}

function showPage(id) {
    switch(id) {
        case 0:
            game.currentPage = 0;
            document.getElementById('homePage').style = "display: block;"
            document.getElementById('settingsPage').style = "display: none;"
            document.getElementById('researchPage').style = "display: none;"
            document.getElementById('aboutPage').style = "display: none"
            break;
        case 1:
            game.currentPage = 1;
            document.getElementById('homePage').style = "display: none;"
            document.getElementById('settingsPage').style = "display: block;"
            document.getElementById('researchPage').style = "display: none;"
            document.getElementById('aboutPage').style = "display: none"
            break;
        case 2:
            game.currentPage = 2;
            document.getElementById('homePage').style = "display: none;"
            document.getElementById('settingsPage').style = "display: none;"
            document.getElementById('researchPage').style = "display: block;"
            document.getElementById('aboutPage').style = "display: none"
            break;
        case 3:
            game.currentPage = 3;
            document.getElementById('homePage').style = "display: none;"
            document.getElementById('settingsPage').style = "display: none;"
            document.getElementById('researchPage').style = "display: none;"
            document.getElementById('aboutPage').style = "display: block"
            break;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('upgradeButton1').addEventListener("click", (event) => {attemptPurchase(0)}); //     OPERATIONS
    document.getElementById('upgradeButton2').addEventListener("click", (event) => {attemptPurchase(1)}); //
    document.getElementById('upgradeButton3').addEventListener("click", (event) => {attemptPurchase(2)}); //
    document.getElementById('upgradeButton4').addEventListener("click", (event) => {attemptPurchase(3)}); //
    
    document.getElementById('upgradeButton5').addEventListener("click", (event) => {attemptPurchase(4)}); //     TICKSPEED

    document.getElementById('upgradeButton6').addEventListener("click", (event) => {attemptPurchase(5)}); //     GENERATORS
    document.getElementById('upgradeButton7').addEventListener("click", (event) => {attemptPurchase(6)}); //
    document.getElementById('upgradeButton8').addEventListener("click", (event) => {attemptPurchase(7)}); //
    document.getElementById('upgradeButton9').addEventListener("click", (event) => {attemptPurchase(8)}); //

    document.getElementById('homeButton').addEventListener("click", (event) => {showPage(0)});            //     MENU BUTTONS
    document.getElementById('settingsButton').addEventListener("click", (event) => {showPage(1)});        //
    document.getElementById('researchButton').addEventListener("click", (event) => {showPage(2)});        //
    document.getElementById('aboutButton').addEventListener("click", (event) => {showPage(3)});           //

    showPage(game.currentPage);

    setInterval(frame, (1000/player.settings.framerate));
});