const {User, UserOauth} = require('../models/users');
const bcrypt = require('bcryptjs');


class UserService{
  async getAll(){
    const users = await User.find();
    return users || [];
  }
  async getOne(id){
    const user = await User.findById(id);
    return user;
  }
  async getOneByEmail(email){
    const user = await User.findOne({email: email});
    return user;
  }
  async findOrCreateOne(data){
    const userOauth = await User.findOne({$or:[{email: data.email}, {googleId: data.id}]});
    if(userOauth){
      return userOauth;
    }
    await this.createOneUserOauth(data)
    return await this.getOneByEmail(data.email);
  }
  async createOneUserOauth(data){    
    const newUserOauth = new UserOauth({
      googleId: data.id,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name
    });
    await newUserOauth.save();
  }
  
  async createOne(data){
    const passwordHashed = await bcrypt.hash(data.password, 10);
    const {
      email,
      firstName,
      lastName,
      role,
      gender,
      age,
      address,
      phone,
      ipAddress,
    } = data;
    const newUser = new User({
      email,
      password: passwordHashed,
      firstName,
      lastName,
      role,
      gender,
      age: new Date(age),
      address,
      phone,
      ipAddress,
    });
    await newUser.save();
    return newUser.id;
  }
  async updateOne(id, data){
    const passwordHashed = await bcrypt.hash(data.password, 10);
    const user = await User.findById(id);
    user.email = data.email;
    user.password = passwordHashed;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.role = data.role;
    user.gender = data.gender;
    user.age = data.age;
    user.address = data.address;
    user.phone = data.phone;
    user.ipAddress = data.ipAddress;
    await user.save()
  }
  async deleteOne(id){
    await User.findByIdAndDelete(id);
  }
}

module.exports = UserService;