import { Text, View, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect, useRef } from 'react';
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { Base, Typography } from "../styles";

export default function Map({ route, stationsDelayed }) {
    const [locationMarker, setLocationMarker] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [markerInfo, setMarkerInfo] = useState(Object);
    const [stationsMarkers, setStationsMarkers] = useState([]);
    const map = useRef(null);

    useEffect(async () => {
        setStationsMarkers(stationsDelayed
            .filter(station => station.delayed_trains.length > 0)
            .map((station, index) => {
                let delayedTrains = [];
                for (delayed_train of station.delayed_trains) {
                    delayedTrains.push(`${delayed_train.delayed_time} försening för tåg ${delayed_train.identity}`);
                }
                return <Marker
                    key={index}
                    identifier={index.toString()}
                    coordinate={{ latitude: station.latitude,
                        longitude: station.longitude}}
                    title={station.name}
                    description={delayedTrains.join("-")}
                    pinColor="red"
                    onPress={ () => setMarkerInfo({
                        title: station.name,
                        description: delayedTrains.join("\n"),
                    })}
                />
            }))
    }, [stationsDelayed]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});

            setLocationMarker(<Marker
                coordinate={{
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                }}
                title="Min plats"
                pinColor="blue"
            />);
        })();
    }, []);

    function fitMarkers() {
        if (map?.current) {
          const markerIDs = stationsMarkers.map((marker) => marker.props.identifier);
          map.current.fitToSuppliedMarkers(markerIDs, true);
        }
      }

    return (
        <View style={Base.base}>
            <View style={Base.centerHorisontal}>
                <Text style={Typography.header1}>Tågförseningar</Text>
            </View>
            <Text style={Typography.header3}>{markerInfo.title}</Text>
            <Text style={Typography.normal}>{markerInfo.description}</Text>
            <View style={Base.mapContainer}>
                <MapView
                    ref={map}
                    key={stationsMarkers.length}
                    onMapReady={fitMarkers}
                    onMapLoaded={fitMarkers}
                    style={Base.map}
                    initialRegion={{
                        latitude: 57.6749712,
                        longitude: 14.5208584,
                        latitudeDelta: 3,
                        longitudeDelta: 3,
                    }} >
                    {stationsMarkers}
                    {locationMarker}
                </MapView>
            </View>
        </View>
    );
};
