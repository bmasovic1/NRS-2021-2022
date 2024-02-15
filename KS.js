import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoggingScreen from './app/screens/LoggingScreen'
import AdminScreen from './app/screens/AdminScreen';
import ListaKorisnikaScreen from './app/screens/ListaKorisnikaScreen';

export function KS() {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                contentStyle:{backgroundColor: 'transparent'},headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = "ios-home";

                    if(route.name === 'Admin') {
                    }
                    else if (route.name === 'Lista Korisnika') {
                        iconName = 'ios-list';
                    } else if (route.name === 'Logging') {
                        iconName = 'ios-albums';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                

            })}>
            <Tab.Screen name="Admin" component={AdminScreen} />
            <Tab.Screen name="Lista Korisnika" component={ListaKorisnikaScreen} />
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