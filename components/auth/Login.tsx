import Auth from '../../interfaces/auth';
import { useState } from 'react';
import { showMessage } from "react-native-flash-message";
import authModel from '../../models/auth';
import AuthFields from './AuthFields';

export default function Login({navigation, setIsLoggedIn}) {
    const [auth, setAuth] = useState<Partial<Auth>>({});

    async function doLogin() {
        if (auth.email && auth.password) {
            const result = await authModel.login(auth.email, auth.password);

            if (result.type === "success") {
               setIsLoggedIn(true);
           }

           showMessage({
               message: result.title,
               description: result.message,
               type: result.type,
               statusBarHeight: 20,
           });
        } else {
            showMessage({
                message: "Saknas",
                description: "E-post eller lösenord saknas",
                type: "warning",
                statusBarHeight: 20,
            });
        }
    }

    return (
        <AuthFields
            auth={auth}
            setAuth={setAuth}
            submit={doLogin}
            title="Logga in"
            navigation={navigation}
        />
    );
};
