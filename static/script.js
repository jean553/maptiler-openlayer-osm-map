const NOMINATIM_URL = "http://localhost:8001";
const API_URL = "http://localhost:8000";

/**
 * Draws the map into the map area on page.
 *
 * @param {number} latitude the default coordinates latitude
 * @param {number} longitude the default coordinates longitude
 */
function initialize_map(
    latitude,
    longitude
) {

    /* selection marker initialization */

    var selectorMarker = new ol.Feature({
        geometry: new ol.geom.Point([longitude, latitude])
    });

    var selectorStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
        })
    });

    selectorMarker.setStyle(selectorStyle);

    var selectorVector = new ol.source.Vector({
        features: [selectorMarker]
    });

    var vectorLayer = new ol.layer.Vector({
        source: selectorVector
    });

    /* polygons creation initialization */

    var drawPolygonsVector = new ol.source.Vector({wrapX: false});
    var drawPolygonsLayer = new ol.layer.Vector({source: drawPolygonsVector});

    var drawInteraction = new ol.interaction.Draw({
        source: drawPolygonsVector,
        type: 'Polygon'
    });

    /* map area initialization */

    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    attributions: 'Tiles © USGS, rendered with ' +
                        '<a href="http://www.maptiler.com/">MapTiler</a>',
                    url: API_URL + '/tiles/{z}/{x}/{y}',
                })
            }),
            vectorLayer,
            drawPolygonsLayer
        ],
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [longitude, latitude],
            zoom: 16
        })
    });

    map.addInteraction(drawInteraction);

    /* update the selection marker position
       when the map is manually updated */

    map.on(
        'moveend',
        function(evt) {

            var position = map.getView().getCenter();
            selectorMarker.setGeometry(new ol.geom.Point([
                position[0],
                position[1]
            ]));

            var geocodeReq = new XMLHttpRequest();
            geocodeReq.open(
                'GET',
                NOMINATIM_URL +
                    '/reverse?lat=' +
                    position[1] +
                    '&lon=' +
                    position[0] +
                    '&format=json',
                true
            );
            geocodeReq.send();
            geocodeReq.onreadystatechange = function processRequest(evt) {

                if (geocodeReq.readyState != 4 || geocodeReq.status != 200) {
                    return;
                }

                var area = document.getElementById("current");
                var response = JSON.parse(geocodeReq.responseText);

                area.innerHTML = response["display_name"];
            }

            var insidePolygonReq = new XMLHttpRequest();
            insidePolygonReq.open(
                'GET',
                API_URL + '/is-inside-polygon/paris/' +
                    position[1] + '/' +
                    position[0],
                true
            );
            insidePolygonReq.send();
            insidePolygonReq.onreadystatechange = function processRequest(evt) {

                if (insidePolygonReq.readyState != 4 || insidePolygonReq.status != 200) {
                    return;
                }

                var area = document.getElementById("inside-polygon");
                area.innerHTML = JSON.parse(insidePolygonReq.responseText);
            }
        }
    );

    /* define a callback when a polygon has been drawn;
       list all the polygon points coordinates */

    drawPolygonsVector.on(
        "addfeature",
        function(evt) {

            var features = drawPolygonsLayer.getSource().getFeatures();

            /* get the first features array item,
               we only list coordinates of the first polygon */
            var coordinates = features[0].getGeometry().getCoordinates()[0];
            var list = document.getElementById("coordinates");

            list.innerHTML = "";

            coordinates.forEach(function(coordinate) {
                list.innerHTML +=
                    "<p>" +
                    coordinate[0] +
                    " ; " +
                    coordinate[1] +
                    "</p>";
            });
        }
    );

    /* requests a city polygon from OpenStreetMap polygon file
       (source: http://polygons.openstreetmap.fr) */

    var xhr = new XMLHttpRequest();
    xhr.open('GET', API_URL + '/polygon/paris', true);
    xhr.send();
    xhr.onreadystatechange = function processRequest(evt) {

        if (xhr.readyState != 4 || xhr.status != 200) {
            return;
        }

        var response = JSON.parse(xhr.responseText);

        var polygonCoordinates = [];

        for (var index in response) {
            var coordinate = response[index].split(';');
            polygonCoordinates.push(
                ol.proj.transform(
                    [
                        parseFloat(coordinate[0]),
                        parseFloat(coordinate[1])
                    ],
                    'EPSG:4326',
                    'EPSG:4326'
                )
            );
        }

        var polygonFeature = new ol.Feature({
            geometry: new ol.geom.Polygon([polygonCoordinates])
        });

        var polygonLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [polygonFeature]
            })
        });

        map.addLayer(polygonLayer);
    };
}

/**
 * search locations through Nominatim according to the given search text
 */
function searchLocation() {

    var search = document.getElementById("location").value;
    var xhr = new XMLHttpRequest();

    /* TODO: check if those additional parameters are really necessary,
       check if JSON can be used instead */
    xhr.open(
        'GET',
        NOMINATIM_URL + '/search?q=' + search + '&format=json',
        true
    );
    xhr.send();
    xhr.onreadystatechange = function processRequest(evt) {
        var places = JSON.parse(xhr.responseText);
        var area = document.getElementById("locations");

        area.innerHTML = "";

        places.forEach(function(place) {

            area.innerHTML +=
                "<p>" +
                    place["display_name"] + " " +
                    place["lat"] + " " +
                    place["lon"] +
                "</p>";
        });
    };
}

const DEFAULT_LATITUDE = 48.8566;
const DEFAULT_LONGITUDE = 2.3522;

if ('geolocation' in navigator) {

    navigator.geolocation.getCurrentPosition(
        function(position) {
            initialize_map(
                position.coords.latitude,
                position.coords.longitude
            );
        },
        function() {
            initialize_map(
                DEFAULT_LATITUDE,
                DEFAULT_LONGITUDE
            );
        }
    );
} else {
    initialize_map(
        DEFAULT_LATITUDE,
        DEFAULT_LONGITUDE
    );
}

/* click on "Search" button triggers the geocoding research */

document.getElementById("search").onclick = function() {
    searchLocation();
};
