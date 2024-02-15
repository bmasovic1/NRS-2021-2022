import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ListaProizvodaScreen from './app/screens/ListaProizvodaScreen';
import AdminSScreen from './app/screens/AdminSScreen';
import LoggingScreen from './app/screens/LoggingScreen'
import ListaPoslovnicaScreen from './app/screens/ListaPoslovnicaScreen'
import DostavaScreen from './app/screens/DostavaScreen'

export function KS3() {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = "ios-home";

                    if(route.name === 'AdminS') {
                    }
                    else if (route.name === 'ListaP') {
                        iconName = 'ios-list';
                    } else if (route.name === 'Logging') {
                        iconName = 'ios-albums';
                    }
                    else if (route.name === 'ListaPoslovnica') {
                        iconName = 'ios-list';
                    } 
                    else if (route.name === 'Dostava') {
                        iconName = 'ios-log-in';
                    } 
                    

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                

            })}>
            <Tab.Screen name="AdminS" component={AdminSScreen} />
            <Tab.Screen name="ListaP" component={ListaProizvodaScreen} />
            <Tab.Screen name="ListaPoslovnica" component={ListaPoslovnicaScreen} />
            <Tab.Screen name="Dostava" component={DostavaScreen} />
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