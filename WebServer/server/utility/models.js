const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserModel = mongoose.model('User', userSchema);

const testUser = new UserModel({
  username: 'Tyler',
  password: 'test',
});

// if test user isn't already in the UserModel add it
UserModel.find({username: 'Tyler'}).exec()
  .then((foundUsers) => {
    if (foundUsers.length === 0) {
      console.log('User not found! Adding Tyler user...');
      testUser.save();
    }
  })
  .catch((err) => {
    console.log(err);
  });


//export models
module.exports = { UserModel };
