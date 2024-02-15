const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const Proizvod = require("../models/Proizvod.js");
const Log = require("../models/Log.js");
const Poslovnica = require("../models/Poslovnica.js");
const Narudzba = require("../models/Narudzba.js");
const Dostava = require("../models/Dostava.js");
const Artikl = require("../models/Artikl.js");
const Kategorija = require("../models/Kategorija.js");

const router = express.Router();

router.post("/singout", async (req, res) => {
  let user = req.body;
  let tipKorisnika = "Korisnik";
  if (user.email === "admin") tipKorisnika = "Admin";

  const log = new Log({
    korisnikId: user.id,
    korisnikEmail: user.email,
    tipKorisnika: tipKorisnika,
    tipAkcije: "SIGNOUT",
    vrijeme: new Date().toLocaleString("en-GB"),
    opisAkcije: `Odjava korisnika '${user.email}'`,
  });

  try {
    await log.save();
    res.status(200).send({});
  } catch (err) {
    console.error(err);
    res.status(422).send({ err });
  }
});

router.post("/signup", async (req, res) => {
  const {
    email,
    password,
    ime,
    prezime,
    jmbg,
    omiljenaBoja,
    omiljenaZivotinja,
  } = req.body;

  try {
    var tip = "Korisnik";
    const user = new User({
      email,
      password,
      ime,
      prezime,
      jmbg,
      omiljenaBoja,
      omiljenaZivotinja,
      tip,
    });
    const log = new Log({
      korisnikId: user._id,
      korisnikEmail: user.email,
      tipKorisnika: "Korisnik",
      vrijeme: new Date().toLocaleString("en-GB"),
      opisAkcije: `Korisnik '${user.email}' uspjesno registrovan`,
    });
    await user.save();
    await log.save();

    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token, id: user._id, email: user.email });
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.post("/dodaj", async (req, res) => {
  const {
    email,
    password,
    ime,
    prezime,
    jmbg,
    omiljenaBoja,
    omiljenaZivotinja,
    value,
    poslovnica
  } = req.body;

  try {
    var tip = value;
    const user = new User({
      email,
      password,
      ime,
      prezime,
      jmbg,
      omiljenaBoja,
      omiljenaZivotinja,
      tip,
      poslovnica
    });
    const log = new Log({
      korisnikId: user._id,
      korisnikEmail: user.email,
      tipKorisnika: "Admin",
      tipAkcije: "CREATE",
      vrijeme: new Date().toLocaleString("en-GB"),
      opisAkcije: `Korisnik '${user.email}' uspjesno dodan od strane administratora`,
    });
    await user.save();
    await log.save();

    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token, id: user._id, email: user.email });
  } catch (err) {
    res.status(422).send({ error: "greska" });
  }
});

router.post("/dodajPos", async (req, res) => {
  const { naziv, grad, adresa } = req.body;
  try {
    const posl = new Poslovnica({
      naziv: naziv,
      grad: grad,
      adresa: adresa,
      proizvodi: [],
    });
    await posl.save();
    res.send({ naziv: posl.naziv });
  } catch (err) {
    res.status(422).send({ error: "greska" });
  }
});

router.post("/dodajProSkladiste", async (req, res) => {
  const { naziv, kolicina, jedinica, cijena } = req.body;
  try {
    const proizvod = new Proizvod({
      naziv,
      kolicina,
      jedinica,
      cijena,
    });
    await proizvod.save();
    console.log("proizvod dodan u skladiste");
    res.send({ proizvod });
  } catch (err) {
    res.status(422).send({ error: "greska" });
  }
});


router.get("/uvediPro/:naziv", async (req, res) => {           /////////////////////////////////////////////////////////////////RUTA ZA UVODJENJE PROIZVODA U POSLOVNICU//////////////////////////////////////////////////////////

  const proizvod = await Proizvod.findOne({ naziv: req.params.naziv });

  res.send({ proizvod });
});


router.post("/uvediPro", async (req, res) => {
  /////////////////////////////////////////////////////////////////RUTA ZA UVODJENJE PROIZVODA U POSLOVNICU//////////////////////////////////////////////////////////
  const {naziv_poslovnice, stringparam} = req.body;

  try {
    const poslovnica = await Poslovnica.findOne({ naziv: naziv_poslovnice });


    if(poslovnica) {
      const stara_adresa = poslovnica.adresa;
      const stari_grad = poslovnica.grad;
      const novi_proizvodi = [];

      for(var i=0;i<poslovnica.proizvodi.length;i++) {
        novi_proizvodi.push(poslovnica.proizvodi[i]);  
      }

      novi_proizvodi.push(stringparam); 

      await Poslovnica.updateOne(
        {
          naziv: naziv_poslovnice
        },
        {
          $set: {
            proizvodi: novi_proizvodi,
          },
        }
      );

      await Dostava.updateOne(
        {
          _id: stringparam
        },
        {
          $set: {
            stanje: "Primljen",
          },
        }
      );

      res.send({ poruka: "uspjesno" });
    }
    else {
      res.send("Ne postoji poslovnica");
    }    
  } catch (err) {
    res.status(422).send({ error: "greska" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "Polja email i password ne smiju biti prazna" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ error: "Nepravilan email ili password" });
  }

  try {
    let korisnik = "Korisnik";
    if (user.email === "admin") korisnik = "Admin";

    const log = new Log({
      korisnikId: user._id,
      korisnikEmail: user.email,
      tipKorisnika: korisnik,
      tipAkcije: "LOGIN",
      vrijeme: new Date().toLocaleString("en-GB"),
      opisAkcije: `Korisnik '${user.email}' se prijavio u aplikaciju`,
    });
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    await log.save();
    res.send({ token, id: user._id, email: user.email });
  } catch (err) {
    return res.status(422).send({ error: "Nepravilan email ili password" });
  }
});

router.post("/korisnikEdit", async (req, res) => {
  const {email,password,ime,prezime,jmbg,omiljenaBoja,omiljenaZivotinja,value,poslovnica} = req.body;

  try {
    var tip = value;
    const izmjena = new User({email,password,ime,prezime,jmbg,omiljenaBoja,omiljenaZivotinja,tip, poslovnica});

    await User.updateOne(
      {
        jmbg: izmjena.jmbg,
      },
      {
        $set: {
          email: izmjena.email,
          password: izmjena.password,
          ime: izmjena.ime,
          prezime: izmjena.prezime,
          omiljenaBoja: izmjena.omiljenaBoja,
          omiljenaZivotinja: izmjena.omiljenaZivotinja,
          tip: izmjena.tip,
          poslovnica: izmjena.poslovnica,
        },
      }
    );
    const log = new Log({
      korisnikId: izmjena._id,
      korisnikEmail: izmjena.email,
      tipKorisnika: "Korisnik",
      tipAkcije: "EDIT",
      vrijeme: new Date().toLocaleString("en-GB"),
      opisAkcije: `Promjenjeni podaci korisniku:'${izmjena.email}'`,
    });
    const user = await User.findOne({ jmbg });
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    await log.save();
    res.send({ token });
  } catch (err) {
    res.status(422).send({ error: "greska" });
  }
});

router.post("/proizvodEdit", async (req, res) => {
  const { nazivS, naziv, kolicina, jedinica, cijena } = req.body;
  try {
    const izmjena = new Proizvod({ naziv, kolicina, jedinica, cijena });
    await Proizvod.updateOne(
      {
        naziv: nazivS,
      },
      {
        $set: {
          naziv: izmjena.naziv,
          kolicina: izmjena.kolicina,
          jedinica: izmjena.jedinica,
          cijena: izmjena.cijena
        },
      }
    );
    res.send("radi");
  } catch (err) {
    res.status(422).send({ error: "greska" });
  }
});

router.post("/preuzimanjePro/:nazivS", async (req,res) => {
   const naziv = req.params.nazivS;
   
   try {
     
     await Proizvod.updateOne(
       {
         naziv:naziv,
       },
       {
         $set: {
           stanje:"primljen"
         }
       }
     )
     res.send("radi preuzimanje");
   }catch(err) {
    res.status(422).send({ error: "greska" });
  }
 });

 router.get("/korisnici", async (req, res) => {
  const korisnici = await User.find();

  let listaKo = [];

  for (i = 2; i < korisnici.length; i++) {
    let temp = {
      korisnik: {
        id: korisnici[i]._id,
        email: korisnici[i].email,
        ime: korisnici[i].ime,
        prezime: korisnici[i].prezime,
        tip: korisnici[i].tip,
      },
    };
    listaKo.push(temp);
  }

  res.send({ listaKo: listaKo });
});

router.get("/korisnikPodaci/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  res.send({ user });
});

router.get("/proizvodPodaci/:naziv", async (req, res) => {
  const proizvod = await Proizvod.findOne({ naziv: req.params.naziv });
  res.send({ proizvod });
});

router.get("/korisnici", async (req, res) => {
  const user = await User.find();

  let rez = `{"lista" : [{`;

  for (i = 1; i < user.length; i++) {
    rez +=
      `"id":` + `"` + i + `"` + `,"email":` + `"` + user[i].email + `"` + "},{";
  }

  rez = rez.slice(0, -1);
  rez = rez.slice(0, -1);

  rez += "]}";

  res.send(JSON.parse(rez));
});

router.get("/korisnikPodaci/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  res.send({ user });
});

router.get("/proizvodPodaci/:naziv", async (req, res) => {
  const proizvod = await Proizvod.findOne({ naziv: req.params.naziv });
  res.send({ proizvod });
});

router.delete("/izbrisiPro/:naziv", async (req, res) => {
  const proizvod = await Proizvod.findOne({ naziv: req.params.naziv });

  if (proizvod) {
    Proizvod.deleteOne(
      {
        naziv: req.params.naziv,
      },
      function (err, proizvod) {
        if (err) res.send("Ne postoji proizvod");

        console.log("User successfully removed!");
        res.send("proizvod Izbrisan");
      }
    );
  } else res.send("proizvod ne postoji");
});

router.delete("/izbrisi/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  console.log("email:" + req.params.email);

  if (user) {
    User.deleteOne(
      {
        email: req.params.email,
      },
      function (err, user) {
        if (err) res.send("Ne postoji korisnik");

        console.log("User successfully removed!");
      }
    );

    const log = new Log({
      korisnikId: "626c12c41d882e3f8377c041",
      korisnikEmail: "admin",
      tipKorisnika: "Admin",
      tipAkcije: "DELETE",
      vrijeme: new Date().toLocaleString("en-GB"),
      opisAkcije: `Izbrisan korisnik:'${user.email} od strane administratora'`,
    });
    await log.save();
    

  }

  res.send("Korisnik Izbrisan");

});

router.post("/dodajProizvod", async (req, res) => {
  const { naziv, kolicina, jedinica, cijena } = req.body;

  try {
    const proizvod = new Proizvod({ naziv, kolicina, jedinica, cijena });

    await proizvod.save();

    res.send(proizvod);
  } catch (err) {
    res.status(422).send({ error: "greska" });
  }
});

router.get("/proizvodi", async (req, res) => {
  
  const proizvodi = await Proizvod.find();

  let listaP = [];

  for (i = 0; i < proizvodi.length; i++) {
    let temp = {
      proizvod: {
        id: proizvodi[i]._id,
        naziv: proizvodi[i].naziv,
        kolicina: proizvodi[i].kolicina,
        jedinica: proizvodi[i].jedinica,
        cijena: proizvodi[i].cijena,
      },
    };
    listaP.push(temp);
  }

  res.send({ listaP: listaP });


  
});

router.get("/poslovnice", async (req, res) => {
  const poslovnice = await Poslovnica.find();

  let listaPoslovnica = [];

  for (i = 0; i < poslovnice.length; i++) {
    let temp = {
      poslovnica: {
        id: poslovnice[i]._id,
        naziv: poslovnice[i].naziv,
        grad: poslovnice[i].grad,
        adresa: poslovnice[i].adresa,
        proizvodi: poslovnice[i].proizvodi,
      },
    };
    listaPoslovnica.push(temp);
  }

  res.send({ listaPoslovnica: listaPoslovnica });
});

router.delete("/poslovnice/:id", (req, res) => {
  Poslovnica.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => console.error(error));
});

router.get("/narudzbe/:idKorisnik", async (req, res) => {
  

  const narudzbe = await Narudzba.find(  { 'idKorisnik': req.params.idKorisnik });

  let listaNarudzbi = [];

  for (i = 0; i < narudzbe.length; i++) {

    let temp = {
      narudzba: {
        id: narudzbe[i]._id,
        naziv: narudzbe[i].naziv,
        stol: narudzbe[i].stol,
        nazivPoslovnce: narudzbe[i].poslovnica,
      },
    };
    listaNarudzbi.push(temp);
  }


  res.send({ listaNarudzbi: listaNarudzbi });
});

router.post("/dodajNarudzbu", async (req, res) => {


  const { naziv, idKorisnik, stol } = req.body;

  try {


    const kor = await User.findOne( { _id: idKorisnik })
    const pos = await Poslovnica.findOne(  { naziv: kor.poslovnica });
    const idPoslovnice = pos._id

    const narudzbe = new Narudzba({ naziv, stol, idKorisnik, idPoslovnice });


    await narudzbe.save();

    res.send(narudzbe);

  } catch (err) {
    console.log(err)
    res.status(422).send({ error: "greska" });
  }
});

router.post("/proizvodi-poslovnice", async (req, res) => {
  try {
    let proizvodi = await Proizvod.find({ _id: { $in: req.body.proizvodi } });

    res.send({ listaProizvoda: proizvodi });
  } catch (err) {
    console.log("Error sa bazom podataka");
    console.error(err);

  }
});

router.get("/logging", async (req, res) => {
  const loggings = await Log.find();

  let listaLOG = [];

  for (i = 0; i < loggings.length; i++) {
    let temp = {
      logg: {
        id: loggings[i]._id,
        tipAkcije: loggings[i].tipAkcije,
        opisAkcije: loggings[i].opisAkcije,
      },
    };
    listaLOG.push(temp);
  }

  res.send({ listaLOG: listaLOG });
});

router.post("/dodajDostavu", async (req, res) => {
  const { nazivProizvoda, nazivPoslovnice, kolicina } = req.body;

  const proizvod = await Proizvod.findOne({ naziv: nazivProizvoda });

  try {
    const dostava = new Dostava({
      nazivProizvoda: nazivProizvoda,
      nazivPoslovnice: nazivPoslovnice,
      kolicina: kolicina,
      jedinica: proizvod.jedinica,
      cijena: proizvod.cijena

    });
    await dostava.save();

    //const proizvod = await Proizvod.findOne({ naziv: nazivProizvoda });


    await Proizvod.updateOne(
      {
        naziv: nazivProizvoda
      },
      {
        $set: {
          kolicina: proizvod.kolicina-kolicina,
        },
      }
    );

    res.send({ dostava: dostava });
  } catch (err) {
    console.log(err)
    res.status(422).send({ error: "greska" });
  }
});

router.get("/dostave", async (req, res) => {
  const dostave = await Dostava.find();

  let listaDo = [];

  for (i = 0; i < dostave.length; i++) {
    let temp = {
      dostava: {
        id: dostave[i]._id,
        nazivProizvoda: dostave[i].nazivProizvoda,
        nazivPoslovnice: dostave[i].nazivPoslovnice,
        kolicina: dostave[i].kolicina,
        stanje: dostave[i].stanje,
      },
    };
    listaDo.push(temp);
  }

  res.send({ listaDo: listaDo });
});

router.get("/proizvodiUPoslovnici/:naziv", async (req, res) => {

  const poslovnica = await Poslovnica.findOne({ naziv: req.params.naziv });
  
  console.log(poslovnica.proizvodi[0])

  let listaPR = [];

  for (i = 0; i < poslovnica.proizvodi.length; i++) {

    const proizvod = await Dostava.findOne({ _id: poslovnica.proizvodi[i] });

    //console.log(i+" "+proizvod)

    let temp = {
      proizvod: {
        id: proizvod._id,
        naziv: proizvod.nazivProizvoda,
        kolicina: proizvod.kolicina,
        jedinica: proizvod.jedinica,
        cijena: proizvod.cijena,

      },
    };
    listaPR.push(temp);
  }

  res.send({ listaPR: listaPR });
});


router.get("/dostavaPodaci/:id", async (req, res) => {
  const dostava = await Dostava.findOne({ _id: req.params.id });
  console.log(dostava)
  res.send({ dostava });
});

router.post("/uvediArtikl", async (req, res) => {

  const {narudzbaN, idDostave, nazivProizvoda, kolicina} = req.body;

  try {


    const pro = await Proizvod.findOne({ naziv: nazivProizvoda });

    let cijena = pro.cijena;
    let jedinica =  pro.jedinica;

    const artikll = await new Artikl({nazivProizvoda, kolicina, jedinica, cijena});

    await artikll.save();

    const dos = await Dostava.findOne({ naziv: narudzbaN });

    await Dostava.updateOne(
      {
        _id: idDostave
      },
      {
        $set: {
          kolicina: parseInt(dos.kolicina) - parseInt(kolicina),
        },
      }
    );



    const nar = await Narudzba.findOne({ naziv: narudzbaN });

      const novi_proizvodi = [];

      for(var i=0;i<nar.artikli.length;i++) {
        novi_proizvodi.push(nar.artikli[i]);  
      }

      novi_proizvodi.push(artikll._id); 

      await Narudzba.updateOne(
        {
          naziv: narudzbaN
        },
        {
          $set: {
            artikli: novi_proizvodi,
          },
        }
      );

      res.send({ poruka: "uspjesno" });

  } catch (err) {
    console.log(err)
    res.status(422).send({ error: "greska" });
  }
});

router.get("/artikliUNarudzbi/:naziv", async (req, res) => {

  const naru = await Narudzba.findOne({ naziv: req.params.naziv });
  
  let listaAR = [];

  for (i = 0; i < naru.artikli.length; i++) {

    const proizvod = await Artikl.findOne({ _id: naru.artikli[i] });

    //console.log(i+" "+proizvod)

    let temp = {
      artikl: {
        id: proizvod._id,
        nazivProizvoda: proizvod.nazivProizvoda,
        kolicina: proizvod.kolicina,
        jedinica: proizvod.jedinica,
        cijena: proizvod.cijena,

      },
    };
    listaAR.push(temp);
  }

  res.send({ listaAR: listaAR });
});

router.get("/proizvodiUPoslovnici2/:korisnik", async (req, res) => {

  const user = await User.findOne({ email: req.params.korisnik });


  const poslovnica = await Poslovnica.findOne({ naziv: user.poslovnica });
  

  let listaPR = [];

  for (i = 0; i < poslovnica.proizvodi.length; i++) {

    const proizvod = await Dostava.findOne({ _id: poslovnica.proizvodi[i] });

    //console.log(i+" "+proizvod)

    let temp = {
      proizvod: {
        id: proizvod._id,
        naziv: proizvod.nazivProizvoda,
        kolicina: proizvod.kolicina,
        jedinica: proizvod.jedinica,
        cijena: proizvod.cijena,

      },
    };
    listaPR.push(temp);
  }


  res.send({ listaPR: listaPR });
});

router.post("/artiklEdit", async (req, res) => {
  const { kolicina, naziv } = req.body;
  try {
    const proizvoddd = await Artikl.findOne({ naziv: "Limun" });
    
    await Artikl.updateOne(
      {
        naziv: naziv,
      },
      {
        $set: {
          kolicina: kolicina
        },
      }
    );
    res.send("radi artikl edit");
  } catch (err) {
    console.log(err)
    res.status(422).send({ error: "greska" });
  }
});

router.post("/dodajKategoriju", async (req, res) => {
  const { naziv, PDV } = req.body;

  try {

    const proizvod = new Kategorija({ naziv, PDV });

    await proizvod.save();

    res.send(proizvod);
  } catch (err) {
    res.status(422).send({ error: "greska" });
  }
});

router.get("/kategorije", async (req, res) => {
  const korisnici = await Kategorija.find();

  let listaKa = [];

  for (i = 0; i < korisnici.length; i++) {
    let temp = {
      korisnik: {
        id: korisnici[i]._id,
        naziv: korisnici[i].naziv,
        PDV: korisnici[i].PDV,
      },
    };
    listaKa.push(temp);
  }

  res.send({ listaKa: listaKa });
});
module.exports = router;
