import Auth from '../../interfaces/auth';
import { useState } from 'react';
import { showMessage } from "react-native-flash-message";
import authModel from '../../models/auth';
import AuthFields from './AuthFields';

export default function Register({navigation, setIsLoggedIn}) {
    const [auth, setAuth] = useState<Partial<Auth>>({});
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!\.-]).{4,}$/

    async function doRegister() {
        if (auth?.email?.match(emailPattern) && auth?.password?.match(passwordPattern)) {
            const result = await authModel.register(auth.email, auth.password);

            showMessage({
                message: result.title,
                description: result.message,
                type: result.type,
                statusBarHeight: 20,
            });

            if (result.type === "success") {
                navigation.navigate('Login');
            }

        } else {
            showMessage({
                message: "Icke giltig email eller lösenord",
                description: "Skriv in en giltig email och lösenord",
                type: "warning",
                statusBarHeight: 20,
            });
        }
    }

    return (
        <AuthFields
            auth={auth}
            setAuth={setAuth}
            submit={doRegister}
            title="Registrera"
            navigation={navigation}
        />
    );
};
