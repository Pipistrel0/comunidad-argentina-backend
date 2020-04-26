const User = require('../models/users');
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
  async findOrCreateOne(googleId, email){
    const user = await User.findOne({$or:[{email: email}, {googleId: googleId}]});
    if(user){
      return user;
    }
    await this.createOne(email)
    return await this.getOneByEmail(email);
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