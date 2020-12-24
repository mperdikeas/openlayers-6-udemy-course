window.onload = init;

let addLayerGroup = true;

function init() {

    const view = new ol.View({
            center: [0, 0],
            zoom: 2,
            rotation: 0.05
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
            }),
            // Bing Maps Basemap Layer
            new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    key: 'AuQ2WY-okEXSFZefpGB-z6EYYueLpLxGWstpR7xqfrFQZ0K9Ojss9_Hnj_NMvLnU',
                    imagerySet: 'AerialWithLabelsOnDemand'
                })
                , zIndex: 2
                , opacity: 0.8
                , extent: [1014266.5963644381,3960849.2921985723, 4278408.693842598,6036663.160640905]
            }),
            (()=>{
                // CartoDB base layer
                const style = 'rastertiles/voyager_labels_under';
                const scale = '@2x';
                return new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: `https://{a-d}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{scale}.png`
                    })
                    , extent: [-1657995.2205450558, 1778391.2389463931, 5290999.002317872, 4229197.619433608]
                    , opacity: 0.7
                    , visible: true
                });
            })(),
            (()=>{
                // tile debug
                return new ol.layer.Tile({
                    source: new ol.source.TileDebug()
                    , opacity: 0.5
                });
            })(),
            // Stamen layers, method 1 of 2
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
                })
                , opacity: 0.8
                , extent: [4387581.219422519, 4161833.1451840755
                           , 9698443.261144815,9814975.276913421]
            }),
            // Stamen layers, method 2 of 2
            new ol.layer.Tile({
                source: new ol.source.Stamen({
                    layer: 'toner'
                })
                , opacity: 0.8
                , extent: [1387581, 1161833, 5698443, 4814975]
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
