import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';

function AdminSScreen({ navigation }) {
  const { signout } = useContext(AuthContext);

  const { state, listaProizvoda, ListaPoslovnica, listaLogging, listaDostava } = useContext(AuthContext);

  const listaProiz = () => {
    listaProizvoda();
  };

  const listaPos = () => {
    ListaPoslovnica();
  };

  useFocusEffect(
    React.useCallback(() => {
      
      listaDostava()
      listaLogging()
      listaProizvoda()
      ListaPoslovnica()

    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.naslov}>ADMIN SKLADISTA</Text>

      <TouchableOpacity style={styles.pregled_poslovnica} onPress={listaPos}>
        <Text style={styles.textPr2}>PREGLED POSLOVNICA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={signout}>
        <Text style={styles.text}>SIGN OUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#4a4b44",
    fontSize: 22,
    textAlign: "center",
  },
  textPr: {
    color: "#4a4b44",
    fontSize: 18,
    textAlign: "center",
  },
  textPr2: {
    color: "#4a4b44",
    fontSize: 17.5,
    textAlign: "center",
  },
  textDodPos: {
    color: "#4a4b44",
    fontSize: 13,
    textAlign: "center",
  },
  naslov: {
    color: "#4a4b44",
    fontSize: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "15%",
  },
  button: {
    backgroundColor: "#46b4e7",
    width: "60%",
    height: 55,
    padding: 14,
    borderRadius: 20,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "8%",
  },
  pregled_proizvoda: {
    backgroundColor: "#46b4e7",
    width: "60%",
    height: 55,
    padding: 14,
    borderRadius: 20,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "28%",
  },
  pregled_poslovnica: {
    backgroundColor: "#46b4e7",
    width: "60%",
    height: 55,
    padding: 14,
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "38%",
  },
  proizvod_skladiste: {
    backgroundColor: "#46b4e7",
    width: "60%",
    height: 55,
    padding: 14,
    borderRadius: 20,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "18%",
  },
});
export default AdminSScreen;
