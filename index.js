import Decimal from "./modules/breakinfinity.js"

var player = {
    money: new Decimal(10),
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
            1000,          // TICKSPEED
        ],
        upgradeCostMult: [
            0.15, 0, 0, 0, // OPERATIONS
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
    let addition = player.upgrades.upgradeLevel[0] * player.upgrades.upgradeStep[0];
    let multiplication = 1 + player.upgrades.upgradeLevel[1] * player.upgrades.upgradeStep[1];
    let exponentiation = 1 + player.upgrades.upgradeLevel[2] * player.upgrades.upgradeStep[2];
    let tetration = 1 + player.upgrades.upgradeLevel[3] * player.upgrades.upgradeStep[3];
    player.tickspeed = player.upgrades.upgradeLevel[4] * player.upgrades.upgradeStep[4];

    player.mpt = Math.pow(Math.pow((addition * multiplication), exponentiation), tetration);
    player.money.plus((player.mpt * player.tickspeed)/player.settings.framerate);
}

function frame() {
    calculateValues();
    drawValues();

    document.getElementById ("upgradeStep1").addEventListener ("click", attemptPurchase(0), false);
    document.getElementById ("upgradeStep2").addEventListener ("click", attemptPurchase(1), false);
    document.getElementById ("upgradeStep3").addEventListener ("click", attemptPurchase(2), false);
    document.getElementById ("upgradeStep4").addEventListener ("click", attemptPurchase(3), false);
    document.getElementById ("upgradeStep5").addEventListener ("click", attemptPurchase(4), false);
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
