const baseUrl = "https://api.covid19api.com";
const countriesUrl = "/countries";
const countryUrl = "/country";

const kpiConfirmed = document.getElementById("kpiconfirmed");
const kpiRecovered = document.getElementById("kpirecovered");
const kpiDeaths = document.getElementById("kpideaths");
const dateStart = document.getElementById("date_start");
const dateEnd = document.getElementById("date_end");
const cmbCountry = document.getElementById("cmbCountry");

cmbCountry.addEventListener('change', handlerChange);
dateStart.addEventListener('change', handlerChange);
dateEnd.addEventListener('change', handlerChange);

async function handlerChange() {
    let country = cmbCountry.value;
    let startDate = new Date(dateStart.value);
    let endDate = new Date(dateEnd.value);
    startDate = dayjs(startDate).add(1, 'day');
    endDate = dayjs(endDate).add(1, 'day');
    startDate = dayjs(startDate).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    endDate = dayjs(endDate).format('YYYY-MM-DD') + 'T23:59:59.999Z';

    const countryData = await getUrl(`${baseUrl}${countryUrl}/${country}?from=${startDate}&to=${endDate}`);
    console.log(countryData);
    renderKpi(countryData);
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
    //console.log(countriesData);

    _.forEach(countriesData, (country) => {
        const opt = document.createElement("option");
        opt.value = country.Country;
        opt.text = country.Country;
        cmbCountry.appendChild(opt);
    });
}

const renderKpi = (data) => {
    const totDeaths = _.reduce(data, (accumulated, country) => {
        return accumulated + country.Deaths;
    }, 0);

    const totConfirmed = _.reduce(data, (accumulated, country) => {
        return accumulated + country.Deaths;
    }, 0);

    let a = 0;
    let b = 0;

    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            a = data[i].Deaths;
        }
        if (i === data.length - 1) {
            b = data[i].Deaths;
        }
    }
    const tDeaths = b - a;



    //kpiConfirmed.innerText = data.Global.TotalConfirmed.toLocaleString("PT");
    kpiDeaths.innerText = totDeaths.toLocaleString("PT");
    //kpiRecovered.innerText = data.Global.TotalRecovered.toLocaleString("PT");
};

countriesKpi();