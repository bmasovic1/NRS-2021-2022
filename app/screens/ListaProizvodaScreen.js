import React, { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { ListItem, Icon } from "@rneui/base";
import { Provider, Dialog, FAB, IconButton, Portal } from "react-native-paper";

const { useState } = React;

const ListaProizvodaScreen = ({ navigation }) => {
  const [lista, setLista] = useState([]);
  const { state, obrisiProizvod, proizvodPod } = useContext(AuthContext);


  useFocusEffect(
    React.useCallback(() => {
      setLista(state.list);
    }, [])
  );

  const getProizvod = (name) => {
    proizvodPod(name);
  };

  const handleDelete = async (id, naziv) => {
    await obrisiProizvod(naziv);

    let listNewState = lista.filter(
      (item) => item.proizvod.id != id
    );
    setLista(listNewState);
    console.log("UDATE LISTE")
    console.log("obisano sa LISTE")


  };

  const ItemRender = ({ proizvod }) => (
    <ListItem bottomDivider containerStyle={{ margin: 3 }}>
      <ListItem.Content>
        <ListItem.Title h3 h3Style={{ fontWeight: "bold" }}>
          <Text>{proizvod.naziv}</Text>
        </ListItem.Title>
        <ListItem.Subtitle>
          <Text>
            Kolicina: {proizvod.kolicina}
            {"\n"}
            Jedinica: {proizvod.jedinica}
            {"\n"}
            Cijena: {proizvod.cijena}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <Icon
        raised
        name="edit"
        size={15}
        style={{ textAlign: "center" }}
        type="font-awesome"
        onPress={() => getProizvod(proizvod.naziv)}
      />
      <Icon
        raised
        name="remove"
        size={15}
        style={{ textAlign: "center" }}
        type="font-awesome"
        onPress={
          async () => await handleDelete(proizvod.id,proizvod.naziv)
        }/>
    </ListItem>

  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.item2}>Proizvodi u skladištu</Text>

      <FlatList
        style={styles.listaa}
        data={lista}
        renderItem={({ item }) => <ItemRender proizvod={item.proizvod} />}
        keyExtractor={(item) => item.proizvod.id}
      />
      <FAB
        style={styles.fab}
        large
        icon="plus"
        onPress={() => navigation.navigate("SkladisteDodajProizvod")}
      />
          
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    left: "36%",
    bottom: 0,
  },
});

export default ListaProizvodaScreen;
