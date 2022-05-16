import { showMessage } from "react-native-flash-message";
import { View, Button } from 'react-native';
import { Base, Typography } from '../../styles';
import authModel from '../../models/auth';

export default function Logout({setIsLoggedIn, setSavedStations}) {
    async function doLogout() {

            await authModel.logout();

            setIsLoggedIn(false);
            setSavedStations([]);

            showMessage({
                message: "Användaren har loggats ut",
                type: "success",
                statusBarHeight: 20,
            });
        }

    return (
        <View style={Base.marginBottom}><Button
            title="Logga ut"
            onPress={() => {
                doLogout();
            }}
        /></View>
    );
};
