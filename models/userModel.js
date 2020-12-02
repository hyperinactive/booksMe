const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// because of my use of passport magic to register users, "required" tags remain unused
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

module.exports = {
  userSchema: userSchema,
  User: User,
};
