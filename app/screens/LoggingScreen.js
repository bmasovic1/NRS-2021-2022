import React, { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, SafeAreaView, FlatList } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { ListItem, Icon, Text as RNEText } from "@rneui/base";
import { Provider, Dialog, FAB, IconButton, Portal } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
const { useState } = React;

const LoggingScreen = ({ navigation }) => {

  const [lista, setLista] = useState([]);

  const { state, listaLogging } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      listaLogging()  
      setLista(state.listLo);
      console.log("LO: "+state.listLo)
      console.log("LISTE NAR")
    }, [])
  );


  const ItemRender = ({ logg }) => (
    <ListItem bottomDivider containerStyle={{ margin: 3}}>
      <ListItem.Content>
        <ListItem.Subtitle>
          <Text>
            {logg.opisAkcije}
          </Text>
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          <Text>
            Akcija:  {logg.tipAkcije}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>

    </ListItem>
  );

  return (
    <RootSiblingParent>
      <Provider>
        <SafeAreaView style={styles.container}>
          <RNEText
            h1
            h1Style={{ fontWeight: "bold" }}
            style={{ textAlign: "left" }}
          >
            <Icon size={45} style={{ marginRight: 5 }} />
            HISTORIJA
          </RNEText>
          
          <FlatList
            style={styles.listaa}
            data={lista}
            renderItem={({ item }) => (
              <ItemRender logg={item.logg} />
            )}
            keyExtractor={(item) => item.logg.id}
          />
        </SafeAreaView>
      </Provider>
    </RootSiblingParent>
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

export default LoggingScreen;
