const mongoose = require("mongoose");

const artiklSchema = mongoose.Schema({

  nazivProizvoda: {
    type: String,
    required: true,
  },
  kolicina: {
    type: String,
    required: true,
  },
  jedinica: {
    type: String,
    required: true,
  },
  cijena: {
    type: String,
    required: true,
  },

});


module.exports = mongoose.model("Artikl", artiklSchema);
