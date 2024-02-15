import React, { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, SafeAreaView, FlatList } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { ListItem, Icon, Text as RNEText } from "@rneui/base";
import { Provider, Dialog, FAB, IconButton, Portal } from "react-native-paper";
const { useState } = React;

const ListaPoslovnicaScreen = ({ navigation }) => {
  
  const [lista, setLista] = useState([]);

  const { state, listaProizvodaUPos } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      setLista(state.list2);

      console.log("idemoooo");
    }, [])
  );

  const ItemRender = ({ poslovnica }) => (
    <ListItem
      onPress={() => listaProizvodaUPos(poslovnica.naziv)}
      bottomDivider
      containerStyle={{ margin: 3 }}
    >
      <ListItem.Content>
        <ListItem.Title h3 h3Style={{ fontWeight: "bold" }}>
          <Text>{poslovnica.naziv}</Text>
        </ListItem.Title>
        <ListItem.Subtitle>
          <Text>
            Adresa: {poslovnica.adresa}
            {"\n"}
            Grad: {poslovnica.grad}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
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
          Poslovnice
        </RNEText>
        <FlatList
          style={styles.listaa}
          data={lista}
          renderItem={({ item }) => <ItemRender poslovnica={item.poslovnica} />}
          keyExtractor={(item) => item.poslovnica.id}
        />
      </SafeAreaView>
    </Provider>
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
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 8,
    width: "90%",
  },
  fab: {
    position: "absolute",
    backgroundColor: "#46b4e7",
    margin: 50,
    left: 0,
    bottom: 0,
  },
});

export default ListaPoslovnicaScreen;
