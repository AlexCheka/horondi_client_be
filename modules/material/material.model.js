const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const Color = require('../../models/Color').schema;

const materialSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  colors: [Color],
  available: Boolean,
  additionalPrice: {
    type: [
      {
        currency: String,
        value: Number,
      },
    ],
    default: [
      {
        currency: String,
        value: 0,
      },
    ],
  },
});

module.exports = mongoose.model('Material', materialSchema);
