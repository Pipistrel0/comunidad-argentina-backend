const ApiKey = require('../models/apiKey');

class ApiKeyService{
  async getApiKey({token}){
    const apiKey = await ApiKey.findOne({token: token});
    return apiKey;
  }
}

module.exports = ApiKeyService;