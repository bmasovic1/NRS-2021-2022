import React, { useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, SafeAreaView, View} from 'react-native';
import {TextInput, RadioButton} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';

import { Context as AuthContext } from '../context/AuthContext'

function DodajArtikl({ route }){

  const {state, dodavanjeNaRacun, obrisiKorisnika} = useContext(AuthContext);

  const [kolicina, setKolicina] = useState('');
  const [nazivProizvoda, setNazivProizvoda ] = useState('');
  const [idDostave, setIdDostave] = useState('');



  useFocusEffect(
    React.useCallback(() => {

      setNazivProizvoda(route.params.nazivProizvoda)
      setIdDostave(route.params.idDostave)

    }, [])
  );

  return (

    <SafeAreaView style={styles.container}>

      <Text>MAX: {route.params.kolicinaProizvoda}</Text>
      <TextInput autoCapitalize='none' label='Kolicina' mode='outlined' style={styles.input} value={kolicina} onChangeText={im => setKolicina(im.trim())}></TextInput>

      <TouchableOpacity style={styles.button} onPress={()=>dodavanjeNaRacun({idDostave, nazivProizvoda, kolicina})} >
        <Text style={styles.text}>DODAJ</Text>
      </TouchableOpacity>      

    </SafeAreaView>

    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor:'gray',
    height: 45,
    margin: 2,
    fontSize: 12,
    justifyContent: 'center',
    width: '90%'
  },
  button: {
    alignItems: "center",
    backgroundColor: "#46b4e7",
    width: '60%',
    height: 45,
    padding: 11,
    borderRadius:20,
    marginTop: 8,
    justifyContent: 'center',
  },
  button2: {
    alignItems: "center",
    backgroundColor: "#46b4e7",
    height: 45,
    width: '90%',
    padding: 11,
    borderRadius:20,
    fontSize: 5,
    marginTop: 8,
    justifyContent: 'center',
  },
  text: {
    color: "#4a4b44",
    fontSize: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMes: {
    color: 'red',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link:{
    marginTop: 10,
    color: 'blue'
  },
  dodan: {
    color: 'black',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width:"40%",
  },
 
});


export default DodajArtikl;