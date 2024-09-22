import Decimal from "./modules/breakinfinity.js";
import * as notationengine from "./modules/notationengine.js";

const ts = new Date();

var game = {
    checkedForSave: false,
    currentTimestamp: 0,
    currentPage: 0,
}

var player = {
    money: new Decimal(100000),
    tickspeed: new Decimal(1),
    formula: "",
    mpt: new Decimal(0),
    upgrades: {
        upgradeLevel: [
            0, 0, 0, 0, // OPERATIONS
            0,          // TICKSPEED
        ],
        upgradeBaseCost: [
            10, 50, 100, 250, // OPERATIONS
            1,          // TICKSPEED
        ],
        upgradeCostMult: [
            0.3, 0.5, 0.75, 1, // OPERATIONS
            10,          // TICKSPEED
        ],
        upgradeStep: [
            1, 0.1, 0.02, 0.005,  // OPERATIONS
            0.125,       // TICKSPEED
        ],
        upgradeCurrentDecpoint: [
            2, 2, 2, 3,  //OPERATIONS
            3,           // TICKSPEED
        ]
    },
    settings: {
        framerate: 24,
    },
    stats: {
        timestamp_since_last_update: 0
    }
}

function drawValues() {
    // Display Vars
    document.getElementById('moneyDisplayVar').innerHTML = notationengine.biNotation(player.money, notationengine.floorLog10(player.money), 2);
    document.getElementById('moneyDisplayVarCorner').innerHTML = notationengine.biNotation(player.money, notationengine.floorLog10(player.money), 2);
    document.getElementById('mpsDisplayVar').innerHTML = notationengine.biNotation(player.mpt.mul(player.tickspeed)), notationengine.floorLog10( player.mpt * player.tickspeed, 2);
    document.getElementById('tickspeedDisplayVar').innerHTML = notationengine.biNotation(player.tickspeed, notationengine.floorLog10(player.tickspeed), 3);
    document.getElementById('formulaDisplayVar').innerHTML = player.formula;

    // Upgrade Vars
    let i = 0
    while(i < player.upgrades.upgradeLevel.length) {
        document.getElementById('upgradeStep' + (i+1)).innerHTML = player.upgrades.upgradeStep[i];
        document.getElementById('upgradeCost' + (i+1)).innerHTML = notationengine.biNotation(calculateCost(i), notationengine.floorLog10(calculateCost(i)), 2);
        document.getElementById('upgradePower' + (i+1)).innerHTML = notationengine.biNotation(player.upgrades.upgradeLevel[i] * player.upgrades.upgradeStep[i], notationengine.floorLog10(player.upgrades.upgradeLevel[i] * player.upgrades.upgradeStep[i]), player.upgrades.upgradeCurrentDecpoint[i]);
        i++;
    }

    // Settings Vars
    if(game.currentPage == 1) {
        document.getElementById('currentFramerate').innerHTML = player.settings.framerate;
    }
}

function updateValues() {
    // Preset Vars
    let addition = new Decimal( player.upgrades.upgradeLevel[0] * player.upgrades.upgradeStep[0]);
    let multiplication = new Decimal( 1 + player.upgrades.upgradeLevel[1] * player.upgrades.upgradeStep[1]);
    let exponentiation = new Decimal( 1 + player.upgrades.upgradeLevel[2] * player.upgrades.upgradeStep[2]);
    let tetration = new Decimal( 1 + player.upgrades.upgradeLevel[3] * player.upgrades.upgradeStep[3]);

    // Display Vars
    player.money = player.money.plus(player.mpt.mul(player.tickspeed).div(player.settings.framerate));
    player.mpt = addition.mul(multiplication.pow(exponentiation.pow(tetration)));
    player.tickspeed = 1 + player.upgrades.upgradeLevel[4] * player.upgrades.upgradeStep[4];
    player.formula = "((" + addition + " * " + multiplication + ") ^ " + exponentiation + ") ^ " + tetration;

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
            break;
        case 1:
            game.currentPage = 1;
            document.getElementById('homePage').style = "display: none;"
            document.getElementById('settingsPage').style = "display: block;"
            break;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('upgradeButton1').addEventListener("click", (event) => {attemptPurchase(0)}); //     OPERATIONS
    document.getElementById('upgradeButton2').addEventListener("click", (event) => {attemptPurchase(1)}); //
    document.getElementById('upgradeButton3').addEventListener("click", (event) => {attemptPurchase(2)}); //
    document.getElementById('upgradeButton4').addEventListener("click", (event) => {attemptPurchase(3)}); //
    
    document.getElementById('upgradeButton5').addEventListener("click", (event) => {attemptPurchase(4)}); //     TICKSPEED


    document.getElementById('homeButton').addEventListener("click", (event) => {showPage(0)});            //     MENU BUTTONS
    document.getElementById('settingsButton').addEventListener("click", (event) => {showPage(1)});        //

    showPage(game.currentPage);

    setInterval(frame, (1000/player.settings.framerate));
});