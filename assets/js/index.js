const baseUrl = "https://api.covid19api.com";
const summaryUrl = "/summary";

const totalConfirmed = document.getElementById("confirmed");
const totalRecovered = document.getElementById("recovered");
const totalDeaths = document.getElementById("death");
const todayDate = document.getElementById("date");

async function getUrl(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

const summary = async () => {
    const summaryData = await getUrl(`${baseUrl}${summaryUrl}`);
    renderData(summaryData);
    renderPizzaChart(summaryData);
    renderBarChart(summaryData);
}

const renderData = data => {
    totalConfirmed.innerText = data.Global.TotalConfirmed.toLocaleString("PT");
    totalDeaths.innerText = data.Global.TotalDeaths.toLocaleString("PT");
    totalRecovered.innerText = data.Global.TotalRecovered.toLocaleString("PT");
    const actualDate = formatDate(data.Global.Date);
    todayDate.innerText = `Data de atualização:  ${actualDate}`;
};

const formatDate = date => {
    const tDate = new Date(date);

    dateFormatted = dateFns.format(tDate, 'DD-MM-YYYY HH:mm:ss');

    return dateFormatted;
}

let pizza = new Chart(document.getElementById("pizza"), {
    type: "pie",
    data: {
        labels: ["Confirmados", "Recuperados", "Mortes"],
        datasets: [{
            data: [30, 50, 20],
            backgroundColor: ["#3e95cd", "#3c8523", "#42f39f"]
        }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Distribuição de novos casos"
            }
        }
    }
});

const renderPizzaChart = summaryData => {
    pizza.data.datasets[0].data = [
        summaryData.Global.NewConfirmed.toLocaleString("PT"),
        summaryData.Global.NewRecovered.toLocaleString("PT"),
        summaryData.Global.NewDeaths.toLocaleString("PT")
    ];

    pizza.update();
};

let barras = new Chart(document.getElementById("barras"), {
    type: "bar",
    data: {
        labels: ["País 1", "País 2", "País 3", "País 4", "País 5", "País 6", "País 7", "País 8", "País 9", "País 10"],
        datasets: [{
            label: "",
            data: [1000, 5100, 10000, 1000, 5100, 10000, 1000, 5100, 10000, 3050],
            backgroundColor: ["#3e95cd"]
        }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Total de Mortes por país - Top 10"
            }
        }
    }
});

const renderBarChart = summaryData => {
    const countriesData = summaryData.Countries;
    const filteredData = _.orderBy(countriesData, ['TotalDeaths'], ['desc']).slice([start = 0], [end = 10]);

    barras.data.labels = [
        filteredData[0].Country, filteredData[1].Country, filteredData[2].Country, filteredData[3].Country,
        filteredData[4].Country, filteredData[5].Country, filteredData[6].Country, filteredData[7].Country,
        filteredData[8].Country, filteredData[9].Country
    ];
    barras.data.datasets[0].data = [
        filteredData[0].TotalDeaths, filteredData[1].TotalDeaths, filteredData[2].TotalDeaths, filteredData[3].TotalDeaths,
        filteredData[4].TotalDeaths, filteredData[5].TotalDeaths, filteredData[6].TotalDeaths, filteredData[7].TotalDeaths,
        filteredData[8].TotalDeaths, filteredData[9].TotalDeaths
    ];

    barras.update();
};

window.onload = () => {
    summary();
}