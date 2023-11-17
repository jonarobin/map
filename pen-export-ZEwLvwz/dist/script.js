let map = L.map('map');

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    ext: 'png'
}).addTo(map);

let geojson_url = "https://raw.githubusercontent.com/jonarobin/Map-demo/main/Demo%2016%20nov.geojson";

let markersLayer;
let allCategories = []; // Array que almacena todas las categorías
fetch(geojson_url)
    .then(res => res.json())
    .then(data => {
        markersLayer = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                allCategories = allCategories.concat(feature.properties.Rubro); // Agrega las categorías al array

                return L.marker(latlng, {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `<div class="marker-content"><img class="marker-image" src="${feature.properties.Foto}" alt="${feature.properties.Nombre}" /></div>`,
                        iconSize: [25, 41], // Tamaño del icono
                        iconAnchor: [12, 41], // Punto de anclaje del icono
                    })
                });
            },
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    window.open(feature.properties['URL Store'], '_blank');
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

    // Oculta todos los marcadores
    markersLayer.eachLayer(function (layer) {
        layer._icon.classList.add('hidden');
    });

    // Muestra solo los marcadores que cumplen con la categoría seleccionada
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

    // Oculta todos los marcadores
    markersLayer.eachLayer(function (layer) {
        layer._icon.classList.add('hidden');
    });

    // Muestra solo los marcadores que cumplen con la categoría seleccionada
    markersLayer.eachLayer(function (layer) {
        let rubros = layer.feature.properties.Rubro;
        if (selectedCategoria === '' || rubros.includes(selectedCategoria)) {
            layer._icon.classList.remove('hidden');
        }
    });

    // Actualiza el dropdown
    categoriaDropdown.value = selectedCategoria;
});


