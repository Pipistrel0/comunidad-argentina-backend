const router = require('express').Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

router.route('/').get(async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.route('/sing-up').post(async function (req, res, next) {
  try {
    const passwordHashed = await bcrypt.hash(req.body.password, 10);
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
    } = req.body;
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
    res.status(200).json('User added');
  } catch (err) {
    next(err);
  }
});

router.route('/:id').get(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.route('/update/:id').put(async (req, res, next) => {
  try {
    const passwordHashed = bcrypt.hash(req.body.password, 10);
    const user = await User.findById(req.params.id);

    user.email = req.body.email;
    user.password = passwordHashed;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.role = req.body.role;
    user.gender = req.body.gender;
    user.age = req.body.age;
    user.address = req.body.address;
    user.phone = req.body.phone;
    user.ipAddress = req.body.ipAddress;

    res.status(200).json('User Updated');
  } catch (err) {
    next(err);
  }
});

router.route('/:id').delete(async (req, res, next) => {
  try {
    const userDeleted = await User.findByIdAndDelete(req.params.id);
    if (userDeleted) {
      res.status(200).json('User deleted');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
