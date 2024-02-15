const mongoose = require("mongoose");

const dostavaSchema = mongoose.Schema({
  nazivProizvoda: {
    type: String,
    required: true,
  },
  nazivPoslovnice: {
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
  stanje: {
    type: String,
    required: true,
    default: 'poslan'
  }
});


module.exports = mongoose.model("Dostava", dostavaSchema);
