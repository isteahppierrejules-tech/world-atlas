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
                throw new Error("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
            }

            const data = await response.json();
            displayCountry(data[0]); // Nou pran premye peyi ki koresponn lan

        } catch (error) {
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

    input.addEventListener('input', resetError);

    function resetError() {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        errorMsg.textContent = '';
    }

    // 3. Enjeksyon done yo (Sekirize ak textContent pou evite XSS)
    function displayCountry(country) {
        const countryName = country.name?.common || "N/A";
        nameTxt.textContent = countryName;
        
        // KOREKSYON LA : N ap ranpli de liy yo kòrèkteman selon HTML la
        capitalTxt.textContent = countryName; 
        subCapitalTxt.textContent = country.capital ? country.capital[0] : "N/A"; 
        
        // Fòma popilasyon ak espas pwòp (ex: 11 500 000)
        const population = country.population;
        if (population) {
            let formattedPop = population.toLocaleString('fr-FR');
            popTxt.textContent = formattedPop.replace(/[\u202f\u00a0]/g, ' ');
        } else {
            popTxt.textContent = "N/A";
        }
        
        regionTxt.textContent = country.region || "N/A";

        // Drapo ak deskripsyon alt li pou aksesibilite
        flagImg.src = country.flags?.svg || "";
        flagImg.alt = country.flags?.alt || `Drapeau de ${countryName}`;

        // Ekstrè Monnen
        if (country.currencies) {
            const currencyKey = Object.keys(country.currencies)[0];
            const currencyName = country.currencies[currencyKey].name;
            const currencySymbol = country.currencies[currencyKey].symbol || "";
            currencyTxt.textContent = `${currencyName} (${currencySymbol})`;
        } else {
            currencyTxt.textContent = "N/A";
        }

        // Ekstrè Lang
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