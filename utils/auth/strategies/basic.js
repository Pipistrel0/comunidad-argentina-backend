const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const bcrypt = require('bcryptjs');
const boom = require('@hapi/boom');

const UserService = require('../../../services/users');


passport.use(new BasicStrategy(async function(email, password, cb){
  const userService = new UserService();
  try {
    const user = await userService.getOneByEmail(email);

    if(!user){
      return cb(boom.unauthorized());
    }

    if(!(await bcrypt.compare(password, user.password))){
      return cb(boom.unauthorized());
    }

    delete user.password;
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));