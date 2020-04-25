const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apiKeySchema = new Schema(
  {
    token: { type: String },
    scopes:[{type: String}]
  },
  {
    timestamps: true,
  }
);

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = ApiKey;
