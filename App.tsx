import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FlashMessage from "react-native-flash-message";
import { useState, useEffect } from 'react';

import { Base } from './styles';
import Map from './components/Map.tsx'
import Auth from './components/auth/Auth.tsx'
import Stations from './components/stations/Stations.tsx'
import stationsDelayedModel from './models/stationsDelayed';
import authModel from './models/auth';

const Tab = createBottomTabNavigator();
const routeIcons = {
  "Karta": "map",
  "Mina stationer": "heart"
};

export default function App() {
    const [stationsDelayed, setStationsDelayed] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
    const [savedStations, setSavedStations] = useState([]);

    useEffect(async () => {
        let interval;
        const fetchData = async () => {
            setStationsDelayed(await stationsDelayedModel.getStationsDelayed());
        }
        fetchData();
        interval = setInterval(() => {
            fetchData(); //Fetch data every 5 min
        }, 1000 * 60 * 5)
        return () => {
            clearInterval(interval);
        }
    }, []);

    useEffect(async () => {
      setIsLoggedIn(await authModel.loggedIn());
    }, []);

    useEffect(async () => {
      if (isLoggedIn === true) {
          setSavedStations(await authModel.getUserData());
      }
  }, [isLoggedIn]);


  return (
    <SafeAreaView style={Base.container}>
        <NavigationContainer>
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName = routeIcons[route.name] || "alert";
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                })}
            >
                <Tab.Screen name="Karta">
                    {()=> <Map stationsDelayed={stationsDelayed}/>}
                </Tab.Screen>
                {isLoggedIn ?
                    <Tab.Screen name="Mina stationer">
                      {() => <Stations setIsLoggedIn={setIsLoggedIn} stationsDelayed={stationsDelayed} savedStations={savedStations} setSavedStations={setSavedStations}/>}
                    </Tab.Screen>
                    :
                  <Tab.Screen name="Mina stationer">
                    {() => <Auth setIsLoggedIn={setIsLoggedIn} />}
                  </Tab.Screen>
                }
            </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
        <FlashMessage position="top" />
    </SafeAreaView>
  );
}
