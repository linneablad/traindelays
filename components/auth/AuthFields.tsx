import { View, Text, TextInput, Button } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Typography, Forms, Base } from '../../styles';

export default function AuthFields({ auth, setAuth, title, submit, navigation}) {

    function validateEmail(text: string) {
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!text.match(pattern)) {
            showMessage({
                message: "Icke giltig email",
                description: "Email måste uppfylla typ cccc@cc.cc",
                type: "warning",
                statusBarHeight: 20,
            });
        }
    }

    function validatePassword(text: string) {
        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!\.-]).{4,}$/
        if (!text.match(pattern)) {
            showMessage({
                message: "Icke giltigt lösenord",
                description: "Lösenordet måste innehålla minst 4 tecken, små och stora bokstäver, siffror och specialtecken",
                type: "warning",
                statusBarHeight: 20,
            });
        }
    }

    return (
        <View style={Base.base}>
            <Text style={Typography.header2}>{title}</Text>
            <Text style={Typography.label}>E-post</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    if (title === "Registrera") {
                        validateEmail(content);
                    }
                    setAuth({ ...auth, email: content })

                }}
                value={auth?.email}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="email-field"
            />
            <Text style={Typography.label}>Lösenord</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    if (title === "Registrera") {
                        validatePassword(content);
                    }
                    setAuth({ ...auth, password: content })

                }}
                value={auth?.password}
                secureTextEntry={true}
                testID="password-field"
            />
            <View style={Base.marginBottom}><Button
                title={title}
                onPress={() => {
                    submit();
                }}
                accessibilityLabel={`${title} genom att trycka`}
            /></View>
            {title === "Logga in" &&
                <View style={Base.marginBottom}><Button
                    title="Registrera istället"
                    color='#6d6c6c'
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                /></View>
            }
        </View>
    );
};
