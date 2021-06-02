const baseUrl = "https://api.covid19api.com";
const countriesUrl = "/countries";
const countryUrl = "/country";

const kpiConfirmed = document.getElementById("kpiconfirmed");
const kpiRecovered = document.getElementById("kpirecovered");
const kpiDeaths = document.getElementById("kpideaths");
const dateStart = document.getElementById("date_start");
const dateEnd = document.getElementById("date_end");
const cmbCountry = document.getElementById("cmbCountry");
const cmbData = document.getElementById("cmbData");

cmbCountry.addEventListener('change', handlerChange);
dateStart.addEventListener('change', handlerChange);
dateEnd.addEventListener('change', handlerChange);
cmbData.addEventListener('change', handlerChange);

async function handlerChange() {
    let country = cmbCountry.value;
    let startDate = new Date(dateStart.value);
    let endDate = new Date(dateEnd.value);
    let dataCombo = cmbData.value;
    endDate = dayjs(endDate).add(2, 'day');
    startDate = dayjs(startDate).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    endDate = dayjs(endDate).format('YYYY-MM-DD') + 'T00:00:00.000Z';

    const countryData = await getUrl(`${baseUrl}${countryUrl}/${country}?from=${startDate}&to=${endDate}`);
    renderKpi(countryData);
    renderLineChart(countryData, dataCombo);
}

async function getUrl(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

const countriesKpi = async () => {
    const countriesData = await getUrl(`${baseUrl}${countriesUrl}`);
    populateCombo(countriesData);
}

const populateCombo = (countriesData) => {
    countriesData = _.orderBy(countriesData, ['Country'], ['asc']);

    _.forEach(countriesData, (country) => {
        const opt = document.createElement("option");
        opt.value = country.Country;
        opt.text = country.Country;
        cmbCountry.appendChild(opt);
    });
}

const renderKpi = (data) => {
    const totDeaths = _.last(data).Deaths;
    const totRecovered = _.last(data).Recovered;
    const totConfirmed = _.last(data).Confirmed;

    kpiConfirmed.innerText = totConfirmed.toLocaleString("PT");
    kpiDeaths.innerText = totDeaths.toLocaleString("PT");
    kpiRecovered.innerText = totRecovered.toLocaleString("PT");
};

let linhas = new Chart(document.getElementById("linhas"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "",
            data: [],
            backgroundColor: ["#ab241b"],
            borderColor: ["#751913"]
        },
        {
            label: "",
            data: [],
            backgroundColor: ["#0275d8"],
            borderColor: ["#0164c7"]
        }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

const renderLineChart = (data, dataCombo) => {
    if (dataCombo === 'Confirmed') {
        let aConfirmed = [];
        let avgConfirmed = [];
        let dateConfirmed = [];

        for (let i = 0, j = 1; j < data.length; i++, j++) {
            aConfirmed[i] = (+data[j].Confirmed - data[i].Confirmed);
            let dater = dayjs(data[i].Date).add(2, 'day');
            dater = dater.format('DD-MM-YYYY');
            dateConfirmed[i] = dater;
        }

        for (let i = 0; i < aConfirmed.length; i++) {
            avgConfirmed[i] = _.meanBy(aConfirmed, (avg) => avg);
        }
        dateConfirmed = _.dropRight(dateConfirmed);
        linhas.data.labels = dateConfirmed;
        linhas.data.datasets[0].data = aConfirmed;
        linhas.data.datasets[0].label = "Número de confirmados";
        linhas.data.datasets[1].data = avgConfirmed;
        linhas.data.datasets[1].label = "Média de confirmados";
    } else if (dataCombo === 'Deaths') {
        let aDeaths = [];
        let avgDeaths = [];
        let dateDeaths = [];

        for (let i = 0, j = 1; j < data.length; i++, j++) {
            aDeaths[i] = (+data[j].Deaths - data[i].Deaths);
            let dater = dayjs(data[i].Date).add(2, 'day');
            dater = dater.format('DD-MM-YYYY');
            dateDeaths[i] = dater;
        }

        for (let i = 0; i < aDeaths.length; i++) {
            avgDeaths[i] = _.meanBy(aDeaths, (avg) => avg);
        }

        dateDeaths = _.dropRight(dateDeaths);
        linhas.data.labels = dateDeaths;
        linhas.data.datasets[0].data = aDeaths;
        linhas.data.datasets[0].label = "Número de mortes";
        linhas.data.datasets[1].data = avgDeaths;
        linhas.data.datasets[1].label = "Média de mortes";
    } else {
        let aRecovered = [];
        let avgRecovered = [];
        let dateRecovered = [];

        for (let i = 0, j = 1; j < data.length; i++, j++) {
            aRecovered[i] = (+data[j].Recovered - data[i].Recovered);
            let dater = dayjs(data[i].Date).add(2, 'day');
            dater = dater.format('DD-MM-YYYY');
            dateRecovered[i] = dater;
        }

        for (let i = 0; i < aRecovered.length; i++) {
            avgRecovered[i] = _.meanBy(aRecovered, (avg) => avg);
        }

        dateRecovered = _.dropRight(dateRecovered);
        linhas.data.labels = dateRecovered;
        linhas.data.datasets[0].data = aRecovered;
        linhas.data.datasets[0].label = "Número de recuperados";
        linhas.data.datasets[1].data = avgRecovered;
        linhas.data.datasets[1].label = "Média de recuperados";
    }

    linhas.update();
};

countriesKpi();