import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import NarudzbeScreen from './app/screens/NarudzbeScreen';
import KorisnikScreen from './app/screens/KorisnikScreen';
import LoggingScreen from './app/screens/LoggingScreen'

export function KS2() {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = "ios-home";

                    if(route.name === 'Korisnik') {
                    }
                    else if (route.name === 'Narudzbe') {
                        iconName = 'ios-list';
                    } else if (route.name === 'Logging') {
                        iconName = 'ios-albums';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                

            })}>
            <Tab.Screen name="Korisnik" component={KorisnikScreen} />
            <Tab.Screen name="Narudzbe" component={NarudzbeScreen} />
            <Tab.Screen name="Logging" component={LoggingScreen} />
        </Tab.Navigator>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});