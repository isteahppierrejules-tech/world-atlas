document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('country-input');
    const errorMsg = document.getElementById('error-message');
    const spinner = document.getElementById('loading-spinner');
    const resultSection = document.getElementById('result-section');

    // Eleman pou montre done yo nan kat la
    const flagImg = document.getElementById('country-flag');
    const nameTxt = document.getElementById('country-name');
    const capitalTxt = document.getElementById('country-capital');
    const subCapitalTxt = document.getElementById('sub-capital');
    const popTxt = document.getElementById('country-population');
    const regionTxt = document.getElementById('country-region');
    const currencyTxt = document.getElementById('country-currency');
    const languagesTxt = document.getElementById('country-languages');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Anpeche paj la rechaje
        
        const query = input.value.trim(); // Netwaye espas vid yo

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

            const data = await response.json();
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

    // Fonksyon pou netwaye erè yo lè moun nan ap tape
    input.addEventListener('input', resetError);

    function resetError() {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        errorMsg.textContent = '';
    }

    // 3. Enjeksyon done yo (Sekirize ak textContent pou evite vòl done / XSS)
    function displayCountry(country) {
        // Non ak Kapital yo
        const countryName = country.name?.common || "N/A";
        nameTxt.textContent = countryName;
        
        const capitalName = country.capital ? country.capital[0] : "N/A";
        capitalTxt.textContent = countryName; // Pou premye liy lan (Name)
        subCapitalTxt.textContent = capitalName; // Pou dezyèm liy lan (Capital)
        
        // Fòma popilasyon ak espas dous (ex: 11 500 000)
        const population = country.population;
        popTxt.textContent = population ? population.toLocaleString('fr-FR') : "N/A";
        
        // Rejyon
        regionTxt.textContent = country.region || "N/A";

        // Drapo ak deskripsyon alt li pou aksesibilite
        flagImg.src = country.flags?.svg || "";
        flagImg.alt = country.flags?.alt || `Drapeau de ${countryName}`;

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

        // Afiche bèl kat la kounye a
        resultSection.classList.remove('hidden');
    }
});