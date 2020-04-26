const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:{
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  role:{
    type: String,
    enum: ['guest', 'admin'],
    default: 'guest'
  },
  gender: {
    type: String,
    // required: true,
    enum: ["Hombre", "Mujer", "Otro"],
    trim: true
  },
  age: {
    type: Date,
    // required: true,
  },
  address: {
    type: String,
    required: true,
    maxlength: 255,
  },
  phone: {
    type: Number,
    // required: true,
  },
  ipAddress: {
    type: String,
    // required: true,
    maxlength: 15
  }
},
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema, 'users');

module.exports = User;

