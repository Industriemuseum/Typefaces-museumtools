async function loadData() {
    try {
        const response = await fetch('assets/types.json');
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Er is een fout opgetreden:', error);
    }
}

function displayData(data) {
    const container = document.getElementById('proef-container');
    container.innerHTML = '';

    data.forEach(item => {
        const itemSection = document.createElement('div');
        itemSection.className = 'item';
        itemSection.dataset.titel = item.titel.toLowerCase();
        itemSection.dataset.objectnummer = item.objectnummer;

        itemSection.innerHTML = `
                    <div class="type">
                        <h2>${item.titel}</h2>
                        <div class="images"></div>
                    </div>
                `;

        container.appendChild(itemSection);
        displayImages(item, itemSection.querySelector('.images'));

        itemSection.addEventListener('click', () => {
            localStorage.setItem('selectedItemObjectnummer', item.objectnummer);

            // Geselecteerde filters opslaan
            const activeFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
                .map(cb => cb.value.toLowerCase());
            localStorage.setItem('selectedFilters', JSON.stringify(activeFilters));

            window.location.href = 'letter-fiche.html';
        });
    });

    setupFilters(data);
}

function setupFilters(data) {
    const filter = document.getElementById('filter-list');
    filter.innerHTML = '';

    const seen = new Map();
    data.forEach(item => {
        const lc = item.titel.trim().toLowerCase();
        if (!seen.has(lc)) seen.set(lc, item.titel.trim());
    });

    [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1], 'nl'))
        .forEach(([lcTitel, origineleTitel]) => {
            const label = document.createElement('label');
            label.className = 'filter-type';
            label.classList.add('custom-checkbox');
            label.innerHTML = `
                        <input type="checkbox" class="filter-checkbox" value="${lcTitel}">
                        <span class="checkmark"></span>
                        ${origineleTitel}
                    `;
            filter.appendChild(label);
        });

    filter.addEventListener('change', () => {
        const checkedValues = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
            .map(cb => cb.value);
        filterItemsByTitles(checkedValues);
    });
}

function filterItemsByTitles(selectedTitles) {
    const items = document.querySelectorAll('#proef-container .item');
    items.forEach(item => {
        // Als er geen geselecteerde titels zijn, toon dan alle items
        item.style.display = selectedTitles.length === 0 || selectedTitles.includes(item.dataset.titel) ? 'block' : 'none';
    });
}

function displayImages(item, imagesContainer) {
    ['img_proef_thumb', 'img_proef-1_thumb'].forEach(key => {
        const imgSrc = `assets/img-collectie/${item[key]}`;
        if (imgSrc && imgSrc !== 'assets/img-collectie/undefined') {
            const img = new Image();
            img.src = imgSrc;
            img.loading = 'eager'; 
            img.setAttribute('fetchpriority', 'high'); 
            img.alt = key;

            // Error handling om broken images te verwijderen
            img.onerror = () => {
                img.remove();
            };

            imagesContainer.appendChild(img);
        }
    });
} 

window.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Voeg event listener voor filterknop toe
    const selectAllButton = document.querySelector('#filter-container button');

    selectAllButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.filter-checkbox');

        checkboxes.forEach(checkbox => checkbox.checked = false);

        // Toon alle items door filterfunctie aan te roepen met lege array
        filterItemsByTitles([]); // Geen geselecteerde titels, dus toon alles

        document.querySelector('#proef-wrapper').scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});

// Toggle filter voor mobiel

document.querySelector('.filter-toggle').addEventListener('click', function () {
    const container = document.querySelector('#collection-container');
    const button = this;

    container.classList.toggle('filters-hidden');

    if (container.classList.contains('filters-hidden')) {
        button.textContent = 'Filter op type';
    } else {
        button.textContent = 'Verberg Filter';
    }
});
