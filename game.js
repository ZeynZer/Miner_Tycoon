// Données du jeu
let money = 100;
let resources = { coal: 0, gold: 0, diamond: 0 };
let machineCost = 50;
let machines = 0;
let productionRates = { coal: 1, gold: 0.2, diamond: 0.05 };
let fuel = 100; // Le carburant commence à 100%
let maxFuel = 100; // Capacité maximale de carburant
let fuelConsumptionRate = 0.5; // Consommation de carburant par machine par seconde
let fuelUpgradeCost = 50; // Prix initial de l'amélioration

// Sélection des éléments HTML
const moneyDisplay = document.getElementById("money");
const coalDisplay = document.getElementById("coal");
const goldDisplay = document.getElementById("gold");
const diamondDisplay = document.getElementById("diamond");
const machineDisplay = document.getElementById("machines");
const buyMachineBtn = document.getElementById("buyMachine");

const fuelBar = document.getElementById("fuel-bar");
const fuelProgress = document.getElementById("fuel-progress");
const fuelPercentage = document.getElementById("fuel-percentage");
const rechargeFuelBtn = document.getElementById("recharge-fuel");
const upgradeFuelBtn = document.getElementById("upgradeFuel");
const resetGameBtn = document.getElementById("resetGame");

// Charger les données sauvegardées depuis localStorage
function loadGameData() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return {
        money: 100,
        resources: { coal: 0, gold: 0, diamond: 0 },
        machineCost: 50,
        machines: 0,
        productionRates: { coal: 1, gold: 0.2, diamond: 0.05 },
        fuel: 100,
        maxFuel: 100,
        fuelConsumptionRate: 0.5,
        fuelUpgradeCost: 50
    };
}

// Sauvegarder les données du jeu dans localStorage
function saveGameData() {
    const gameData = {
        money,
        resources,
        machineCost,
        machines,
        productionRates,
        fuel,
        maxFuel,
        fuelConsumptionRate,
        fuelUpgradeCost
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Achat de machine
buyMachineBtn.addEventListener("click", () => {
    if (money >= machineCost) {
        money -= machineCost;
        machines++;
        machineCost = Math.floor(machineCost * 1.3);
        buyMachineBtn.textContent = `Acheter une Foreuse (${machineCost}💰)`;
        updateDisplay();
        saveGameData();
    }
});

// Recharge de carburant
rechargeFuelBtn.addEventListener("click", () => {
    if (fuel < maxFuel-10)
    {
        if (money >= 100) {
            money -= 100;
            fuel += 10;
            updateDisplay();
            saveGameData();
        }
    }
    
});

// Amélioration de la capacité de carburant
upgradeFuelBtn.addEventListener("click", () => {
    if (money >= fuelUpgradeCost) {
        money -= fuelUpgradeCost;
        maxFuel += 50;
        fuelUpgradeCost = Math.floor(fuelUpgradeCost * 1.3);
        upgradeFuelBtn.textContent = `🔋🔼 (${fuelUpgradeCost}💰)`;
        updateDisplay();
        saveGameData();
    } else {
        alert("💰 Pas assez d'argent pour améliorer la capacité !");
    }
});

// Production automatique des ressources
function produceResources() {
    if (machines > 0 && fuel > 0) {
        resources.coal += machines * productionRates.coal;
        resources.gold += machines * productionRates.gold;
        resources.diamond += machines * productionRates.diamond;
        money += machines * 5;
        fuel -= machines * fuelConsumptionRate;
        updateDisplay();
        saveGameData();
    } else if (fuel <= 0) {
        fuel = 0;
        updateDisplay();
        saveGameData();
    }
}

// Mise à jour de l'affichage
function updateDisplay() {
    moneyDisplay.textContent = money.toFixed(2);
    coalDisplay.textContent = Math.floor(resources.coal);
    goldDisplay.textContent = Math.floor(resources.gold);
    diamondDisplay.textContent = Math.floor(resources.diamond);
    machineDisplay.textContent = machines;

    // Mise à jour du carburant
    let fuelPercent = (fuel / maxFuel) * 100;
    fuelProgress.style.width = fuelPercent + "%";

    if (fuelPercent > 66) {
        fuelProgress.style.backgroundColor = "green";
    } else if (fuelPercent > 33) {
        fuelProgress.style.backgroundColor = "orange";
    } else {
        fuelProgress.style.backgroundColor = "red";
    }

    fuelPercentage.textContent = `${Math.floor(fuelPercent)}% Carburant`;
}

// Réinitialisation du jeu
resetGameBtn.addEventListener("click", () => {
    const confirmation = confirm("⚠️ Voulez-vous vraiment réinitialiser votre progression ? Cette action est irréversible !");
    if (confirmation) {
        localStorage.removeItem('gameData');
        money = 100;
        resources = { coal: 0, gold: 0, diamond: 0 };
        machineCost = 50;
        machines = 0;
        fuel = 100;
        maxFuel = 100;
        fuelConsumptionRate = 0.5;
        fuelUpgradeCost = 50;

        updateDisplay();
        alert("🔄 Jeu réinitialisé avec succès !");
    }
});

// Démarrer le jeu au chargement de la page
function startGame() {
    const gameData = loadGameData();
    money = gameData.money;
    resources = gameData.resources;
    machineCost = gameData.machineCost;
    machines = gameData.machines;
    productionRates = gameData.productionRates;
    fuel = gameData.fuel;
    maxFuel = gameData.maxFuel;
    fuelConsumptionRate = gameData.fuelConsumptionRate;
    fuelUpgradeCost = gameData.fuelUpgradeCost;

    upgradeFuelBtn.textContent = `🔋🔼 (${fuelUpgradeCost}💰)`;
    updateDisplay();
    setInterval(produceResources, 1000);
}

window.onload = startGame;
