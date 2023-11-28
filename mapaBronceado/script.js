let map = L.map('map').setView([-34.662, -58.365], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    ext: 'png'
}).addTo(map);

let geojson_url = "https://raw.githubusercontent.com/jonarobin/map/main/geojson/bronceado.geojson";

let markersLayer;
let allCategories = [];

fetch(geojsonUrl)
    .then(res => res.json())
    .then(data => {
        markersLayer = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                allCategories = allCategories.concat(feature.properties.Rubro);

                return L.marker(latlng, {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `<div class="marker-content"><img class="marker-image" src="${feature.properties.Foto}" alt="${feature.properties.Nombre}" /></div>`,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                    })
                });
            },
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    // Abre la URL en la misma pestaña desde el iframe
                    window.open(feature.properties['URL Store'], '_top');
                });
            }
        });

        markersLayer.addTo(map);

        map.fitBounds(markersLayer.getBounds());
    });

let searchInput = document.getElementById('searchInput');
const geocoder = L.Control.Geocoder.nominatim({
    geocodingQueryParams: {
        viewbox: '-58.5664,-34.7059,-58.3413,-34.5283',
        bounded: 1,
        countrycodes: 'AR',
        limit: 5,
    },
});

searchInput.addEventListener('input', function () {
    let searchText = searchInput.value;
    if (searchText) {
        geocoder.geocode(searchText, function (results) {
            if (results.length > 0) {
                let latlng = results[0].center;
                map.setView(latlng, 15);
            }
        });
    }
});

let categoriaDropdown = document.getElementById('categoriaDropdown');
categoriaDropdown.addEventListener('change', function () {
    let selectedCategoria = categoriaDropdown.value;

    markersLayer.eachLayer(function (layer) {
        layer._icon.classList.add('hidden');
    });

    markersLayer.eachLayer(function (layer) {
        let rubros = layer.feature.properties.Rubro;
        if (selectedCategoria === '' || rubros.includes(selectedCategoria)) {
            layer._icon.classList.remove('hidden');
        }
    });
});

let changeCategoryButton = document.getElementById('changeCategoryButton');
let currentCategoryIndex = 0;

changeCategoryButton.addEventListener('click', function () {
    currentCategoryIndex = (currentCategoryIndex + 1) % allCategories.length;
    let selectedCategoria = allCategories[currentCategoryIndex];

    markersLayer.eachLayer(function (layer) {
        layer._icon.classList.add('hidden');
    });

    markersLayer.eachLayer(function (layer) {
        let rubros = layer.feature.properties.Rubro;
        if (selectedCategoria === '' || rubros.includes(selectedCategoria)) {
            layer._icon.classList.remove('hidden');
        }
    });

    categoriaDropdown.value = selectedCategoria;
});
