var player = {
    money: new Decimal(10),
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
