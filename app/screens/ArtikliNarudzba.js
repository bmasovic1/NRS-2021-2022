import React, { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { ListItem, Icon } from "@rneui/base";
import { Provider, Dialog, FAB, IconButton, Portal } from "react-native-paper";

const { useState } = React;

const ArtikliNarudzba = ({ navigation }) => {
  
  const [lista, setLista] = useState([]);
  const {state, listaProizvodaUPos2} = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      setLista(state.listAR);
    }, [])
  );

  const ItemRender = ({ artikl }) => (
    <ListItem bottomDivider containerStyle={{ margin: 3 }}>
      <ListItem.Content>
        <ListItem.Title h3 h3Style={{ fontWeight: "bold" }}>
          <Text>{artikl.nazivProizvoda}</Text>
        </ListItem.Title>
        <ListItem.Subtitle>
        <Text style={{ textAlign: 'center' }}>
            Kolicina: {artikl.kolicina}
            {"\n"}
            Jedinica: {artikl.jedinica}
            {"\n"}
            Cijena: {artikl.cijena}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <Icon
        raised
        name="edit"
        size={20}
        style={{ textAlign: "center" }}
        type="font-awesome"
        onPress={() =>navigation.navigate('ArtiklEdit', {
        nazivProizvoda: artikl.nazivProizvoda,
        idDostave: artikl.id,
        kolicinaProizvoda: artikl.kolicina,
      })}
      />
    </ListItem>

  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.item2}>Artikli na narudžbi</Text>

      <FlatList
        style={styles.listaa}
        data={lista}
        renderItem={({ item }) => <ItemRender artikl={item.artikl} />}
        keyExtractor={(item) => item.artikl.id}
      />

      <FAB
        style={styles.fab}
        large
        icon="plus"
        onPress={listaProizvodaUPos2}
      />
       <FAB
        style={styles.fab2}
        large
        icon="minus"
      />
        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //top:"5%",
  },
  listaa: {
    width: "90%",
  },
  item2: {
    fontSize: 20,
    padding: 10,
    textAlign: "left",
    fontWeight: "bold",
    marginVertical: 8,
    width: "90%",
  },
  fab: {
    position: "absolute",
    backgroundColor: "#46b4e7",
    margin: 20,
    left: "50%",
    bottom: 0,
  },
  fab2: {
    position: "absolute",
    backgroundColor: "#46b4e7",
    margin: 20,
    left: "22%",
    bottom: 0,
  },
});

export default ArtikliNarudzba;
