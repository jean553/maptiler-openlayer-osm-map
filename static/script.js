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
                    url: 'http://0.0.0.0:8080/tiles/{z}/{x}/{y}',
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
        }
    );

    drawPolygonsVector.on(
        "addfeature",
        function(evt) {

            var features = drawPolygonsLayer.getSource().getFeatures();

            /* get the first features array item, we only list coordinates of the first polygon */
            var coordinates = features[0].getGeometry().getCoordinates()[0];
            var list = document.getElementById("coordinates");

            list.innerHTML = "";

            coordinates.forEach(function(coordinate) {
                list.innerHTML += "<p>" + coordinate[0] + " ; " + coordinate[1] + "</p>";
            });
        }
    );
}

if ('geolocation' in navigator) {

    navigator.geolocation.getCurrentPosition(
        function(position) {
            initialize_map(
                position.coords.latitude,
                position.coords.longitude
            );
        },
        function() {
            initialize_map(0, 0);
        }
    );
} else {
    initialize_map(0, 0);
}
