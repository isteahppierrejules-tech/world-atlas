// 3. Injection des données (Sekirize ak textContent pou evite XSS)
    function displayCountry(country) {
        nameTxt.textContent = country.name?.common || "N/A";
        capitalTxt.textContent = country.capital ? country.capital[0] : "N/A";
        
        // Fòma popilasyon ak espas (ex: 11 500 000)
        const population = country.population;
        popTxt.textContent = population ? population.toLocaleString('fr-FR') : "N/A";
        
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