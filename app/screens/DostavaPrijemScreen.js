import React, { useState, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Button} from 'react-native';
import {TextInput, RadioButton} from 'react-native-paper';
import { Context as AuthContext } from '../context/AuthContext'

function DostavaPrijem({ navigation }){

  const {state, uvediProizvod} = useContext(AuthContext);

  const [stringparam, setStringparam] = useState('');
  const [nazivProizvoda, setNazivProizvoda] = useState('');
  const [nazivPoslovnice, setNazivPoslovnice ] = useState('');
  const [kolicina, setKolicina] = useState('');
  const [jedinica, setJedinica ] = useState('');
  const [cijena, setCijena] = useState('');
  const [stanje, setSanje ] = useState('');
 

  useFocusEffect(
    React.useCallback(() => {

      console.log("nazivPoslovnice: "+state.editD.dostava.nazivPoslovnice)
      console.log("ID: "+state.editD.dostava._id)

      setStringparam( state.editD.dostava._id.trim() );
      setNazivProizvoda( state.editD.dostava.nazivProizvoda.trim() );
      setNazivPoslovnice( state.editD.dostava.nazivPoslovnice.trim() );
      setKolicina( state.editD.dostava.kolicina.trim() );
      setJedinica( state.editD.dostava.jedinica.trim() );
      setCijena( state.editD.dostava.cijena.trim() );
      setSanje( state.editD.dostava.stanje );

    }, [])
  );

  return (

    <SafeAreaView style={styles.container}>

      <TextInput autoCapitalize='none' editable={false} label='nazivProizvoda' mode='outlined' style={styles.input} value={nazivProizvoda} onChangeText={im => setNazivProizvoda(im.trim())}></TextInput>
      <TextInput autoCapitalize='none' editable={false} label='nazivPoslovnice' mode='outlined' style={styles.input} value={nazivPoslovnice} onChangeText={pre => setNazivPoslovnice(pre.trim())}></TextInput>
      <TextInput autoCapitalize='none' editable={false} label='kolicina' mode='outlined' style={styles.input} value={kolicina} onChangeText={jmbg => setKolicina(jmbg.trim())}></TextInput>

      <TextInput autoCapitalize='none' editable={false} label='jedinica' mode='outlined' style={styles.input} value={jedinica} onChangeText={user => setJedinica(user.trim())}></TextInput>
      <TextInput autoCapitalize='none' editable={false} label='cijena' mode='outlined' style={styles.input} value={cijena} onChangeText={pas => setCijena(pas.trim())}></TextInput>

      <TextInput autoCapitalize='none' editable={false} label='stanje' mode='outlined' style={styles.input} value={stanje} onChangeText={boja => setSanje(boja.trim())}></TextInput>

      <TouchableOpacity style={styles.button} onPress={()=>uvediProizvod(nazivPoslovnice, stringparam)}  >
        <Text style={styles.text}>PREUZMI</Text>
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
    height: 50,
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
  }
 
});


export default DostavaPrijem;