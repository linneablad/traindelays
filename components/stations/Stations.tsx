import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DelayedList from './DelayedList';
import ManageStations from './ManageStations.tsx';
import AddStation from './AddStation.tsx';

const Stack = createNativeStackNavigator();

export default function Stations(props) {
    return (
        <Stack.Navigator initialRouteName="DelayedList">
            <Stack.Screen name="DelayedList" options={{title: 'Förseningar',}}>
                {(screenProps) => <DelayedList {...screenProps} setIsLoggedIn={props.setIsLoggedIn} stationsDelayed={props.stationsDelayed} savedStations={props.savedStations} setSavedStations={props.setSavedStations}/>}
            </Stack.Screen>
            <Stack.Screen name="ManageStations" options={{title: 'Hantera stationer',}}>
                {(screenProps) => <ManageStations {...screenProps} savedStations={props.savedStations} setSavedStations={props.setSavedStations}/>}
            </Stack.Screen>
            <Stack.Screen name="AddStation" options={{title: 'Spara station',}}>
                {(screenProps) => <AddStation {...screenProps} stationsDelayed={props.stationsDelayed} savedStations={props.savedStations} setSavedStations={props.setSavedStations}/>}
            </Stack.Screen>
        </Stack.Navigator>
    );
};
