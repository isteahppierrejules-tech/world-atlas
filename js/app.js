document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('country-input');
    const errorMsg = document.getElementById('error-message');
    const spinner = document.getElementById('loading-spinner');
    const resultSection = document.getElementById('result-section');

    // Eleman pou montre done yo
    const flagImg = document.getElementById('country-flag');
    const nameTxt = document.getElementById('country-name');
    const capitalTxt = document.getElementById('country-capital');
    const popTxt = document.getElementById('country-population');
    const regionTxt = document.getElementById('country-region');
    const currencyTxt = document.getElementById('country-currency');
    const languagesTxt = document.getElementById('country-languages');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Anpeche paj la recharje
        
        const query = input.value.trim(); // Netwaye espas yo

        // 1. Validasyon ak Aksesibilite (Si jaden an vid)
        if (query === '') {
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', 'error-message');
            errorMsg.textContent = "Le champ de recherche ne peut pas être vide.";
            resultSection.classList.add('hidden');
            return;
        }

        // Si itilizatè a kòmanse tape, nou retire eta erè a
        resetError();

        // Afiche spinner a epi kache rezilta anvan yo
        spinner.classList.remove('hidden');
        resultSection.classList.add('hidden');

        // 2. Apèl API ak async/await ak try...catch
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                // Si API a voye yon erè (pa egzanp 404 peyi a pa egziste)
                throw new Error("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
            }

            const data = await dataResponse(response);
            displayCountry(data[0]); // Nou pran premye peyi ki koresponn lan

        } catch (error) {
            // Jesyon erè rezo oswa lòt erè
            if (error.message.includes("fetch")) {
                errorMsg.textContent = "Connexion impossible. Veuillez vérifier votre accès à internet.";
            } else {
                errorMsg.textContent = error.message;
            }
        } finally {
            // Toujou kache spinner a lè n fini
            spinner.classList.add('hidden');
        }
    });

    // Fonksyon pou netwaye erè yo
    input.addEventListener('input', resetError);

    function resetError() {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        errorMsg.textContent = '';
    }

    // Fonksyon oksilyè pou jere JSON an san danje
    async function dataResponse(res) {
        return await res.json();
    }

    // 3. Injection des données (Sekirize ak textContent pou evite XSS)
    function displayCountry(country) {
        // Idantifyan yo obligatwa dapre devwa a
        nameTxt.textContent = country.name?.common || "N/A";
        capitalTxt.textContent = country.capital ? country.capital[0] : "N/A";
        
        // Fòma popilasyon ak espas (ex: 11 500 000)
        const population = country.population;
        popTxt.textContent = population ? new Intl.NumberFormat('fr-FR').format(population).replace(/,/g, ' ') : "N/A";
        
        regionTxt.textContent = country.region || "N/A";

        // Drapo ak deskripsyon alt li
        flagImg.src = country.flags?.svg || "";
        flagImg.alt = country.flags?.alt || `Drapeau de ${country.name?.common}`;

        // Ekstrè Monnen (Currencies)
        if (country.currencies) {
            const currencyKey = Object.keys(country.currencies)[0];
            const currencyName = country.currencies[currencyKey].name;
            const currencySymbol = country.currencies[currencyKey].symbol || "";
            currencyTxt.textContent = `${currencyName} (${currencySymbol})`;
        } else {
            currencyTxt.textContent = "N/A";
        }

        // Ekstrè Lang (Languages)
        if (country.languages) {
            const langList = Object.values(country.languages).join(', ');
            languagesTxt.textContent = langList;
        } else {
            languagesTxt.textContent = "N/A";
        }

        // Afiche kat la
        resultSection.classList.remove('hidden');
    }
});