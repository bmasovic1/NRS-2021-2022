import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../RootNavigation";
import createDataContext from "./CreateDataContext";
import trackerApi from "../api/tracker";
import Proizvod from "../../Server/src/models/Proizvod";


const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };

    case "signin":
      return { errorMessage: "", token: action.payload };

    case "clear":
      return { dodan: "", errorMessage: "" };

    case "signout":
      return { token: null, errorMessage: "" };

    case "dodaj":
      return { errorMessage: "", dodan: "Korisnik uspješno dodan!" };

    case "list":
      return { ...state, list: action.payload };

    case "list11":
      return { ...state, list11: action.payload };

    case "listLo":
      return { ...state, listLo: action.payload };

    case "listDo":
      return { ...state, listDo: action.payload };

    case "listPP":
      return { ...state, listPP: action.payload };

    case "listAR":
        return { ...state, listAR: action.payload };
    case "list2":
      return { ...state, list2: action.payload };

    case "list3":
      return { ...state, list3: action.payload };

    case "edit":
      console.log("DODANO");
      return { ...state, edit: action.payload };

    case "editD":
      return { ...state, editD: action.payload };

    case "dodajPos":
      console.log("DODANA POSLOVNICA");
      return { errorMessage: "", dodan: "Poslovnica uspješno dodana!" };

    case "dodajPro":
      console.log("DODAN PROIZVOD");
      return { errorMessage: "", dodan: "Proizvod uspješno dodan!" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  const korisnik = await AsyncStorage.getItem("korisnik");

  if (token) {
    dispatch({ type: "signin", payload: token });
    if (korisnik) {
      if (korisnik == "Admin") {
        RootNavigation.reset("Adminov");
      } else if (korisnik == "AdminS") {
        RootNavigation.reset("AdminSov");
      } else {
        RootNavigation.reset("Korisnikov");
      }
    }
  } else {
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear" });
};

const signup =
  (dispatch) =>
  async ({
    email,
    password,
    ime,
    prezime,
    jmbg,
    omiljenaBoja,
    omiljenaZivotinja,
  }) => {
    try {
      const response = await trackerApi.post("/signup", {
        email,
        password,
        ime,
        prezime,
        jmbg,
        omiljenaBoja,
        omiljenaZivotinja,
      });

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("id", response.data.id);
      await AsyncStorage.setItem("email", response.data.email);
      dispatch({ type: "signin", payload: response.data.token });
      await AsyncStorage.setItem("korisnik", "Korisnik");

      RootNavigation.reset("Korisnik");
    } catch (err) {
      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

const signin =
  (dispatch) =>
  async ({ email, password }) => {
    try {
      const response = await trackerApi.post("/signin", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("email", response.data.email);
      await AsyncStorage.setItem("id", response.data.id);
      dispatch({ type: "signin", payload: response.data.token });

      if (email == "admin") {
        await AsyncStorage.setItem("korisnik", "Admin");
        RootNavigation.reset("Adminov");
      } else if (email == "adminS") {
        await AsyncStorage.setItem("korisnik", "AdminS");
        RootNavigation.reset("AdminSov");
      } else {
        RootNavigation.reset("Korisnikov");
        await AsyncStorage.setItem("korisnik", "Korisnik");
      }
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Doslo je do greske",
      });
    }
  };

const signout = (dispatch) => async () => {
  let user = {
    id: await AsyncStorage.getItem("id"),
    email: await AsyncStorage.getItem("email"),
  };

  trackerApi.post("/singout", user);

  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("korisnik");
  await AsyncStorage.removeItem("id");
  await AsyncStorage.removeItem("email");

  dispatch({ type: "signout" });

  RootNavigation.reset("Login");
};

const dodavanje =
  (dispatch) =>
  async ({
    email,
    password,
    ime,
    prezime,
    jmbg,
    omiljenaBoja,
    omiljenaZivotinja,
    value,
    poslovnica
  }) => {
    try {
      console.log("tipKor: " + value);

      const response = await trackerApi.post("/dodaj", {
        email,
        password,
        ime,
        prezime,
        jmbg,
        omiljenaBoja,
        omiljenaZivotinja,
        value,
        poslovnica
      });

      dispatch({ type: "dodaj", payload: response.data.token });

      console.log("DODANO");
      RootNavigation.reset("Adminov");

    } catch (err) {
      console.log("NEEE RADI DODAJ");
      console.log(err);

      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

const dodavanjePoslovnice =
  (dispatch) =>
  async ({ naziv, grad, adresa }) => {
    try {
      const response = await trackerApi.post("/dodajPos", {
        naziv,
        grad,
        adresa,
      });
      console.log(response.naziv);
      dispatch({ type: "dodajPos", payload: response.naziv });

      RootNavigation.navigate("AdminSov");
    } catch (err) {
      console.log("NE RADI DODAVANJE POSLOVNICE");
      console.log(err);
      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

const dodavanjeProizvodaSkladiste =(dispatch) =>async ({ naziv, kolicina, jedinica, cijena, stanje }) => {

    try {

      console.log("stanje "+stanje);
      const response = await trackerApi.post("/dodajProSkladiste", {naziv,kolicina,jedinica,cijena,stanje});
      console.log(response.data.proizvod.naziv);
      dispatch({ type: "dodajPro", payload: response.data });
      RootNavigation.reset("AdminSov");

    } catch (err) {

      console.log("NE RADI dodavanjeProizvodaSkladiste");
      console.log(err);
      dispatch({ type: "add_error", payload: "Doslo je do greske" });

    }

  };

const uvediProizvod = (dispatch) => async (nazivPoslovnice,stringparam) => {

  try {
    let naziv_poslovnice = nazivPoslovnice;
    console.log("111: "+naziv_poslovnice)
    console.log("222: "+stringparam)

    console.log("proizvodi:"+ stringparam +" se uvode u poslovnicu "+ naziv_poslovnice)
    const response = await trackerApi.post("/uvediPro", {
      naziv_poslovnice,
      stringparam
    });
    //console.log(response.data.poslovnica.naziv);
    dispatch({ type: "dodajPro", payload: response.data });
    RootNavigation.reset("AdminSov");

  } catch (e) {
    console.log("Ne radi uvođenje proizvoda!");
    console.log(e);
    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const izmjenaKorisnika =
  (dispatch) =>
  async ({
    email,
    password,
    ime,
    prezime,
    jmbg,
    omiljenaBoja,
    omiljenaZivotinja,
    value,
    poslovnica
  }) => {
    try {
      const response = await trackerApi.post("/korisnikEdit", {
        email,
        password,
        ime,
        prezime,
        jmbg,
        omiljenaBoja,
        omiljenaZivotinja,
        value,
        poslovnica
      });

      console.log(email);

      RootNavigation.reset("Adminov");
    } catch (err) {
      console.log("NEEE RADI izmjenaKorisnika");
      console.log(err);

      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

const izmjenaProizvoda =
  (dispatch) =>
  async ({ nazivS, naziv, kolicina, jedinica, cijena }) => {

    console.log("1 "+naziv)
    console.log("1 "+kolicina)
    console.log("1 "+jedinica)
    console.log("1 "+cijena)

    try {
      const response = await trackerApi.post("/proizvodEdit", {
        nazivS,
        naziv,
        kolicina,
        jedinica,
        cijena
      });

      RootNavigation.navigate("AdminSov");
    } catch (err) {
      console.log("NEEE RADI izmjenaProizvoda");
      console.log(err);

      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };


const preuzimanjeProizvoda = (dispatch) => async (nazivS) => {  ///////////vraca error 404///////////
  try{
    console.log("proizvod: "+ nazivS+ " se preuzima");
    const response = await trackerApi.post("/preuzimanjePro/"+nazivS);
  } catch(err) {
    console.log("NEEE RADI preuzimanjeProizvoda");
    console.log(err);
    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }

}


const obrisiProizvod = (dispatch) => async (naziv) => {
  try {
    console.log("proizvod: " + naziv);
    const response = await trackerApi.delete("/izbrisiPro/" + naziv);
    RootNavigation.reset("AdminSov");
    console.log("proizvod " + naziv + " izbrisan");
  } catch (err) {
    console.log("NEEE RADI obrisiProizvod");
    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const listaKorisnika = (dispatch) => async () => {
  try {
    const response = await trackerApi.get("/korisnici");

    try {
      console.log("1:" + response.data.listaKo[0].id);
      dispatch({ type: "list", payload: response.data.listaKo });
    } catch (e) {
      const response = await trackerApi.get("/korisnici");

      dispatch({ type: "list", payload: response.data.listaKo });
      console.log("2: " + response.data.listaKo);
    }

    //RootNavigation.navigate("ListaK");
  } catch (err) {
    console.log(err);

    console.log("NEEE RADI listaKorisnika");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const korisnikPod = (dispatch) => async (email) => {
  try {
    const response = await trackerApi.get("/korisnikPodaci/" + email);

    try {
      console.log(response.data.user.prezime);
      dispatch({ type: "edit", payload: response.data });
    } catch (e) {
      const response = await trackerApi.get("/korisnikPodaci/" + email);

      dispatch({ type: "edit", payload: response.data });
      console.log("2: " + response.data.user.prezime);
    }

    RootNavigation.navigate("KorisnikEdit");
  } catch (err) {
    console.log("NEEE RADI korisnikPod");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const proizvodPod = (dispatch) => async (naziv) => {
  try {
    const response = await trackerApi.get("/proizvodPodaci/" + naziv);
    try {
      console.log(response.data.proizvod.kolicina);
      dispatch({ type: "edit", payload: response.data });
    } catch (e) {
      const response = await trackerApi.get("/proizvodPodaci/" + naziv);

      dispatch({ type: "edit", payload: response.data });
      console.log("2: " + response.data.proizvod.kolicina);
    }

    RootNavigation.reset("ProizvodEdit");
  } catch (err) {
    console.log("NEEE RADI proizvodPod");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }

  console.log(naziv);
};

const obrisiKorisnika = (dispatch) => async (email) => {
  try {
    console.log("email: " + email);
    const response = await trackerApi.delete("/izbrisi/" + email);
    //RootNavigation.reset("Lista Korisnika");
    console.log("RADI DODAJ");
  } catch (err) {
    try {
      console.log("email: " + email);
  
      const response = await trackerApi.delete("/izbrisi/" + email);
      //RootNavigation.reset("Lista Korisnika");
  
      console.log("RADI DODAJ");
    } catch (err) {
      console.log("NEEE RADI obrisiKorisnika");
  
      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  }
};

const korisnikPod2 = (dispatch) => async () => {
  try {
    const mail = await AsyncStorage.getItem("email");

    const response = await trackerApi.get("/korisnikPodaci/" + mail);

    try {
      console.log(response.data.user.prezime);
      dispatch({ type: "edit", payload: response.data });
    } catch (e) {
      const response = await trackerApi.get("/korisnikPodaci/" + mail);

      dispatch({ type: "edit", payload: response.data });
      console.log("2: " + response.data.user.prezime);
    }

    RootNavigation.navigate("KorisnikS");
  } catch (err) {
    console.log("NEEE RADI korisnikpod2");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const izmjenaKorisnika2 =(dispatch) =>async ({email,password,ime,prezime,jmbg,omiljenaBoja,omiljenaZivotinja,value,poslovnica}) => {
    
  try {
      console.log("PASS " + password);

      const response = await trackerApi.post("/korisnikEdit", {email,password,ime,prezime,jmbg,omiljenaBoja,omiljenaZivotinja,value,poslovnica});

      //dispatch({type: 'korisnikEdit', payload:response.data.token});

      console.log(email);

      RootNavigation.navigate("Korisnik");
    } catch (err) {
      console.log("NEEE RADI IZMIJENI");
      console.log(err);

      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

const listaProizvoda = (dispatch) => async () => {
  try {
    const response = await trackerApi.get("/proizvodi");

    try {
      console.log("1:" + response.data.listaP[0].proizvod.id);
      dispatch({ type: "list", payload: response.data.listaP });
    } catch (e) {
      const response = await trackerApi.get("/proizvodi");

      dispatch({ type: "list", payload: response.data.listaP });
      console.log("2: " + response.data.listaP[0].proizvod.id);
    }

    //RootNavigation.navigate("ListaP");
  } catch (err) {
    console.log("NE RADI listaproizvoda!");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const ListaPoslovnica = (dispatch) => async () => {
  try {
    const response = await trackerApi.get("/poslovnice");
    try {
      console.log("1:" + response.data.listaPoslovnica[0].poslovnica.id);
      dispatch({ type: "list2", payload: response.data.listaPoslovnica });
    } catch (e) {
      const response = await trackerApi.get("/poslovnice");

      dispatch({ type: "list2", payload: response.data.listaPoslovnica });
      console.log("2: " + response.data.listaPoslovnica[0].poslovnica.id);
    }

    //RootNavigation.navigate("ListaPoslovnica");
  } catch (err) {
    console.log("NEEE RADI listaposlovnica!");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};


const listaProizvodaPos = (dispatch) => async (naziv_poslovnice) => { ///////////////////////////////////////////////////////////////////////////////////////UVODJENJE PROIZVODA////////////////////////////////////////////////////////////////////////////
  try {
    console.log("otvorili smo poslovnicu "+ naziv_poslovnice)
    const response = await trackerApi.get("/proizvodi");

    try {
      console.log("1:" + response.data.listaP[0].proizvod.id);
      dispatch({ type: "list", payload: response.data.listaP });
    } catch (e) {
      const response = await trackerApi.get("/proizvodi");

      dispatch({ type: "list", payload: response.data.listaP });
      console.log("2: " + response.data.listaP[0].proizvod.id);
    }
    console.log("prosli su zahtjevi sada saljemo " + naziv_poslovnice + " na ekran")

    RootNavigation.navigateParam("PoslovnicaDodajProizvod", naziv_poslovnice);
  } catch (err) {
    console.log(err);

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const obrisiPoslovnicu = (dispatch) => async (poslovnicaID) => {
  try {
    const response = await trackerApi.delete("/poslovnice/" + poslovnicaID);
  } catch (err) {
    console.log("NEEE RADI birsanje poslovnice");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};


const DropListaPoslovnica = (dispatch) => async () => {
  try {
    console.log("POZIV")
    const response = await trackerApi.get("/poslovnice");
    try {
      console.log("DropListaPoslovnica1:" + response.data.listaPoslovnica[0].poslovnica.id);
      dispatch({ type: "list3", payload: response.data.listaPoslovnica });
    } catch (e) {
      const response = await trackerApi.get("/poslovnice");

      dispatch({ type: "list3", payload: response.data.listaPoslovnica });
      console.log("DropListaPoslovnica2: " + response.data.listaPoslovnica[0].poslovnica.id);
    }

    RootNavigation.navigate("DodajDo");
  } catch (err) {
    console.log("NEEE RADI listaposlovnica!");
  }
};

const proizvodiIzPoslovnice = (dispatch) => async (proizvodi) => {
  try {
    const response = await trackerApi.post("/proizvodi-poslovnice", {
      proizvodi: proizvodi,
    });
    return response.data;
  } catch (err) {
    console.log("Error kod odgovora rute 'proizvodi-poslovnice'");
    console.error(err);

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const ListaNarudzbi = (dispatch) => async () => {
  try {
    const idKorisnik = await AsyncStorage.getItem("id");

    console.log("NARUDZBEEE 1: "+idKorisnik)
    const response = await trackerApi.get("/narudzbe/"+idKorisnik);
    try {

      dispatch({ type: "list11", payload: response.data.listaNarudzbi });
    } catch (e) {

      const idKorisnik = await AsyncStorage.getItem("id");
      console.log("NARUDZBEEE 2: "+idKorisnik)

      const response = await trackerApi.get("/narudzbe/"+idKorisnik);


      dispatch({ type: "list11", payload: response.data.listaNarudzbi });
    }

    //RootNavigation.navigate("NarudzbeS");
  } catch (err) {
    console.log("NEEE RADI listanarudzbi!");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};


const sviProizvodi = (dispatch) => async () => {
  try {
    const response = await trackerApi.get("/proizvodi");

    return response.data

    console.log(response.data);
  } catch (err) { console.error(err) }
}

const dodavanjeNarudzbe = (dispatch) => async ({naziv, stol}) => {  
  try {
    
    const idKorisnik = await AsyncStorage.getItem("id");
    const response = await trackerApi.post('/dodajNarudzbu',  {naziv, idKorisnik, stol});

    RootNavigation.reset("Korisnikov");

  } catch(err) {
        console.log("NE RADI DODAVANJE NARUDZBE")
        console.log(err)
        dispatch({type: 'add_error', payload: 'Doslo je do greske'});
  }
}

const listaLogging = (dispatch) => async () => {
    try {
      const response = await trackerApi.get("/logging");
      console.log("LOGGGGIIINNGGG")
      try {
        console.log("LOG1: " + response.data.listaLOG[0].logg.id);
        dispatch({ type: "listLo", payload: response.data.listaLOG });
      } catch (e) {
        const response = await trackerApi.get("/logging");
        dispatch({ type: "listLo", payload: response.data.listaLOG });
        console.log("LOG2: " + response.data.listaLOG);

      }
  
      //RootNavigation.navigate("ListaK");
    } catch (err) {
      console.log(err);
  
      console.log("NEEE RADI listaKorisnika");
  
      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

  const listaDostava = (dispatch) => async () => {
      try {
        const response = await trackerApi.get("/dostave");
        console.log("DOSTAVAAA")
        try {
          console.log("LOG1: " + response.data.listaDo[0].dostava.id);
          dispatch({ type: "listDo", payload: response.data.listaDo });
        } catch (e) {
          const response = await trackerApi.get("/dostave");
          dispatch({ type: "listDo", payload: response.data.listaDo });
          console.log("LOG2: " + response.data.listaDo);
  
        }
    
        //RootNavigation.navigate("ListaK");
      } catch (err) {
        console.log(err);
    
        console.log("NEEE RADI lista Dostava");
    
        dispatch({ type: "add_error", payload: "Doslo je do greske" });
      }
    };

const DropListaProizvoda = (dispatch) => async () => {
  try {
    console.log("POZIV")
    const response = await trackerApi.get("/proizvodi");
    try {
      console.log("listaP 1: " + response.data.listaP[0].proizvod.id);
      dispatch({ type: "list3", payload: response.data.listaP });
    } catch (e) {
      const response = await trackerApi.get("/proizvodi");

      dispatch({ type: "list3", payload: response.data.listaP });
      console.log("listaP 2: " + response.data.listaP[0].proizvod.id);
    }

    RootNavigation.navigate("DodajDo");
  } catch (err) {
    console.log("NEEE RADI listaproizvod!");
  }
};

const dodavanjeDostave = (dispatch) =>async ({ nazivProizvoda, nazivPoslovnice, kolicina }) => {

    try {

      const response = await trackerApi.post("/dodajDostavu", {nazivProizvoda,nazivPoslovnice,kolicina});
      console.log(response.naziv);

      RootNavigation.reset("AdminSov");

    } catch (err) {
      console.log("NE RADI DODAVANJE DOSTAVE");
      console.log(err);
      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

const listaProizvodaUPos = (dispatch) => async (naziv) => {

  try {

    console.log(naziv)

    const response = await trackerApi.get("/proizvodiUPoslovnici/"+naziv);

    try {
      console.log("listPP1:" + response.data.listaPR[0].proizvod.id);
      dispatch({ type: "listPP", payload: response.data.listaPR });
    } catch (e) {

    const response = await trackerApi.get("/proizvodiUPoslovnici/"+naziv);

      dispatch({ type: "listPP", payload: response.data.listaPR });
      console.log("listPP2: " + response.data.listaPR[0].proizvod.id);
    }

    RootNavigation.navigate("ProizvodiPoslovnice");
  } catch (err) {
    console.log("NE RADI listaPR!");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const dostavaPod = (dispatch) => async (id) => {
  try {

    const response = await trackerApi.get("/dostavaPodaci/" + id);

    try {

      console.log("DO1 "+response.data.dostava.nazivProizvoda);
      dispatch({ type: "editD", payload: response.data });

    } catch (e) {

      const response = await trackerApi.get("/dostavaPodaci/" + id);
      dispatch({ type: "editD", payload: response.data });
      console.log("DO2 "+response.data.dostava.nazivProizvoda);

    }

    RootNavigation.navigate("DostavaP");
  } catch (err) {
    console.log("NEEE RADI korisnikpod2");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const DropListaPoslovnica2 = (dispatch) => async () => {
  try {
    console.log("POZIV2222")
    const response = await trackerApi.get("/poslovnice");
    try {
      console.log("DropListaPoslovnica1:" + response.data.listaPoslovnica[0].poslovnica.id);
      dispatch({ type: "list3", payload: response.data.listaPoslovnica });
    } catch (e) {
      const response = await trackerApi.get("/poslovnice");

      dispatch({ type: "list3", payload: response.data.listaPoslovnica });
      console.log("DropListaPoslovnica2: " + response.data.listaPoslovnica[0].poslovnica.id);
    }

    //RootNavigation.navigate("NarudzbeDodaj");
  } catch (err) {
    console.log("NEEE RADI listaposlovnica!");
  }
};

const listaArtikalaUNaru = (dispatch) => async (naziv) => {

  try {

    await AsyncStorage.setItem("narudzba", naziv);

    const response = await trackerApi.get("/artikliUNarudzbi/"+naziv);

    try {
      console.log("listAR 1:" + response.data.listaAR[0].artikl.id);
      dispatch({ type: "listAR", payload: response.data.listaAR });
    } catch (e) {

    const response = await trackerApi.get("/artikliUNarudzbi/"+naziv);

      dispatch({ type: "listAR", payload: response.data.listaAR });
      console.log("listAR 2: " + response.data.listaAR[0].artikl.id);
    }

    RootNavigation.navigate("ArtikliNarudzba");
  } catch (err) {
    console.log("NE RADI listaAR!");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};

const listaProizvodaUPos2 = (dispatch) => async (naziv) => {
  //console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs")

  try {

    const korisnik = await AsyncStorage.getItem("email");

    const response = await trackerApi.get("/proizvodiUPoslovnici2/"+korisnik);

    try {
      console.log("listPP1:" + response.data.listaPR[0].proizvod.id);
      dispatch({ type: "listPP", payload: response.data.listaPR });
    } catch (e) {

    const response = await trackerApi.get("/proizvodiUPoslovnici2/"+korisnik);

      dispatch({ type: "listPP", payload: response.data.listaPR });
      console.log("listPP2: " + response.data.listaPR[0].proizvod.id);
    }

    RootNavigation.navigate("ProizvodiPoslovnice2");

  } catch (err) {
    console.log(err)
    console.log("NE RADI listaPR!");

    dispatch({ type: "add_error", payload: "Doslo je do greske" });
  }
};


const dodavanjeNaRacun =(dispatch) =>async ({ idDostave, nazivProizvoda, kolicina }) => {

    try {

      const narudzbaN = await AsyncStorage.getItem("narudzba");

      const response = await trackerApi.post("/uvediArtikl", { narudzbaN, idDostave, nazivProizvoda, kolicina });
      //console.log(response.naziv);
      //dispatch({ type: "dodajPos", payload: response.naziv });

      RootNavigation.navigate("Korisnikov");
    } catch (err) {
      console.log("NE RADI DODAVANJE NA RACUN");
      console.log(err);
      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

  const izmjenaArtikla = (dispatch) =>async ({kolicina, naziv}) => {

    try {
      const response = await trackerApi.post("/artiklEdit", {kolicina, naziv});

      RootNavigation.navigate("Korisnikov");

    } catch (err) {

      console.log("NEEE RADI izmjena artikla");
      console.log(err);

      dispatch({ type: "add_error", payload: "Doslo je do greske" });
    }
  };

  const dodavanjeKategorije = (dispatch) => async ({naziv, stol}) => { 

    try {
      
      const idKorisnik = await AsyncStorage.getItem("id");
      const response = await trackerApi.post('/dodajNarudzbu',  {naziv, idKorisnik, stol});
  
      RootNavigation.reset("Korisnikov");
  
    } catch(err) {

          console.log("NE RADI DODAVANJE NARUDZBE")
          console.log(err)
          dispatch({type: 'add_error', payload: 'Doslo je do greske'});
          
    }
  }

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signout,
    signup,
    dodavanje,
    listaKorisnika,
    korisnikPod,
    korisnikPod2,
    izmjenaKorisnika,
    izmjenaKorisnika2,
    obrisiKorisnika,
    listaProizvoda,
    ListaPoslovnica,
    clearErrorMessage,
    tryLocalSignin,
    dodavanjePoslovnice,
    listaProizvodaPos,
    uvediProizvod,
    proizvodPod,
    izmjenaProizvoda,
    obrisiProizvod,
    obrisiPoslovnicu,
    dodavanjeProizvodaSkladiste,
    preuzimanjeProizvoda,
    proizvodiIzPoslovnice,
    DropListaPoslovnica,
    ListaNarudzbi,
    dodavanjeNarudzbe,
    sviProizvodi,
    listaLogging,
    listaDostava,
    DropListaProizvoda,
    dodavanjeDostave,
    listaProizvodaUPos,
    dostavaPod,
    DropListaPoslovnica2,
    listaArtikalaUNaru,
    listaProizvodaUPos2,
    dodavanjeNaRacun,
    izmjenaArtikla
  },

  { token: null, errorMessage: "", dodan: "", list: null, edit: '', editD: '', list2: null, list2: null, listLo: null, listDo: null, listPP: null, listAR: null, list11: null }

);
