import Decimal from "./modules/breakinfinity.js";
import * as notationengine from "./modules/notationengine.js";

var game = {
    checked_for_save: false,
}

var player = {
    money: new Decimal(100),
    tickspeed: new Decimal(1),
    formula: "nuh uh",
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
    },
    settings: {
        framerate: 24,
        framerate_default: 24,
    }
}

function drawValues() {
    document.getElementById('moneyDisplayVar').innerHTML = notationengine.biNotation(player.money, player.money.log10());
    document.getElementById('mpsDisplayVar').innerHTML = player.mpt * (player.tickspeed);
    document.getElementById('tickspeedDisplayVar').innerHTML = player.tickspeed;
    document.getElementById('formulaDisplayVar').innerHTML = player.formula;

    let i = 0
    while(i < player.upgrades.upgradeLevel.length) {
        document.getElementById('upgradeStep' + (i+1)).innerHTML = player.upgrades.upgradeStep[i];
        document.getElementById('upgradeCost' + (i+1)).innerHTML = calculateCost(i);
        document.getElementById('upgradePower' + (i+1)).innerHTML = player.upgrades.upgradeLevel[i] * player.upgrades.upgradeStep[i];
        i++;
    }
}

function calculateValues() {
    let addition = new Decimal( player.upgrades.upgradeLevel[0] * player.upgrades.upgradeStep[0]);
    let multiplication = new Decimal( 1 + player.upgrades.upgradeLevel[1] * player.upgrades.upgradeStep[1]);
    let exponentiation = new Decimal( 1 + player.upgrades.upgradeLevel[2] * player.upgrades.upgradeStep[2]);
    let tetration = new Decimal( 1 + player.upgrades.upgradeLevel[3] * player.upgrades.upgradeStep[3]);
    player.tickspeed = 1 + player.upgrades.upgradeLevel[4] * player.upgrades.upgradeStep[4];

    player.mpt = addition.mul(multiplication.pow(exponentiation.pow(tetration)));
    player.money = player.money.plus(player.mpt.mul(player.tickspeed).div(player.settings.framerate));
}

function frame() {
    calculateValues();
    drawValues();
}

function configOnClicks() {
    document.getElementById('upgradeButton1').addEventListener("click", (event) => {attemptPurchase(0)}); //     OPERATIONS
    document.getElementById('upgradeButton2').addEventListener("click", (event) => {attemptPurchase(1)}); //
    document.getElementById('upgradeButton3').addEventListener("click", (event) => {attemptPurchase(2)}); //
    document.getElementById('upgradeButton4').addEventListener("click", (event) => {attemptPurchase(3)}); //
    
    document.getElementById('upgradeButton5').addEventListener("click", (event) => {attemptPurchase(4)}); //     TICKSPEED
}

function calculateCost(id) { return (player.upgrades.upgradeBaseCost[id] * Math.pow((1 + player.upgrades.upgradeCostMult[id]), player.upgrades.upgradeLevel[id])) }

function attemptPurchase(id) {
    let cost = calculateCost(id);

    if (player.money >= cost) {
        player.money = player.money.min((cost));
        player.upgrades.upgradeLevel[id] += 1;
    }
}


configOnClicks();

document.addEventListener('DOMContentLoaded', (event) => {
    setInterval(frame, (1000/player.settings.framerate));
    
});