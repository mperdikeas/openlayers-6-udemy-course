window.onload = init;

let addLayerGroup = true;

function init() {

    const view = new ol.View({
            center: [0, 0],
            zoom: 2,
            rotation: 0.2
    });


    const layer = new ol.layer.Tile({
        source: new ol.source.OSM()
        , zIndex: 0
        , opacity: 1
    });


    const extraControls = [
        new ol.control.ScaleLine()
        , new ol.control.FullScreen({tipLabel: 'μεγιστοποίηση'})
        , new ol.control.MousePosition()
    ];

    const map = new ol.Map({
        view
        , layers: [layer]
        , target: 'the-map'
        , controls: ol.control.defaults().extend(extraControls)
    });


    const popupContainerElement = document.getElementById('coordinates');

    const centerElement = document.getElementById('zero-zero');

    const popup = new ol.Overlay({
        element: popupContainerElement,
        positioning: 'center-center'
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

    const layerGroup = new ol.layer.Group({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                    crossOrigin: null // https://stackoverflow.com/a/48354638/274677
                })
                , zIndex: 1
                , opacity: 0.5
                , extent: [-2044595.561406588, 3737315.904720001, 5052139.435672864,8658890.63953671]
            })
        ]});

    const button = document.getElementById('btn');
    button.addEventListener('click', (e)=>{
        if (addLayerGroup) {
            map.addLayer(layerGroup);
            button.innerHTML = 'remove layer group';
        } else {
            map.removeLayer(layerGroup);
            button.innerHTML = 'add layer group';
        }
        addLayerGroup = !addLayerGroup;
    });



}
