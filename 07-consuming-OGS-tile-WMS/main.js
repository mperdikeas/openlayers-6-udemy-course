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
            (()=>{
                // NOAA WMS layer (lightnings)
                const url = 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_emulated_imagery_lightningstrikedensity_goes_time/MapServer/WMSServer?';

                return new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url,
                        params: {
                            LAYERS: 1,
                            FORMAT: 'image/png',
                            TRANSPARENT: true
                        }
                    })
                });
            })(),
            (()=>{
                // NOOAA WMS meteo imagery
                const url = 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_time/MapServer/WMSServer?';
                return new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url,
                        params: {
                            LAYERS: 1,
                            FORMAT: 'image/png',
                            TRANSPARENT: true
                        }
                    }),
                    opacity: 0.5
                });
            })(),
            (()=>{
                // NOOA WMS precipitation
                const url = 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/analysis_meteohydro_sfc_rtma_time/MapServer/WMSServer?';
                return new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url,
                        params: {
                            LAYERS: 1,
                            FORMAT: 'image/png',
                            TRANSPARENT: true
                        }
                    }),
                    opacity: 0.5
                });
            })()
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
