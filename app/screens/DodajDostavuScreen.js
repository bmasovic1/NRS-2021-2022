import React, { useState, useContext, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {StyleSheet,Text,TouchableOpacity,SafeAreaView,View,} from "react-native";
import { TextInput, RadioButton } from "react-native-paper";
import { Context as AuthContext } from "../context/AuthContext";
import {Picker} from '@react-native-picker/picker';
function DodajDostavu({ navigation }) {
  
  const { state, DropListaProizvoda, dodavanjeDostave } = useContext(AuthContext);

  const [kolicina, setKolicina] = useState("");
  const [nazivPoslovnice, setNazivPoslovnice] = useState("");
  const [nazivProizvoda, setNazivProizvoda] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      DropListaProizvoda();
      setNazivProizvoda(state.list3[0].proizvod.naziv);
          //setStol("Stol1")
    }, [])
  );

  const renderProductList = () => {
      return state.list3.map((proizvod) => {
        return <Picker.Item label={proizvod.proizvod.naziv+" Kolicina: "+ proizvod.proizvod.kolicina} value={proizvod.proizvod.naziv} key={proizvod.proizvod.id} />
      })
    }
  return (
    <SafeAreaView style={styles.container}>

      

      <Picker
        style={styles.picker}
        selectedValue={nazivPoslovnice}
        onValueChange={(itemValue) =>
          setNazivPoslovnice(itemValue)
        }>
          <Picker.Item label="Mix" value="Mix" />
          <Picker.Item label="Amko" value="Amko" />
          <Picker.Item label="Bingo" value="Bingo" />
      </Picker>

      <Picker
        style={styles.picker}
        selectedValue={nazivProizvoda}
        onValueChange={(itemValue) =>
          setNazivProizvoda(itemValue)
        }>
        {renderProductList()}
      </Picker>

      <TextInput autoCapitalize="none"label="kolicina"mode="outlined"style={styles.input}onChangeText={(kol) => setKolicina(kol)}></TextInput>

      <TouchableOpacity
        style={styles.button}
        onPress={() => dodavanjeDostave({ nazivProizvoda, nazivPoslovnice, kolicina })}
      >
        <Text style={styles.text}>KREIRAJ</Text>
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
  input: {
    borderColor: "gray",
    height: 45,
    margin: 2,
    fontSize: 12,
    justifyContent: "center",
    width: "90%",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#46b4e7",
    width: "60%",
    height: 40,
    borderRadius: 20,
    margin: 5,
    marginTop: 8,
    justifyContent: "center",
  },
  text: {
    color: "#4a4b44",
    fontSize: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  errorMes: {
    color: "red",
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    marginTop: 10,
    color: "blue",
  },
  dodan: {
    color: "black",
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width:"90%",
    alignItems: "center",
    justifyContent: "center",
},
});

export default DodajDostavu;
