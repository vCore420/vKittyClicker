// Kitty Clicker Game
// Designed and Created by vCore
// Inspired by the original Cookie Clicker Game
// This game has plenty of room for improvement or expansion
// I would love to see what you do with it so please create a pull request so we can see what this game becomes together!
// Enjoy!


// --- Save Version ---
const SAVE_VERSION = 11.1;          // Increment this by one everytime you add or alter this game (only change them if you have to), then appoligse to everyone who just lost their save data


// --- Core Variables ---
let biscuitCount = 0;               // Initial Biscuit Count
let clickMultiplier = 1;            // Initial Player click strength
let autoClickMultiplier = 1;        // Initial Auto-clicker strength
let catName = "Name your cat...";   // Initial Cat Name


// --- Sprite Variables ---
const spriteSheets = [
    { src: 'assets/sprite/cat.png', threshold: 0 },          // Plays at 0 Total Biscuits
    { src: 'assets/sprite/cat1.png', threshold: 1000 },      // Plays at 1,000 Total Biscuits
    { src: 'assets/sprite/cat2.png', threshold: 10000 },     // Plays at 10,000 Total Biscuits
    { src: 'assets/sprite/cat3.png', threshold: 100000 },    // Plays at 100,000 Total Biscuits
    { src: 'assets/sprite/cat4.png', threshold: 1000000 },   // Plays at 1,000,000 Total Biscuits
    { src: 'assets/sprite/cat5.png', threshold: 10000000 },  // Plays at 10,000,000 Total Biscuits
    { src: 'assets/sprite/cat6.png', threshold: 100000000 }, // Plays at 100,000,000 Total Biscuits
    { src: 'assets/sprite/cat7.png', threshold: 1000000000 } // Plays at 1,000,000,000 Total Biscuits
];

const totalFrames = 12;             // Total Frames of Sprite Animation
const frameWidth = 256;             // Cat Sprite Size
let currentSpriteSheetIndex = 0;    // Current Sprite Sheet Index
let animationFrame = 0;             // Initial Animation Frame


// --- Lucky Fish Variables ---
let luckyFishActive = false;
let luckyFishTimeout = null;
let luckyFishType = null; // "bps" or "click"
let luckyFishMultiplier = 1;
let luckyFishClickMultiplier = 1;
let luckyFishEndTimeout = null;
let luckyFishEndTime = null;


// -- Clicker Variables ---
let fractionalBiscuits = 0;
let lastTick = performance.now(); // Game Ticker


// --- DOM References ---
const mainCat = document.querySelector('.main-cat');
mainCat.style.backgroundImage = `url('${spriteSheets[0].src}')`;
const counterSpan = document.getElementById('biscuitCount');
const bpsSpan = document.getElementById('bpsCount');


// --- Auto Click Upgrade Data ---
const autoUpgrades = [
    { name: "Cat Toy",                  bps: 5,                             baseCost: 50,                                   cost: 50,                                   costMultiplier: 1.12, bought: 0 },
    { name: "Catnip",                   bps: 20,                            baseCost: 250,                                  cost: 250,                                  costMultiplier: 1.14, bought: 0 },
    { name: "Scratching Post",          bps: 100,                           baseCost: 1_500,                                cost: 1_500,                                costMultiplier: 1.15, bought: 0 },
    { name: "Milk Bowl",                bps: 250,                           baseCost: 7_500,                                cost: 7_500,                                costMultiplier: 1.16, bought: 0 },
    { name: "Laser Pointer",            bps: 750,                           baseCost: 36_000,                               cost: 36_000,                               costMultiplier: 1.17, bought: 0 },
    { name: "Cat Bed",                  bps: 2_000,                         baseCost: 180_000,                              cost: 180_000,                              costMultiplier: 1.18, bought: 0 },
    { name: "Cat Hammock",              bps: 8_000,                         baseCost: 950_000,                              cost: 950_000,                              costMultiplier: 1.19, bought: 0 },
    { name: "Cat Cafe",                 bps: 32_000,                        baseCost: 5_500_000,                            cost: 5_500_000,                            costMultiplier: 1.20, bought: 0 },
    { name: "Cat Mansion",              bps: 128_000,                       baseCost: 32_000_000,                           cost: 32_000_000,                           costMultiplier: 1.21, bought: 0 },
    { name: "Kitty Kingdom",            bps: 512_000,                       baseCost: 180_000_000,                          cost: 180_000_000,                          costMultiplier: 1.22, bought: 0 },
    { name: "Catnip Plantation",        bps: 2_000_000,                     baseCost: 1_000_000_000,                        cost: 1_000_000_000,                        costMultiplier: 1.23, bought: 0 },
    { name: "International Cat Day",    bps: 8_000_000,                     baseCost: 12_000_000_000,                       cost: 12_000_000_000,                       costMultiplier: 1.24, bought: 0 },
    { name: "Kitty Observatory",        bps: 32_000_000,                    baseCost: 150_000_000_000,                      cost: 150_000_000_000,                      costMultiplier: 1.25, bought: 0 },
    { name: "Space Catapult",           bps: 128_000_000,                   baseCost: 900_000_000_000,                      cost: 900_000_000_000,                      costMultiplier: 1.26, bought: 0 },
    { name: "Nebula Nappers",           bps: 512_000_000,                   baseCost: 5_500_000_000_000,                    cost: 5_500_000_000_000,                    costMultiplier: 1.27, bought: 0 },
    { name: "Galactic Groomers",        bps: 2_000_000_000,                 baseCost: 33_000_000_000_000,                   cost: 33_000_000_000_000,                   costMultiplier: 1.28, bought: 0 },
    { name: "Universe Unravelers",      bps: 8_000_000_000,                 baseCost: 200_000_000_000_000,                  cost: 200_000_000_000_000,                  costMultiplier: 1.29, bought: 0 },
    { name: "Multiverse Mousers",       bps: 32_000_000_000,                baseCost: 1_200_000_000_000_000,                cost: 1_200_000_000_000_000,                costMultiplier: 1.30, bought: 0 },
    { name: "Hyperverse Herders",       bps: 128_000_000_000,               baseCost: 7_000_000_000_000_000,                cost: 7_000_000_000_000_000,                costMultiplier: 1.31, bought: 0 },
    { name: "Omniverse Overlords",      bps: 512_000_000_000,               baseCost: 40_000_000_000_000_000,               cost: 40_000_000_000_000_000,               costMultiplier: 1.32, bought: 0 },
    { name: "Eternal Purrers",          bps: 2_000_000_000_000,             baseCost: 240_000_000_000_000_000,              cost: 240_000_000_000_000_000,              costMultiplier: 1.33, bought: 0 },
    { name: "Infinity Scratchers",      bps: 8_000_000_000_000,             baseCost: 1_400_000_000_000_000_000,            cost: 1_400_000_000_000_000_000,            costMultiplier: 1.34, bought: 0 },
    { name: "Singularity Sleepers",     bps: 32_000_000_000_000,            baseCost: 8_000_000_000_000_000_000,            cost: 8_000_000_000_000_000_000,            costMultiplier: 1.35, bought: 0 },
    { name: "Beyond Biscuiteers",       bps: 128_000_000_000_000,           baseCost: 48_000_000_000_000_000_000,           cost: 48_000_000_000_000_000_000,           costMultiplier: 1.36, bought: 0 },
    { name: "Absolute Whiskers",        bps: 512_000_000_000_000,           baseCost: 280_000_000_000_000_000_000,          cost: 280_000_000_000_000_000_000,          costMultiplier: 1.37, bought: 0 },
    { name: "Ultimate Cataclysm",       bps: 2_000_000_000_000_000,         baseCost: 1_600_000_000_000_000_000_000,        cost: 1_600_000_000_000_000_000_000,        costMultiplier: 1.38, bought: 0 },
    { name: "Omega Overcats",           bps: 8_000_000_000_000_000,         baseCost: 9_000_000_000_000_000_000_000,        cost: 9_000_000_000_000_000_000_000,        costMultiplier: 1.39, bought: 0 },
    { name: "Alpha Aristocats",         bps: 32_000_000_000_000_000,        baseCost: 50_000_000_000_000_000_000_000,       cost: 50_000_000_000_000_000_000_000,       costMultiplier: 1.40, bought: 0 },
    { name: "Prime Pouncers",           bps: 128_000_000_000_000_000,       baseCost: 280_000_000_000_000_000_000_000,      cost: 280_000_000_000_000_000_000_000,      costMultiplier: 1.41, bought: 0 },
    { name: "Supreme Sphinxes",         bps: 512_000_000_000_000_000,       baseCost: 1_600_000_000_000_000_000_000_000,    cost: 1_600_000_000_000_000_000_000_000,    costMultiplier: 1.42, bought: 0 },
    { name: "Septillionaire Slinkers",  bps: 2_000_000_000_000_000_000,     baseCost: 9_000_000_000_000_000_000_000_000,    cost: 9_000_000_000_000_000_000_000_000,    costMultiplier: 1.43, bought: 0 }
];


// --- User Click Upgrade Data ---
const clickUpgrades = [
    { name: "Kitten Paw",         clickBoost: 1,                            baseCost: 2_500,                                cost: 2_500,                                costMultiplier: 1.15, bought: 0 },
    { name: "Laser Reflexes",     clickBoost: 5,                            baseCost: 15_000,                               cost: 15_000,                               costMultiplier: 1.16, bought: 0 },
    { name: "Cat Claws",          clickBoost: 20,                           baseCost: 80_000,                               cost: 80_000,                               costMultiplier: 1.17, bought: 0 },
    { name: "Kitty Sprint",       clickBoost: 75,                           baseCost: 450_000,                              cost: 450_000,                              costMultiplier: 1.18, bought: 0 },
    { name: "Feline Frenzy",      clickBoost: 250,                          baseCost: 2_500_000,                            cost: 2_500_000,                            costMultiplier: 1.19, bought: 0 },
    { name: "Purr Power",         clickBoost: 1000,                         baseCost: 13_000_000,                           cost: 13_000_000,                           costMultiplier: 1.20, bought: 0 },
    { name: "Catnado",            clickBoost: 4000,                         baseCost: 70_000_000,                           cost: 70_000_000,                           costMultiplier: 1.21, bought: 0 },
    { name: "Whisker Warp",       clickBoost: 16_000,                       baseCost: 375_000_000,                          cost: 375_000_000,                          costMultiplier: 1.22, bought: 0 },
    { name: "Biscuiteer Mode",    clickBoost: 64_000,                       baseCost: 2_000_000_000,                        cost: 2_000_000_000,                        costMultiplier: 1.23, bought: 0 },
    { name: "Catnip Comet",       clickBoost: 256_000,                      baseCost: 10_000_000_000,                       cost: 10_000_000_000,                       costMultiplier: 1.24, bought: 0 },
    { name: "Galactic Scratch",   clickBoost: 1_000_000,                    baseCost: 55_000_000_000,                       cost: 55_000_000_000,                       costMultiplier: 1.25, bought: 0 },
    { name: "Cosmic Pounce",      clickBoost: 4_000_000,                    baseCost: 300_000_000_000,                      cost: 300_000_000_000,                      costMultiplier: 1.26, bought: 0 },
    { name: "Nebula Flick",       clickBoost: 16_000_000,                   baseCost: 1_600_000_000_000,                    cost: 1_600_000_000_000,                    costMultiplier: 1.27, bought: 0 },
    { name: "Quantum Leap",       clickBoost: 64_000_000,                   baseCost: 9_000_000_000_000,                    cost: 9_000_000_000_000,                    costMultiplier: 1.28, bought: 0 },
    { name: "Event Horizon",      clickBoost: 256_000_000,                  baseCost: 50_000_000_000_000,                   cost: 50_000_000_000_000,                   costMultiplier: 1.29, bought: 0 },
    { name: "Stellar Swipe",      clickBoost: 1_000_000_000,                baseCost: 280_000_000_000_000,                  cost: 280_000_000_000_000,                  costMultiplier: 1.30, bought: 0 },
    { name: "Supernova Tap",      clickBoost: 4_000_000_000,                baseCost: 1_600_000_000_000_000,                cost: 1_600_000_000_000_000,                costMultiplier: 1.31, bought: 0 },
    { name: "Hyperwhisker Pulse", clickBoost: 16_000_000_000,               baseCost: 9_000_000_000_000_000,                cost: 9_000_000_000_000_000,                costMultiplier: 1.32, bought: 0 },
    { name: "Omnipaw Slam",       clickBoost: 64_000_000_000,               baseCost: 50_000_000_000_000_000,               cost: 50_000_000_000_000_000,               costMultiplier: 1.33, bought: 0 },
    { name: "Eternal Meow",       clickBoost: 256_000_000_000,              baseCost: 280_000_000_000_000_000,              cost: 280_000_000_000_000_000,              costMultiplier: 1.34, bought: 0 },
    { name: "Catnip Nebula",      clickBoost: 1_000_000_000_000,            baseCost: 1_600_000_000_000_000_000,            cost: 1_600_000_000_000_000_000,            costMultiplier: 1.35, bought: 0 },
    { name: "Infinity Scratch",   clickBoost: 4_000_000_000_000,            baseCost: 9_000_000_000_000_000_000,            cost: 9_000_000_000_000_000_000,            costMultiplier: 1.36, bought: 0 },
    { name: "Singularity Sneeze", clickBoost: 16_000_000_000_000,           baseCost: 50_000_000_000_000_000_000,           cost: 50_000_000_000_000_000_000,           costMultiplier: 1.37, bought: 0 },
    { name: "Beyond Biscuit",     clickBoost: 64_000_000_000_000,           baseCost: 280_000_000_000_000_000_000,          cost: 280_000_000_000_000_000_000,          costMultiplier: 1.38, bought: 0 },
    { name: "Extravagant Treat",  clickBoost: 256_000_000_000_000,          baseCost: 1_600_000_000_000_000_000_000,        cost: 1_600_000_000_000_000_000_000,        costMultiplier: 1.39, bought: 0 },
    { name: "Ultimate Catnip",    clickBoost: 1_000_000_000_000_000,        baseCost: 9_000_000_000_000_000_000_000,        cost: 9_000_000_000_000_000_000_000,        costMultiplier: 1.40, bought: 0 }
];


// --- Buff Upgrades ---
const buffs = [
    { name: "Click Power",             type: "click", target: null, multiplier: 2, unlockBPS: 500_000,           baseCost: 2_500_000,               cost: 2_500_000,               costMultiplier: 2.5,  bought: 0, unlocked: false },
    { name: "Lucky Fish Magnet",       type: "fish",  target: null, multiplier: 0.95, unlockBPS: 1_000_000,      baseCost: 5_000_000,               cost: 5_000_000,               costMultiplier: 2.6,  bought: 0, unlocked: false },
    { name: "Cat Toy",                 type: "auto",  target: 0,  multiplier: 2, unlockBPS: 2_500_000,           baseCost: 25_000_000,              cost: 25_000_000,              costMultiplier: 2.00, bought: 0, unlocked: false },
    { name: "Catnip",                  type: "auto",  target: 1,  multiplier: 2, unlockBPS: 4_583_000,           baseCost: 45_830_000,              cost: 45_830_000,              costMultiplier: 2.07, bought: 0, unlocked: false },
    { name: "Scratching Post",         type: "auto",  target: 2,  multiplier: 2, unlockBPS: 8_409_000,           baseCost: 84_090_000,              cost: 84_090_000,              costMultiplier: 2.13, bought: 0, unlocked: false },
    { name: "Milk Bowl",               type: "auto",  target: 3,  multiplier: 2, unlockBPS: 15_431_000,          baseCost: 154_310_000,             cost: 154_310_000,             costMultiplier: 2.20, bought: 0, unlocked: false },
    { name: "Laser Pointer",           type: "auto",  target: 4,  multiplier: 2, unlockBPS: 28_318_000,          baseCost: 283_180_000,             cost: 283_180_000,             costMultiplier: 2.27, bought: 0, unlocked: false },
    { name: "Cat Bed",                 type: "auto",  target: 5,  multiplier: 2, unlockBPS: 52_011_000,          baseCost: 520_110_000,             cost: 520_110_000,             costMultiplier: 2.33, bought: 0, unlocked: false },
    { name: "Cat Hammock",             type: "auto",  target: 6,  multiplier: 2, unlockBPS: 95_588_000,          baseCost: 955_880_000,             cost: 955_880_000,             costMultiplier: 2.40, bought: 0, unlocked: false },
    { name: "Cat Cafe",                type: "auto",  target: 7,  multiplier: 2, unlockBPS: 175_885_000,         baseCost: 1_758_850_000,           cost: 1_758_850_000,           costMultiplier: 2.47, bought: 0, unlocked: false },
    { name: "Cat Mansion",             type: "auto",  target: 8,  multiplier: 2, unlockBPS: 323_895_000,         baseCost: 3_238_950_000,           cost: 3_238_950_000,           costMultiplier: 2.53, bought: 0, unlocked: false },
    { name: "Kitty Kingdom",           type: "auto",  target: 9,  multiplier: 2, unlockBPS: 596_624_000,         baseCost: 5_966_240_000,           cost: 5_966_240_000,           costMultiplier: 2.60, bought: 0, unlocked: false },
    { name: "Catnip Plantation",       type: "auto",  target: 10, multiplier: 2, unlockBPS: 1_098_033_000,       baseCost: 10_980_330_000,          cost: 10_980_330_000,          costMultiplier: 2.67, bought: 0, unlocked: false },
    { name: "International Cat Day",   type: "auto",  target: 11, multiplier: 2, unlockBPS: 2_021_743_000,       baseCost: 30_326_145_000,          cost: 30_326_145_000,          costMultiplier: 2.73, bought: 0, unlocked: false },
    { name: "Kitty Observatory",       type: "auto",  target: 12, multiplier: 2, unlockBPS: 3_724_970_000,       baseCost: 55_874_550_000,          cost: 55_874_550_000,          costMultiplier: 2.80, bought: 0, unlocked: false },
    { name: "Space Catapult",          type: "auto",  target: 13, multiplier: 2, unlockBPS: 6_860_140_000,       baseCost: 102_902_100_000,         cost: 102_902_100_000,         costMultiplier: 2.87, bought: 0, unlocked: false },
    { name: "Nebula Nappers",          type: "auto",  target: 14, multiplier: 2, unlockBPS: 12_646_609_000,      baseCost: 189_699_135_000,         cost: 189_699_135_000,         costMultiplier: 2.93, bought: 0, unlocked: false },
    { name: "Galactic Groomers",       type: "auto",  target: 15, multiplier: 2, unlockBPS: 23_335_837_000,      baseCost: 350_037_555_000,         cost: 350_037_555_000,         costMultiplier: 3.00, bought: 0, unlocked: false },
    { name: "Universe Unravelers",     type: "auto",  target: 16, multiplier: 2, unlockBPS: 43_085_752_000,      baseCost: 646_286_280_000,         cost: 646_286_280_000,         costMultiplier: 3.07, bought: 0, unlocked: false },
    { name: "Multiverse Mousers",      type: "auto",  target: 17, multiplier: 2, unlockBPS: 79_609_181_000,      baseCost: 1_194_137_715_000,       cost: 1_194_137_715_000,       costMultiplier: 3.13, bought: 0, unlocked: false },
    { name: "Hyperverse Herders",      type: "auto",  target: 18, multiplier: 2, unlockBPS: 147_107_000_000,     baseCost: 2_206_605_000_000,       cost: 2_206_605_000_000,       costMultiplier: 3.20, bought: 0, unlocked: false },
    { name: "Omniverse Overlords",     type: "auto",  target: 19, multiplier: 2, unlockBPS: 271_932_000_000,     baseCost: 4_078_980_000_000,       cost: 4_078_980_000_000,       costMultiplier: 3.27, bought: 0, unlocked: false },
    { name: "Eternal Purrers",         type: "auto",  target: 20, multiplier: 2, unlockBPS: 503_070_000_000,     baseCost: 7_546_050_000_000,       cost: 7_546_050_000_000,       costMultiplier: 3.33, bought: 0, unlocked: false },
    { name: "Infinity Scratchers",     type: "auto",  target: 21, multiplier: 2, unlockBPS: 930_787_000_000,     baseCost: 18_615_740_000_000,      cost: 18_615_740_000_000,      costMultiplier: 3.40, bought: 0, unlocked: false },
    { name: "Singularity Sleepers",    type: "auto",  target: 22, multiplier: 2, unlockBPS: 1_721_183_000_000,   baseCost: 34_423_660_000_000,      cost: 34_423_660_000_000,      costMultiplier: 3.47, bought: 0, unlocked: false },
    { name: "Beyond Biscuiteers",      type: "auto",  target: 23, multiplier: 2, unlockBPS: 3_182_244_000_000,   baseCost: 63_644_880_000_000,      cost: 63_644_880_000_000,      costMultiplier: 3.53, bought: 0, unlocked: false },
    { name: "Absolute Whiskers",       type: "auto",  target: 24, multiplier: 2, unlockBPS: 5_884_369_000_000,   baseCost: 117_687_380_000_000,     cost: 117_687_380_000_000,     costMultiplier: 3.60, bought: 0, unlocked: false },
    { name: "Ultimate Cataclysm",      type: "auto",  target: 25, multiplier: 2, unlockBPS: 10_876_845_000_000,  baseCost: 217_536_900_000_000,     cost: 217_536_900_000_000,     costMultiplier: 3.67, bought: 0, unlocked: false },
    { name: "Omega Overcats",          type: "auto",  target: 26, multiplier: 2, unlockBPS: 20_127_641_000_000,  baseCost: 402_552_820_000_000,     cost: 402_552_820_000_000,     costMultiplier: 3.73, bought: 0, unlocked: false },
    { name: "Alpha Aristocats",        type: "auto",  target: 27, multiplier: 2, unlockBPS: 37_259_779_000_000,  baseCost: 745_195_580_000_000,     cost: 745_195_580_000_000,     costMultiplier: 3.80, bought: 0, unlocked: false },
    { name: "Prime Pouncers",          type: "auto",  target: 28, multiplier: 2, unlockBPS: 68_972_538_000_000,  baseCost: 1_379_450_760_000_000,   cost: 1_379_450_760_000_000,   costMultiplier: 3.87, bought: 0, unlocked: false },
    { name: "Supreme Sphinxes",        type: "auto",  target: 29, multiplier: 2, unlockBPS: 127_694_755_000_000, baseCost: 2_553_895_100_000_000,   cost: 2_553_895_100_000_000,   costMultiplier: 3.93, bought: 0, unlocked: false },
    { name: "Septillionaire Slinkers", type: "auto",  target: 30, multiplier: 2, unlockBPS: 1_000_000_000_000_000, baseCost: 20_000_000_000_000_000, cost: 20_000_000_000_000_000, costMultiplier: 4.00, bought: 0, unlocked: false }
];   


// --- Start Sprite Animation ---
function startCatAnimation() {
    setInterval(() => {
        animationFrame = (animationFrame + 1) % totalFrames;
        mainCat.style.backgroundPosition = `-${animationFrame * frameWidth}px 0`;
    }, 80);
}


// --- Update Cat Sprite Sheet ---
function updateCatSpriteSheet() {
    let newIndex = 0;
    for (let i = spriteSheets.length - 1; i >= 0; i--) {
        if (biscuitCount >= spriteSheets[i].threshold) {
            newIndex = i;
            break;
        }
    }
    if (newIndex !== currentSpriteSheetIndex) {
        mainCat.style.backgroundImage = `url('${spriteSheets[newIndex].src}')`;
        mainCat.style.backgroundColor = "transparent"; // Ensure no color behind
        currentSpriteSheetIndex = newIndex;
    }
}


// --- Render Cat Name ---
function renderCatName() {
    const catNameElem = document.getElementById("catName");
    catNameElem.textContent = catName;
}


// --- Auto-Clicker (Biscuits per second) ---
function startAutoClicker() {
    function tick(now) {
        const elapsed = (now - lastTick) / 1000; // seconds since last frame
        lastTick = now;

        // Add biscuits based on BPS and time passed
        fractionalBiscuits += autoClickMultiplier * elapsed;

        // Only whole biscuits affect game logic, but display fractions too!
        const wholeBiscuits = Math.floor(fractionalBiscuits);
        if (wholeBiscuits > 0) {
            biscuitCount += wholeBiscuits;
            fractionalBiscuits -= wholeBiscuits;
        }

        // Show precise, smooth increment (including fractional part)
        counterSpan.textContent = formatNumber(biscuitCount + fractionalBiscuits);

        updateCatSpriteSheet();
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}


// --- Increment Biscuits & Update UI ---
function incrementBiscuits(amount) {
    biscuitCount += amount;
    counterSpan.textContent = formatNumber(biscuitCount);
    updateCatSpriteSheet();
    updateBuffUnlocks()
    saveGameState();
}


// --- BPS Display Update ---
function updateBPS() {
    let displayBPS = autoClickMultiplier;
    if (luckyFishActive) {
        displayBPS = autoClickMultiplier * luckyFishMultiplier;
    }
    bpsSpan.textContent = formatNumber(displayBPS);
}


function getCurrentBPS() {
    return autoUpgrades.reduce((sum, upg) => sum + (upg.bps * upg.bought), 0);
}


// --- Cat Click Animation ---
function growCat() {
    mainCat.style.transform = "scale(1.2)";
    setTimeout(() => {
        mainCat.style.transform = "scale(1)";
    }, 120);
}


// --- User Click Handler (Player click) ---
mainCat.addEventListener("click", function(e) {
    let clickValue = clickMultiplier;
    if (luckyFishActive && luckyFishClickMultiplier > 1) {
        clickValue *= luckyFishClickMultiplier;
    }
    incrementBiscuits(clickValue);
    growCat();
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    showClickPopup(x, y, clickValue);
});


// --- Render Upgrades ---
function renderUpgradeList(upgrades, containerId, buyHandler) {
    const upgradeList = document.getElementById(containerId);
    upgradeList.innerHTML = "";
    upgrades.forEach((upg, i) => {
        const row = document.createElement("div");
        row.className = "upgrade-row";

        // Create the icon element
        const icon = document.createElement("img");
        icon.className = "upgrade-list-icon";
        icon.src = `assets/upgrades/${upg.name.replace(/ /g, "_").toLowerCase()}.png`;
        icon.alt = upg.name;

        const btn = document.createElement("button");
        btn.className = "upgrade-btn";
        let statText;

        // Upgrades
        if (upg.multiplier) {
            // Buff upgrades
            if (!upg.unlocked) {
                btn.innerHTML = `??? (Locked)<br>
                    <span class="upgrade-price">Unlocks at ${formatNumber(upg.unlockBPS)} BPS</span>`;
                btn.disabled = true;
            } else {
                if (upg.type === "click") {
                    statText = `Multiply Current Clicker Rate By <span class="upgrade-green">x${upg.multiplier}</span>`;
                } else if (upg.type === "auto" && typeof upg.target === "number") {
                    statText = `Multiply ${autoUpgrades[upg.target].name}'s BPS Rate by <span class="upgrade-green">x${upg.multiplier}</span>`;
                } else if (upg.type === "fish") {
                    statText = `Increase Lucky Fish spawn rate by <span class="upgrade-green">${Math.round((1 - upg.multiplier) * 100)}%</span>`;
                } else {
                    statText = "";
                }
                btn.innerHTML = `
                    ${statText}<br>
                    <span class="upgrade-price">Cost: ${formatNumber(upg.cost)} Biscuits</span>
                `;
                btn.onclick = () => buyHandler(upg);
                btn.disabled = false; 
            }
        } else if (upg.bps) {
            // Auto upgrades
            if (i > 0 && upgrades[i - 1].bought < 1) {
                btn.innerHTML = `??? (Locked)<br>
                    <span class="upgrade-price">Cost: ${formatNumber(upg.cost)} Biscuits</span>`;
                btn.disabled = true;
            } else {
                statText = `${upg.name} <span class="upgrade-green">+${formatNumber(upg.bps)}</span> BPS`;
                btn.innerHTML = `
                    ${statText}<br>
                    <span class="upgrade-price">Cost: ${formatNumber(upg.cost)} Biscuits</span>
                `;
                btn.onclick = () => buyHandler(upg);
            }
        } else {
            // Click upgrades
            if (i > 0 && upgrades[i - 1].bought < 1) {
                btn.innerHTML = `??? (Locked)<br>
                    <span class="upgrade-price">Cost: ${formatNumber(upg.cost)} Biscuits</span>`;
                btn.disabled = true;
            } else {
                statText = `${upg.name} <span class="upgrade-green">+${formatNumber(upg.clickBoost)}</span> per click`;
                btn.innerHTML = `
                    ${statText}<br>
                    <span class="upgrade-price">Cost: ${formatNumber(upg.cost)} Biscuits</span>
                `;
                btn.onclick = () => buyHandler(upg);
            }
        }

        const counter = document.createElement("span");
        counter.className = "upgrade-counter";
        counter.textContent = `x${formatNumber(upg.bought)}`;

        row.appendChild(icon);
        row.appendChild(btn);
        row.appendChild(counter);
        upgradeList.appendChild(row);
    });
}


// --- Buy Auto Click Upgrades ---
function buyAutoUpgrade(upg) {
    if (biscuitCount >= upg.cost) {
        biscuitCount -= upg.cost;
        upg.bought += 1;
        autoClickMultiplier += upg.bps;
        upg.cost = Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, upg.bought));
        counterSpan.textContent = biscuitCount;
        updateBPS();
        updateBuffUnlocks();
        renderUpgradeList(autoUpgrades, "autoUpgrades", buyAutoUpgrade);
        saveGameState();
        if (upg.bought % 10 === 0 && upg.bought / 10 <= 10) {
            showUpgradeIcon("auto", upg.name);
        } 
    }
}


// --- Buy User Click Upgrades ---
function buyClickUpgrade(upg) {
    if (biscuitCount >= upg.cost) {
        biscuitCount -= upg.cost;
        upg.bought += 1;
        clickMultiplier += upg.clickBoost;
        upg.cost = Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, upg.bought));
        counterSpan.textContent = biscuitCount;
        renderUpgradeList(clickUpgrades, "clickUpgrades", buyClickUpgrade);
        saveGameState();
        if (upg.bought % 10 === 0 && upg.bought / 10 <= 10) {
            showUpgradeIcon("click", upg.name);
        }
    }
}


// --- Update Buff Unlocks ---
function updateBuffUnlocks() {
    let changed = false;
    const currentBPS = getCurrentBPS();
    buffs.forEach(buff => {
        if (!buff.unlocked && currentBPS >= buff.unlockBPS) {
            buff.unlocked = true;
            changed = true;
        }
    });
    if (changed) {
        renderUpgradeList(buffs, "buffUpgrades", buyBuffUpgrade);
    }
}


// --- Buy Buff Upgrades ---
function buyBuffUpgrade(upg) {
    if (biscuitCount >= upg.cost && upg.unlocked) {
        biscuitCount -= upg.cost;
        upg.bought += 1;
        if (upg.type === "click") {
            clickMultiplier *= upg.multiplier;
        } else if (upg.type === "auto" && typeof upg.target === "number") {
            autoUpgrades[upg.target].bps *= upg.multiplier;
            autoClickMultiplier = autoUpgrades.reduce((sum, upg) => sum + (upg.bps * upg.bought), 0);
            renderUpgradeList(autoUpgrades, "autoUpgrades", buyAutoUpgrade);
        } else if (upg.type === "fish") {
        }
        upg.cost = Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, upg.bought));
        counterSpan.textContent = formatNumber(biscuitCount);
        updateBPS();
        updateBuffUnlocks();
        renderUpgradeList(buffs, "buffUpgrades", buyBuffUpgrade);
        saveGameState();
    }
}


// --- Collapsible Menus ---
document.querySelectorAll('.collapse-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = btn.getAttribute('data-target');
        const targetList = document.getElementById(targetId);
        targetList.classList.toggle('collapsed');
        btn.textContent = btn.textContent.includes('▼')
            ? btn.textContent.replace('▼', '▲')
            : btn.textContent.replace('▲', '▼');
    });
});


// --- Number Wrapper ---
function formatNumber(num) {
    num = Math.floor(num); // Always use whole numbers
    const units = [
        { value: 1e33, name: 'decillion' },
        { value: 1e30, name: 'nonillion' },
        { value: 1e27, name: 'octillion' },
        { value: 1e24, name: 'septillion' },
        { value: 1e21, name: 'sextillion' },
        { value: 1e18, name: 'quintillion' },
        { value: 1e15, name: 'quadrillion' },
        { value: 1e12, name: 'trillion' },
        { value: 1e9,  name: 'billion' },
        { value: 1e6,  name: 'million' }
    ];
    if (num < 10000) {
        return num.toString();
    }
    if (num < 1e6) {
        return num.toLocaleString();
    }
    for (let i = 0; i < units.length; i++) {
        if (num >= units[i].value) {
            let value = num / units[i].value;
            // Show up to 3 decimals for < billion, 2 for billion and above
            let decimals = units[i].value >= 1e9 ? 2 : 3;
            return value.toFixed(decimals) + ' ' + units[i].name;
        }
    }
    return num.toLocaleString();
}

// --- User Click Popup ---
function showClickPopup(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'click-popup';
    popup.textContent = `+${formatNumber(amount)}`;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    document.body.appendChild(popup);

    // Animate up and fade out
    setTimeout(() => {
        popup.style.transform = 'translateY(-120px)';
        popup.style.opacity = '0';
    }, 10);

    // Remove after animation
    setTimeout(() => {
        popup.remove();
    }, 1300);
}


// --- Float Icons on Screen ---
function floatIcon(icon, bodyHeight) {
    let currentTop = parseInt(icon.style.top) || 0;

    function moveTo(newTop) {
        const duration = 8000 + Math.random() * 4000; // move for 6-10 seconds
        const startTop = currentTop;
        const delta = newTop - startTop;
        const startTime = performance.now();

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // ease-in-out for fade
            icon.style.top = `${startTop + delta * ease}px`;
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentTop = newTop;
                setTimeout(() => {
                    moveTo(Math.floor(Math.random() * (bodyHeight - 32)));
                }, 500); // pause before next move
            }
        }
        requestAnimationFrame(animate);
    }
    moveTo(Math.floor(Math.random() * (bodyHeight - 32)));
}


// --- Show Upgrade Icons --- (need to clean this up to be responsive with different sized screens)
function showUpgradeIcon(type, upgradeName) {
    const container = document.getElementById(
        type === "auto" ? "autoUpgradeIcons" : "clickUpgradeIcons"
    );
    const icon = document.createElement("img");
    icon.className = "upgrade-icon";
    icon.src = `assets/upgrades/${upgradeName.replace(/ /g, "_").toLowerCase()}.png`;
    icon.alt = upgradeName;

    // Use body height for vertical placement
    const bodyHeight = document.body.scrollHeight;
    const top = Math.floor(Math.random() * (bodyHeight - 32));
    icon.style.top = `${top}px`;

    // Responsive horizontal wiggle
    let containerWidth = container.offsetWidth || 60; // Use 60px for mobile
    const iconWidth = 18; // match your CSS
    const left = Math.floor(Math.random() * (containerWidth - iconWidth));
    icon.style.left = `${left}px`;

    container.appendChild(icon);

    // Scale up for simple animation
    icon.style.transform = "scale(0.5)";
    setTimeout(() => {
        icon.style.transform = "scale(1)";
    }, 10);

    // Animate floating
    floatIcon(icon, bodyHeight);
}


// --- Save Function --- ( Need to make a Export function so the player can download their save)
function saveGameState() {
    const state = {
        version: SAVE_VERSION,
        biscuitCount,
        autoClickMultiplier,
        clickMultiplier,
        autoUpgrades,
        clickUpgrades,
        buffs,
        catName,
        luckyFishActive,
        luckyFishMultiplier,
        luckyFishEndTime: luckyFishActive ? Date.now() + (luckyFishEndTimeout ? luckyFishEndTimeout._remaining : 0) : null  
    };
    localStorage.setItem("kittyClickerSave", JSON.stringify(state));
}


// --- Load Function ---
function loadGameState() {
    const saved = localStorage.getItem("kittyClickerSave");
    if (saved) {
        const state = JSON.parse(saved);
        if (state.version !== SAVE_VERSION) {
            localStorage.removeItem("kittyClickerSave");
            return;
        }
        biscuitCount = state.biscuitCount || 0;
        autoClickMultiplier = state.autoClickMultiplier || 1;
        clickMultiplier = state.clickMultiplier || 1;
        catName = state.catName || "Name your cat...";

        if (state.autoUpgrades) {
            autoUpgrades.forEach((upgrade, i) => {
                Object.assign(upgrade, state.autoUpgrades[i]);
            });
        }
        if (state.clickUpgrades) {
            clickUpgrades.forEach((upgrade, i) => {
                Object.assign(upgrade, state.clickUpgrades[i]);
            });
        }
        if (state.buffs) {
            buffs.forEach((upgrade, i) => {
                Object.assign(upgrade, state.buffs[i]);
            });
        }
        autoUpgrades.forEach(upg => {
            upg.cost = Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, upg.bought));
        });
        clickUpgrades.forEach(upg => {
            upg.cost = Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, upg.bought));
        });
        buffs.forEach(upg => {
            upg.cost = Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, upg.bought));
        });

        if (luckyFishActive && luckyFishEndTime) {
            const timeLeft = Math.max(0, Math.floor((luckyFishEndTime - Date.now()) / 1000));
            if (timeLeft > 0) {
                showLuckyFishTimer(luckyFishMultiplier, timeLeft);
                luckyFishEndTimeout = setTimeout(() => {
                    updateBPS();
                    luckyFishActive = false;
                    luckyFishMultiplier = 1;
                    luckyFishEndTime = null;
                    luckyFishEndTimeout = null;
                }, timeLeft * 1000);
            } else {
                luckyFishActive = false;
                luckyFishMultiplier = 1;
                luckyFishEndTime = null;
                luckyFishEndTimeout = null;
            }
        }
        renderCatName();
    }
    updateBuffUnlocks();
    updateCatSpriteSheet();
}


// Reload upgrade icons
function reloadUpgradeIcons() {
    // Clear existing icons
    document.getElementById("autoUpgradeIcons").innerHTML = "";
    document.getElementById("clickUpgradeIcons").innerHTML = "";

    // Add icons for auto upgrades (1 icon per 10 bought, max 10)
    autoUpgrades.forEach(upg => {
        const iconCount = Math.min(Math.floor(upg.bought / 10), 10);
        for (let i = 0; i < iconCount; i++) {
            showUpgradeIcon("auto", upg.name);
        }
    });

    // Add icons for click upgrades (1 icon per 10 bought, max 10)
    clickUpgrades.forEach(upg => {
        const iconCount = Math.min(Math.floor(upg.bought / 10), 10);
        for (let i = 0; i < iconCount; i++) {
            showUpgradeIcon("click", upg.name);
        }
    });
}


// --- Delete save and reset game ---
document.getElementById('resetSaveBtn').addEventListener('click', function() {
    const confirmReset = confirm(
        "Are you sure you want to reset your Kitty Clicker progress?\n\nThis cannot be undone!"
    );
    if (confirmReset) {
        // Clear All Game data from Local Storage
        localStorage.removeItem("kittyClickerSave");
        localStorage.clear();
        sessionStorage.clear();

        // Reset Game Variables
        catName = "Name your cat...";
        biscuitCount = 0;
        autoClickMultiplier = 1;
        clickMultiplier = 1;
        fractionalBiscuits = 0;
        lastTick = performance.now();

        autoUpgrades.forEach(upg => {
            upg.bought = 0;
            upg.cost = upg.baseCost;
        });
        clickUpgrades.forEach(upg => {
            upg.bought = 0;
            upg.cost = upg.baseCost;
        });
        buffs.forEach(upg => {
            upg.bought = 0;
            upg.cost = upg.baseCost;
            upg.unlocked = false;
        });

        // Re Render the Elements
        counterSpan.textContent = formatNumber(biscuitCount);
        updateBPS();
        updateCatSpriteSheet();
        renderUpgradeList(autoUpgrades, "autoUpgrades", buyAutoUpgrade);
        renderUpgradeList(clickUpgrades, "clickUpgrades", buyClickUpgrade);
        renderUpgradeList(buffs, "buffUpgrades", buyBuffUpgrade);

        // Reload Page after Resets
        location.reload();
    }
});


// Editable cat name logic
document.addEventListener("DOMContentLoaded", () => {
    const catNameElem = document.getElementById("catName");
    renderCatName();

    catNameElem.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = catName;
        input.className = "cat-name-edit";
        input.maxLength = 24;
        catNameElem.replaceWith(input);
        input.focus();

        input.addEventListener("blur", () => {
            catName = input.value.trim() || "Name your cat...";
            input.replaceWith(catNameElem);
            renderCatName();
            saveGameState();
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });
    });
});


// --- Lucky Fish Feature Logic ---

// --- Spawn Lucky Fish ---
function spawnLuckyFish() {
    if (luckyFishActive) return; // Only one at a time

    luckyFishType = Math.random() < 0.5 ? "bps" : "click";
    const fish = document.createElement("img");
    fish.src = luckyFishType === "bps"
        ? "assets/sprite/lucky_fish.png"
        : "assets/sprite/golden_fish.png";
    fish.alt = luckyFishType === "bps" ? "Lucky Fish" : "Golden Fish";
    fish.className = luckyFishType === "bps" ? "lucky-fish" : "golden-fish";
    fish.style.position = "absolute";
    fish.style.width = "0px";
    fish.style.height = "0px";
    fish.style.zIndex = "2000";

    // Random position
    const maxLeft = window.innerWidth - 64;
    const maxTop = window.innerHeight - 64;
    fish.style.left = `${Math.floor(Math.random() * maxLeft)}px`;
    fish.style.top = `${Math.floor(Math.random() * maxTop)}px`;

    document.body.appendChild(fish);

    // Grow animation over 5 seconds
    let size = 0;
    const maxSize = 64;
    const growDuration = 5000; // grows for 5 seconds
    const growSteps = maxSize / 2; // 2px per step
    const growIntervalTime = growDuration / growSteps; // 5000ms / 32 steps = ~156ms per step

    const growInterval = setInterval(() => {
        size += 2;
        fish.style.width = `${size}px`;
        fish.style.height = `${size}px`;
        if (size >= maxSize) {
            clearInterval(growInterval);
            // Remove fish after 5 seconds if not clicked
            luckyFishTimeout = setTimeout(() => {
                fish.remove();
                luckyFishTimeout = null;
            }, 5000);
        }
    }, growIntervalTime);

    // Click handler
    fish.onclick = () => {
        clearInterval(growInterval);
        if (luckyFishTimeout) clearTimeout(luckyFishTimeout);
        fish.remove();
        triggerLuckyFishFeature();
    };
}


// --- Trigger Lucky Fish ---
function triggerLuckyFishFeature() {
    if (luckyFishActive) return;
    luckyFishActive = true;

    // Pick a multiplier between 2.0 and 12.0 (step 0.1)
    const multiplier = +(Math.random() * 10 + 2).toFixed(1);
    luckyFishMultiplier = multiplier;

    // Duration: x4 = 2min, x8 = 20s, interpolate linearly
    const duration = 120 - ((multiplier - 2) / 10) * 100; // 120s to 20s
    
    if (luckyFishType === "bps") {
        luckyFishMultiplier = multiplier;
        luckyFishClickMultiplier = 1;
        showLuckyFishTimer(`BPS x${multiplier}`, duration);
    } else {
        luckyFishMultiplier = 1;
        luckyFishClickMultiplier = multiplier;
        showLuckyFishTimer(`Click x${multiplier}`, duration);
    }

    updateBPS();

    // End effect after duration
    luckyFishEndTime = Date.now() + duration * 1000;
    luckyFishEndTimeout = setTimeout(() => {
        updateBPS();
        luckyFishActive = false;
        luckyFishMultiplier = 1;
        luckyFishClickMultiplier = 1;
        luckyFishEndTime = null;
        luckyFishEndTimeout = null;
    }, duration * 1000);
}


// --- Display Timer Notification when Lucky Fish is Active ---
function showLuckyFishTimer(label, duration) {
    let timerDiv = document.getElementById("luckyFishTimer");
    if (!timerDiv) {
        timerDiv = document.createElement("div");
        timerDiv.id = "luckyFishTimer";
        timerDiv.className = "lucky-fish-timer";
        document.body.appendChild(timerDiv);
    }
    timerDiv.style.display = "block";
    let timeLeft = Math.round(duration);
    timerDiv.textContent = `Lucky Fish! ${label} for ${timeLeft}s`;
    const interval = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Lucky Fish! ${label} for ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerDiv.style.display = "none";
        }
    }, 1000);
}


// --- Get Lucky Fish Rate Multiplier ---
function getLuckyFishRateMultiplier() {
    const buff = buffs.find(b => b.type === "fish");
    return buff ? Math.pow(buff.multiplier, buff.bought) : 1;
}


// --- Schedule Lucky Fish (call with true for Testing for faster spawn times) ---
function scheduleLuckyFish(testing = false) {
    // For testing: 30-60s, for production: 10-30min
    const min = testing ? 30 : 600;
    const max = testing ? 60 : 1800;
    const rateMultiplier = getLuckyFishRateMultiplier();
    const next = (Math.random() * (max - min) + min) * rateMultiplier;
    setTimeout(() => {
        spawnLuckyFish();
        scheduleLuckyFish(testing);
    }, next * 1000);
}


// Recalculate upgrade icons positions on window resize
window.addEventListener('resize', () => {
    document.querySelectorAll('.upgrade-icon').forEach(icon => {
        floatIcon(icon, window.innerHeight);
    });
});


// --- Initial Render (on page load) ---
window.addEventListener('DOMContentLoaded', function() {
    loadGameState();
    updateCatSpriteSheet();
    startCatAnimation();
    startAutoClicker();
    counterSpan.textContent = biscuitCount;
    updateBPS();
    renderUpgradeList(autoUpgrades, "autoUpgrades", buyAutoUpgrade);
    renderUpgradeList(clickUpgrades, "clickUpgrades", buyClickUpgrade);
    renderUpgradeList(buffs, "buffUpgrades", buyBuffUpgrade);
    reloadUpgradeIcons();
    setInterval(saveGameState, 3000); // auto save interval
    window.addEventListener('beforeunload', saveGameState); 
    scheduleLuckyFish(false); // set to true to spawn lucky fish more often
});
