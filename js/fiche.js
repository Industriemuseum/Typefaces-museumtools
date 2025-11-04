let currentIndex = 0;
let data = [];

async function loadData() {
    try {
        const response = await fetch('assets/types.json');
        data = await response.json();

        // Haal geselecteerde filters op
        const selectedFilters = JSON.parse(localStorage.getItem('selectedFilters')) || [];
        const selectedObjectnummer = localStorage.getItem('selectedItemObjectnummer');

        // Filter data op basis van geselecteerde filters
        if (selectedFilters.length > 0) {
            data = data.filter(item => selectedFilters.includes(item.titel.toLowerCase()));
        }

        displayData(data);

        // Zoek geselecteerde item
        if (selectedObjectnummer) {
            const foundIndex = data.findIndex(item => item.objectnummer === selectedObjectnummer);
            if (foundIndex !== -1) {
                currentIndex = foundIndex;
                showSection(currentIndex);
            }
        }
    } catch (error) {
        console.error('Er is een fout opgetreden:', error);
    }
}

function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    data.forEach(fiche => {
        const ficheSection = document.createElement('section');
        ficheSection.className = 'fiche';
        ficheSection.dataset.objectnummer = fiche.objectnummer;
        ficheSection.style.display = 'none';

        ficheSection.innerHTML = `
                    <div class="type">
                        <h4>Type</h4> 
                        <h2>${fiche.titel}</h2>
                    </div>
                    <div class="objectnummer">
                        <h4>Objectnummer</h4>
                        <h2>${fiche.objectnummer}</h2>
                    </div>
                    <div class="corps">
                        <h4>Corps in cicero</h4>
                        <h2>${fiche.corps}</h2>
                    </div>
                    <div class="aantal"> 
                        <h4>Aantal karakters</h4>
                        <h2>${fiche.aantal}</h2>
                    </div>
                    <div class="hoogte"> 
                        <h4>Letterhoogte</h4>
                        <h2>${fiche.letterhoogte}</h2>        
                    </div>
                    <div class="beschrijving">    
                        <h4>Beschrijving</h4>
                        <div class="box">
                            <p>${fiche.beschrijving}</p>
                        </div>
                    </div>
                    <div class="images x-scroll"></div>
                `;

        container.appendChild(ficheSection);
        displayImages(fiche, ficheSection.querySelector('.images'));
    });

    document.querySelector('.prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + data.length) % data.length;
        showSection(currentIndex);
    });

    document.querySelector('.next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % data.length;
        showSection(currentIndex);
    });
}

function showSection(index) {
    const sections = document.querySelectorAll('#data-container .fiche');
    sections.forEach((section, i) => {
        section.style.display = i === index ? 'grid' : 'none';
    });
}

function displayImages(fiche, imagesContainer) {
    ['img_proef', 'img_proef-1', 'img_proef-2', 'img_0', 'img_1', 'img_2', 'img_3', 'img_4', 'img_5', 'img_6', 'img_7']
        .forEach(key => {
            const imgSrc = `assets/img-collectie/${fiche[key]}`;
            if (imgSrc && imgSrc !== 'assets/img-collectie/undefined') {
                const img = new Image();

                // Error handling om broken images te verwijderen
                img.onerror = () => {
                    img.remove();
                };
                img.src = imgSrc;
                img.loading = 'lazy';
                img.alt = key;
                imagesContainer.appendChild(img);
            }
        });
}

window.addEventListener('DOMContentLoaded', loadData);