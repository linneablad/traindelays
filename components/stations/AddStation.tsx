import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import { Base, Typography, Forms } from '../../styles';
import authModel from '../../models/auth.ts';

export default function AddStation({route, stationsDelayed, savedStations, setSavedStations}) {
    const [tableOfStations, setTableOfStations] = useState([]);
    const [searchWord, setSearchWord] = useState("");
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (searchWord !== "") {
            setTableOfStations(createTableOfStations());
        }
    },[savedStations]);

    function createTableOfStations() {
        const table = stationsDelayed
            .filter(station => station.name.toLowerCase().startsWith(searchWord.trim().toLowerCase()))
            .filter(station => {
                for (let i = 0; i < savedStations.length; i++) {
                    if (station.name === savedStations[i].artefact) {
                        return;
                    }
                }
                return station;
            })
            .map((station, index) => {
                return (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{station.name}</DataTable.Cell>
                      <DataTable.Cell><Button
                          title="Spara"
                          color="green"
                          onPress={() => {
                              saveStation(station);
                          }}
                      /></DataTable.Cell>
                    </DataTable.Row>
                );
            })
        return table;
    }

    async function saveStation(station:Object) {
        const result = await authModel.saveUserData(station.name);
        showMessage({
            message: result.title,
            description: result.message,
            type: result.type,
            statusBarHeight: 20,
        });

        setSavedStations(await authModel.getUserData());
        setSearched(false);
    }

    return (
        <ScrollView style={Base.base}>
            <Text style={[Typography.label, Base.marginTop]}>Sök efter station</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(searchWord: string) => {
                    setSearchWord(searchWord);
                }}
                testID="search-field"
                accessibilityLabel="Tryck för att söka"
            />
            <View style={Base.marginBottom}><Button
                title="Sök"
                onPress={() => {
                    if (searchWord !== "") {
                        setTableOfStations(createTableOfStations);
                        setSearched(true);
                    }
                }}
            /></View>
            <DataTable>
                {tableOfStations.length === 0 && searched === true ? <Text style={Typography.normal}>Inga stationer hittades, prova att söka på något annat</Text> : tableOfStations }
            </DataTable>
            <StatusBar style="auto" />
        </ScrollView>
      );

};
