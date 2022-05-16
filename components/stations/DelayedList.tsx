import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import { Base, Typography, Table } from '../../styles';
import Logout from '../../components/auth/Logout.tsx'
import authModel from '../../models/auth.ts';

export default function DelayedList({route, navigation, setIsLoggedIn, stationsDelayed, savedStations, setSavedStations}) {
    const [tableOfDelayed, setTableOfDelayed] = useState([]);

    useEffect(async () => {
        setTableOfDelayed(stationsDelayed
            .filter(station => {
                for (let i = 0; i < savedStations.length; i++) {
                    if (station.name === savedStations[i].artefact && station.delayed_trains.length > 0) {
                        return station;
                    }
                }
            })
            .map((station) => {
                let delayed = []
                for (let index = 0; index < station.delayed_trains.length; index++) {
                    delayed.push(
                        <DataTable.Row key={index}>
                          <DataTable.Cell><Text style={Typography.lineThrough}>{station.delayed_trains[index].advertised_time}</Text> {station.delayed_trains[index].estimated_time}</DataTable.Cell>
                          <DataTable.Cell style={Table.widerCell}>{station.name}</DataTable.Cell>
                          <DataTable.Cell>{station.delayed_trains[index].identity}</DataTable.Cell>
                        </DataTable.Row>
                    );
                }
                return delayed;
            }));
    }, [savedStations, stationsDelayed]);

    return (
        <ScrollView style={Base.base}>
            <View style={Base.centerHorisontal}>
                <Text style={Typography.header1}>Mina stationer</Text>
            </View>
            <Button
                title="Hantera stationer"
                onPress={() => {
                    navigation.navigate('ManageStations');
                }}
            />
            <DataTable>
                <DataTable.Header >
                    <DataTable.Title>Avgångstid</DataTable.Title>
                    <DataTable.Title style={Table.widerCell}>Station</DataTable.Title>
                    <DataTable.Title>Tåg</DataTable.Title>
                </DataTable.Header>
                {tableOfDelayed.length > 0 ? tableOfDelayed : <Text style={Typography.normal}>Det finns inga förseningar att visa</Text>}
            </DataTable>
            <Logout setIsLoggedIn={setIsLoggedIn} setSavedStations={setSavedStations}/>
            <StatusBar style="auto" />
        </ScrollView>
      );

};
