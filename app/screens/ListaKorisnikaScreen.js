import React, { useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, SafeAreaView, FlatList } from 'react-native';
import { Context as AuthContext } from "../context/AuthContext";
import { ListItem, Icon, Text as RNEText } from "@rneui/base";
import { Provider, Dialog, FAB, IconButton, Portal } from "react-native-paper";
const { useState } = React;

const ListaKorisnikaScreen = ({ navigation }) => {

    const [lista, setLista] = useState([]);
    const [dialog, setDialog] = useState({
      visible: false,
      id: null,
      email: null,
    });

    const {state, korisnikPod, listaKorisnika, obrisiKorisnika} = useContext(AuthContext);

    const getItem = (name) => {
 
      korisnikPod(name);

    } 

    const handleDelete = async (id, email) => {
      await obrisiKorisnika(email);

      let listNewState = lista.filter(
        (item) => item.korisnik.id != id
      );
      setLista(listNewState);
      console.log("UDATE LISTE")
      console.log("obisano sa LISTE")


    };

    useFocusEffect(
      React.useCallback(() => {
        listaKorisnika()
        setLista(state.list);
        console.log("idemoooo");
      }, [])
    );
    
    const ItemRender = ({ korisnik }) => (
      <ListItem
        bottomDivider
        containerStyle={{ margin: 3 }}
      >
        <ListItem.Content>
          <ListItem.Title h3 h3Style={{ fontWeight: "bold" }}>
            <Text>{korisnik.email}</Text>
          </ListItem.Title>
          <ListItem.Subtitle>
          <Text>
            Ime: {korisnik.ime}
            {"\n"}
            Prezime: {korisnik.prezime}
            {"\n"}
            Tip: {korisnik.tip}
          </Text>
        </ListItem.Subtitle>
        </ListItem.Content>
        <Icon
        raised
        name="edit"
        size={15}
        style={{ textAlign: "center" }}
        type="font-awesome"
        onPress={() => getItem(korisnik.email)}
      />
      <Icon
        raised
        name="remove"
        size={15}
        style={{ textAlign: "center" }}
        type="font-awesome"
        onPress={
          async () => await handleDelete(korisnik.id,korisnik.email)
        }/>
      </ListItem>
    );
  
    return (
      <Provider>
        <SafeAreaView style={styles.container}>
          <RNEText
            h1
            h1Style={{ fontWeight: "bold" }}
            style={{ textAlign: "left" }}
          >
            <Icon name="store" size={45} style={{ marginRight: 5 }} />
            KORISNICI
          </RNEText>
          <FlatList
            style={styles.listaa}
            data={lista}
            renderItem={({ item }) => <ItemRender korisnik={item.korisnik} />}
            keyExtractor={(item) => item.korisnik.id}
          />
          <FAB
            style={styles.fab}
            large
            icon="plus"
            onPress={() => navigation.navigate("Dodaj")}
          />
          <Portal>
          <Dialog visible={dialog.visible}>
            <Dialog.Title>Izbriši korisnika</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#fff" }}>
                Jeste li sigurni da želite izbrisati korisnika?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <IconButton
                icon="close"
                onPress={() =>
                  setDialog({ visible: false, id: null })
                }
                style={{ margin: 10 }}
              />
              <IconButton
                icon="check"
                onPress={async () => await handleDelete()}
                style={{ margin: 10 }}
              />
            </Dialog.Actions>
          </Dialog>
        </Portal>
        </SafeAreaView>
      </Provider>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
  },
  listaa: {
    width: "90%",
  },
  item2: {
    fontSize: 20,
    padding: 10,
    textAlign: "center",
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



export default ListaKorisnikaScreen;