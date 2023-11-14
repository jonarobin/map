
let map = L.map('map');

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    ext: 'png'
}).addTo(map);


let geojson_url = "https://raw.githubusercontent.com/jonarobin/jonarobin.github.io/master/map%20(1).geojson";

fetch(geojson_url)
    .then(res => res.json())
    .then(data => {
        let geojsonlayer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
         
                let imgURL = feature.properties.img; // URL de la imagen
                let nombre = feature.properties.nombre; // Nombre de la propiedad
                   

                // Crea un marcador con la imagen redimensionada y enmascarada
                let marcador = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `<div class="marker-content"><img class="marker-image" src="${imgURL}" alt="${nombre}" /></div>`
                      
                      
                      
          })
                  
                }).addTo(map);

                // Abre el enlace al hacer clic en el marcador
                marcador.on('click', function() {
                    window.open(feature.properties.ig, '_blank'); // Abre el enlace en una nueva ventana o pestaña
                });
            }
        }).addTo(map);
        map.fitBounds(geojsonlayer.getBounds());
    });

// ... (tu código existente)

fetch(geojson_url)
    .then(res => res.json())
    .then(data => {
        let geojsonlayer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                // ... (tu código existente para crear los marcadores)

                // Filtra los marcadores según la categoría seleccionada en el dropdown de categorías
                let categoriaDropdown = document.getElementById('categoriaDropdown');
                categoriaDropdown.addEventListener('change', function() {
                    let selectedCategoria = categoriaDropdown.value;
                    if (selectedCategoria === '' || feature.properties.categoria === selectedCategoria) {
                        layer.addTo(map);
                    } else {
                        map.removeLayer(layer);
                    }
                });
            }
        }).addTo(map);
        map.fitBounds(geojsonlayer.getBounds());
    });

// ... (tu código existente para configurar el mapa y las capas)
// Obtiene el campo de entrada de texto y crea el control de búsqueda
let searchInput = document.getElementById('searchInput');
const geocoder = L.Control.Geocoder.nominatim({
    // Configuración del servicio de geocodificación (limitada a Capital Federal y Zona Norte)
    geocodingQueryParams: {
        viewbox: '-58.5664,-34.7059,-58.3413,-34.5283',
        bounded: 1,
        countrycodes: 'AR',
        limit: 5,
    },
});

// Escucha el evento de cambio en el campo de entrada de texto
searchInput.addEventListener('input', function () {
    let searchText = searchInput.value;
    if (searchText) {
        // Realiza la búsqueda y centra el mapa en la ubicación encontrada
        geocoder.geocode(searchText, function (results) {
            if (results.length > 0) {
                let latlng = results[0].center;
                map.setView(latlng, 15); // Centra el mapa en la ubicación encontrada sin agregar un marcador
            }
        });
    }
});
