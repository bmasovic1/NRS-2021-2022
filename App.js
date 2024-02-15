import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KorisnikScreen from './app/screens/KorisnikScreen';
import AdminScreen from './app/screens/AdminScreen';
import LoginScreen from './app/screens/LoginScreen';
import SignUpScreen from './app/screens/SignupScreen';
import DodavanjeKorisnika from './app/screens/DodavanjeKorisnikaScreen';
import ListaKorisnikaScreen from './app/screens/ListaKorisnikaScreen';
import KorisnkEditScreen from './app/screens/KorisnikEditScreen';
import KorisnikSifra from './app/screens/KorisnikSifra';
import AdminSScreen from './app/screens/AdminSScreen';
import ListaProizvodaScreen from './app/screens/ListaProizvodaScreen';
import DodavanjePoslovnicaScreen from './app/screens/DodavanjePoslovnicaScreen';
import UvodjenjeProizvodaUPoslovniceScreen from './app/screens/UvodjenjeProizvodaUPoslovniceScreen';
import ProizvodEditScreen from './app/screens/ProizvodEditScreen';
import ListaPoslovnicaScreen from './app/screens/ListaPoslovnicaScreen'
import DodajProizvodSkladisteScreen from './app/screens/DodajProizvodSkladisteScreen';
import ListaProizvodaUPoslovniciScreen from "./app/screens/ListaProizvodaUPoslovniciScreen";
import DodavanjeNarudzbeScreen from './app/screens/DodavanjeNarudzbe'
import {Provider as AuthProvider} from './app/context/AuthContext';
import NarudzbeScreen from './app/screens/NarudzbeScreen'
import DodajProizvodeNarudzbaScreen from './app/screens/DodajProizvodeNarudzbaScreen';
import DodajDostavuScreen from './app/screens/DodajDostavuScreen';
import DostavaPrijem from './app/screens/DostavaPrijemScreen';
import { navigationRef } from './app/RootNavigation';
import ArtikliNarudzba from './app/screens/ArtikliNarudzba'
import ListaProizvodaUPoslovnici2Screen from "./app/screens/ListaProizvodaUPoslovnici2Screen";
import DodajArtikl from './app/screens/DodajArtikal'
import ArtiklEdit from './app/screens/ArtiklEdit'
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import { KS } from './KS';
import { KS2 } from './KS2';
import { KS3 } from './KS3';



const Stack = createNativeStackNavigator();

export default function App() {
	return (
    <AuthProvider>

		<NavigationContainer ref={navigationRef} >
			<Stack.Navigator initialRouteName="Login" screenOptions={{contentStyle:{backgroundColor: 'transparent'},headerShown: false}}>
      
			<Stack.Screen name="Login" component={LoginScreen} />

			<Stack.Screen name="Adminov" component={KS} />
			<Stack.Screen name="Korisnikov" component={KS2} />
			<Stack.Screen name="AdminSov" component={KS3} />

      <Stack.Screen name="Dodaj" component={DodavanjeKorisnika} />
			<Stack.Screen name="KorisnikEdit" component={KorisnkEditScreen} />
			<Stack.Screen name="NarudzbeDodaj" component={DodavanjeNarudzbeScreen} />
			<Stack.Screen name="KorisnikS" component={KorisnikSifra} />
			<Stack.Screen name="ProizvodEdit" component={ProizvodEditScreen} />
			<Stack.Screen name="SkladisteDodajProizvod" component={DodajProizvodSkladisteScreen} />

			<Stack.Screen name="ProizvodiPoslovnice" component={ListaProizvodaUPoslovniciScreen} />
			<Stack.Screen name="ProizvodiPoslovnice2" component={ListaProizvodaUPoslovnici2Screen} />

			<Stack.Screen name="DodajDo" component={DodajDostavuScreen} />
			<Stack.Screen name="ProizvodiNarudzba" component={DodajProizvodeNarudzbaScreen} />
			<Stack.Screen name="DostavaP" component={DostavaPrijem} />

			<Stack.Screen name="ArtikliNarudzba" component={ArtikliNarudzba} />
			<Stack.Screen name="DodajArtikl" component={DodajArtikl} />
			<Stack.Screen name="ArtiklEdit" component={ArtiklEdit} />

			
			
			</Stack.Navigator>
		</NavigationContainer>
    </AuthProvider>


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