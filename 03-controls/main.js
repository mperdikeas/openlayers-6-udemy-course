window.onload = init;

function init() {

    const view = new ol.View({
            center: [0, 0],
            zoom: 2,
            rotation: 0.2
    });


    const layer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'watercolor',
        }),
    });


    const layer2 = new ol.layer.Tile({
        source: new ol.source.OSM()
    });


    const extraControls = [
        new ol.control.ScaleLine()
        , new ol.control.FullScreen({tipLabel: 'μεγιστοποίηση'})
        , new ol.control.MousePosition()
        , new ol.control.OverviewMap({
            collapsed: false,
            layers:[layer]
        })
        , new ol.control.ZoomSlider()
        , new ol.control.ZoomToExtent()
    ];

    const map = new ol.Map({
        view
        , layers: [layer2]
        , target: 'the-map'
        , keyboardEventTarget: document // to enable keyboard interactions
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

    const dragRotateInteraction = new ol.interaction.DragRotate({
        condition: ol.events.condition.altKeyOnly
    });




    const drawInteraction = new ol.interaction.Draw({
        type: 'Polygon',
        freehand: true
    });
    drawInteraction.on('drawend', e=>{
        let parser = new ol.format.GeoJSON();
        let drawnFeatures = parser.writeFeaturesObject([e.feature]);
        console.log(drawnFeatures.features[0].geometry.coordinates);
    });

    const description = document.getElementById('descr');

    const drawButton = document.getElementById('draw-btn');
    drawButton.addEventListener('click', e=>{
        map.removeInteraction(dragRotateInteraction);
        map.addInteraction(drawInteraction);
        document.body.style.cursor = 'crosshair';
        description.innerHTML = 'draw mode';
    });

    const rotateButton = document.getElementById('rotate-btn');
    rotateButton.addEventListener('click', e=>{
        map.removeInteraction(drawInteraction);
        map.addInteraction(dragRotateInteraction);
        document.body.style.cursor = 'pointer';
        description.innerHTML = 'rotation mode (press ALT to rotate)';
    });


    // adding non-default controls:
    // map.addControl(new ol.control.ScaleLine());
//    map.addControl(new ol.control.FullScreen());

}
