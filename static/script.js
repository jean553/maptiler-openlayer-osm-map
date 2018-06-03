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
        ],
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [longitude, latitude],
            zoom: 16
        })
    });
}

if ("geolocation" in navigator) {

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
