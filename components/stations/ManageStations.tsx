import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import { Base, Typography, Forms } from '../../styles';
import authModel from '../../models/auth.ts';

export default function ManageStations({route, navigation, savedStations, setSavedStations}) {
    const [tableOfStations, setTableOfStations] = useState([]);

    function createTableOfStations() {
        const table = savedStations
            .map((station) => {
                return (
                    <DataTable.Row key={station.id}>
                      <DataTable.Cell>{station.artefact}</DataTable.Cell>
                      <DataTable.Cell><Button
                          title="Radera"
                          color='red'
                          onPress={() => {
                              deleteStation(station);
                          }}
                          accessibilityLabel="Radera station"
                      /></DataTable.Cell>
                    </DataTable.Row>
                );
            })
        return table;
    }

    useEffect(() => {
        setTableOfStations(createTableOfStations());
    },[savedStations]);


    async function deleteStation(station:Object) {
        const result = await authModel.deleteUserData(station.id);

        showMessage({
            message: result.title,
            description: result.message,
            type: result.type,
            statusBarHeight: 20,
        });

        setSavedStations(await authModel.getUserData());
    }


    return (
        <ScrollView style={Base.base}>
            <View style={[Base.marginTop, Base.marginBottom]}><Button
                title="Spara stationer"
                onPress={() => {
                    navigation.navigate('AddStation');
                }}
                accessibilityLabel="Spara stationer"
            /></View>
            <DataTable>
                {tableOfStations.length > 0 ? tableOfStations : <Text style={Typography.normal}>Du har inte sparat några stationer</Text>}
            </DataTable>
            <StatusBar style="auto" />
        </ScrollView>
      );

};
