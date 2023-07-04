import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibmFtMTk5NyIsImEiOiJjbGlidmZtcHEwN2h3M2RxZjRyOGdtbzg3In0.XgbGG7p80a5rKbsj38MXTA';

const Map = ({address}) => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [coordinates, setCoordinates] = useState(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const initializeMap = () => {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [105.8372, 21.0278],
                zoom: 14,
                attributionControl: false,
            });
            setMapInitialized(true);
            setCoordinates(null);
            mapInstance.on('load', () => {
                const navControl = new mapboxgl.NavigationControl();
                const geolocateControl = new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: false,
                    },
                    trackUserLocation: true,
                });
                mapInstance.addControl(navControl, 'top-right');
                mapInstance.addControl(geolocateControl, 'top-right');
            });

            setMap(mapInstance);
        };

        if (!mapInitialized) {
            initializeMap();
        }

        return () => {
            if (mapInitialized) {
                map.remove();
            }
        };
    }, []);

    const addMarker = (lngLat) => {
        if (markerRef.current) {
            markerRef.current.remove();
        }

        const newMarker = new mapboxgl.Marker()
            .setLngLat(lngLat)
            .addTo(map)
            .setPopup(
                new mapboxgl.Popup().setHTML(`<p>${address}</p><p>Vĩ độ: ${lngLat[1]}</p><p>Kinh độ: ${lngLat[0]}</p>`)
            );

        markerRef.current = newMarker;
    };

    useEffect(() => {
        const handleAddressChange = async () => {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        address
                    )}.json?access_token=${mapboxgl.accessToken}`
                );

                if (!response.ok) {
                    throw new Error('Error searching for address');
                }

                const data = await response.json();

                if (data.features.length > 0) {
                    const coordinates = data.features[0].center;
                    setCoordinates(coordinates);

                    if (map) {
                        map.flyTo({center: coordinates, zoom: 14});
                        addMarker(coordinates);
                    }
                } else {
                    setCoordinates(null);
                    console.log('No results found');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        handleAddressChange();
    }, [address, map]);

    useEffect
    (() => {
        if (map && coordinates) {
            map.flyTo({center: coordinates, zoom: 14});
            addMarker(coordinates);
        }
    }, [map, coordinates]);
    return (
        <div>
            {coordinates ? (
                <div>
                    Địa chỉ: {address}
                </div>
            ) : (
                <div style={{color: 'red'}}>
                    Địa chỉ không hợp lệ!
                </div>
            )}
            <div
                ref={mapContainerRef}
                style={{
                    width: '1109px',
                    height: '400px',
                }}
            />
        </div>
    );
};

export default Map;