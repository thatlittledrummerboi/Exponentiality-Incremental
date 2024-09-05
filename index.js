import Decimal from "./modules/breakinfinity.js"

var game = {
    checked_for_save: false,
}

var player = {
    money: new Decimal(10),
    tickspeed: new Decimal(1),
    formula: "nuh uh",
    mpt: new Decimal(0),
    upgrades: {
        upgradeLevel: [
            1, 0, 0, 0, // OPERATIONS
            0,          // TICKSPEED
        ],
        upgradeBaseCost: [
            10, 50, 100, 250, // OPERATIONS
            1000,          // TICKSPEED
        ],
        upgradeCostMult: [
            0.3, 0.5, 0.75, 1, // OPERATIONS
            10,          // TICKSPEED
        ],
        upgradeStep: [
            1, 0, 0, 0,  // OPERATIONS
            0.125,       // TICKSPEED
        ],
    },
    settings: {
        framerate: 24,
        framerate_default: 24,
    }
}

function drawValues() {
    document.getElementById('moneyDisplayVar').innerHTML = player.money;
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
    player.tickspeed = player.upgrades.upgradeLevel[4] * player.upgrades.upgradeStep[4];

    player.mpt = addition.mul(multiplication.pow(exponentiation.pow(tetration)));
    player.money = player.money.plus(player.mpt.mul(player.tickspeed).div(player.settings.framerate));
}

function frame() {
    calculateValues();
    drawValues();

    document.getElementById('upgradeButton1').onclick = attemptPurchase(0);
    document.getElementById('upgradeButton2').onclick = attemptPurchase(1);
    document.getElementById('upgradeButton3').onclick = attemptPurchase(2);
    document.getElementById('upgradeButton4').onclick = attemptPurchase(3);
    document.getElementById('upgradeButton5').onclick = attemptPurchase(4);
}

function calculateCost(id) { return (player.upgrades.upgradeBaseCost[id] * Math.pow((1 + player.upgrades.upgradeCostMult[id]), player.upgrades.upgradeLevel[id])) }

function attemptPurchase(id) {
    let cost = calculateCost(id);

    if (player.money >= cost) {
        player.money.min(cost);
        player.upgrades.upgradeLevel[id] += 1;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    setInterval(frame, (1000/player.settings.framerate))
});