
let airports = [];
let delays = [];
let selectedAirportID = null;

// Charger la liste des aéroports
fetch('airports.json')
    .then(response => response.json())
    .then(data => {
        airports = data;
        const datalist = document.getElementById('airports');
        data.forEach(airport => {
            const option = document.createElement('option');
            option.value = airport.DestAirportName;
            datalist.appendChild(option);
        });
    });

// Charger les données de retard
fetch('delays.json')
    .then(response => response.json())
    .then(data => {
        delays = data;
    });

const daySelect = document.getElementById('day');
const airportInput = document.getElementById('airport');
const resultDiv = document.getElementById('results');

const translations = {
    fr: {
        appTitle: "Scanner de Retard",
        title: "Chances de Retard",
        labelDay: "Jour de la semaine :",
        labelAirport: "Choisissez un aéroport:",
        placeholderAirport: "Tapez pour chercher...",
        delayText: "Chance de retard >15 min: ",
        days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
    },
    en: {
        appTitle: "Delay Scanner",
        title: "Delay Chances",
        labelDay: "Day of the Week:",
        labelAirport: "Choose an Airport:",
        placeholderAirport: "Type to search...",
        delayText: "Chance of delay >15 min: ",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    }
};

const languageSelector = document.getElementById('language');

function updateLanguage(lang) {
    document.getElementById('app-title').textContent = translations[lang].appTitle;
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('label-day').textContent = translations[lang].labelDay;
    document.getElementById('label-airport').textContent = translations[lang].labelAirport;
    document.getElementById('airport').placeholder = translations[lang].placeholderAirport;

    // Update days of the week
    const dayOptions = daySelect.options;
    translations[lang].days.forEach((dayName, index) => {
        dayOptions[index].textContent = dayName;
    });

    // Update existing delay results if any
    const delayDivs = document.querySelectorAll('.delay');
    delayDivs.forEach(div => {
        const percentageMatch = div.textContent.match(/\d+(\.\d+)?/);
        if (percentageMatch) {
            const percentage = percentageMatch[0];
            div.textContent = `${translations[lang].delayText}${percentage}%`;
        }
    });
}

// Initial language setup
updateLanguage('fr'); // Default to French

// Event listener for language change
languageSelector.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

// Modify updateResult to use translations
function updateResult() {
    const lang = languageSelector.value;
    const dayId = daySelect.value;
    const airportName = airportInput.value;

    if (dayId && airportName) {
        const filtered = delays.filter(item => item.DestAirportName === airportName && item.DayOfWeek == dayId);
        resultDiv.innerHTML = '';

        filtered.forEach(item => {
            let colorClass = '';
            if (item.ChanceOfDel15 < 20) {
                colorClass = 'green';
            } else if (item.ChanceOfDel15 >= 20 && item.ChanceOfDel15 <= 30) {
                colorClass = 'orange';
            } else {
                colorClass = 'red';
            }

            const delayDiv = document.createElement('div');
            delayDiv.classList.add('delay', colorClass);
            delayDiv.textContent = `${translations[lang].delayText}${item.ChanceOfDel15}%`;
            resultDiv.appendChild(delayDiv);
        });
    } else {
        resultDiv.textContent = '';
    }
}

// Événement sur le changement du jour
daySelect.addEventListener('change', updateResult);

// Ajouter des écouteurs d'événements sur les sélections de jour et d'aéroport
airportInput.addEventListener('input', updateResult);