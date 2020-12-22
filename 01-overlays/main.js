window.onload = init;

function init() {

    const map = new ol.Map({
        view: new ol.View({
            center: [0, 0],
            zoom: 2,
            rotation: 0.5
        })
        , layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })]
        , target: 'the-map'
    });


    const popupContainerElement = document.getElementById('coordinates');

    const centerElement = document.getElementById('zero-zero');

    const popup = new ol.Overlay({
        element: popupContainerElement
    });

    const center = new ol.Overlay({
        element: centerElement
    });    

    map.addOverlay(popup);
    map.addOverlay(center);

    map.on('click', function(e) {
        const coordinates = e.coordinate;
        console.log(`coordinates are: ${coordinates}`);
        popup.setPosition(coordinates);
        popupContainerElement.innerHTML = coordinates;
        center.setPosition([0,0]);
        window.setTimeout(()=>{
            center.setPosition(undefined);
        }, 1000);
        window.setTimeout(()=>{
            popup.setPosition(undefined);
        }, 3000);
        
    });
}
