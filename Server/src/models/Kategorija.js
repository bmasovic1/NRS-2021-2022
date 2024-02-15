const mongoose = require("mongoose");

const kategorijaSchema = mongoose.Schema({
  naziv: {
    type: String,
    required: true,
  },
  PDV: {
    type: String,
    required: true,
  }

});


module.exports = mongoose.model("Kategorija", kategorijaSchema);
