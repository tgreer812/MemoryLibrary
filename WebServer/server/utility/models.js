const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const agentSchema = new mongoose.Schema({
    uuid: String,
    name: String,
    ip: String,
    task_queue: String,      // this is a json string. See example_task_queue.json in PythonAgent
    last_seen: Date,
    active: Boolean,
    command_results: String,   // JSON string - these get populated directly from the agent. See commands.js for examples
    saved_addresses: String,   // this might be best as a json string?
});

const UserModel = mongoose.model('User', userSchema);
const AgentModel = mongoose.model('Agent', agentSchema);

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
module.exports = { UserModel, AgentModel };
