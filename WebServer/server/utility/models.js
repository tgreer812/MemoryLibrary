const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const taskSchema = new mongoose.Schema({
  taskid: Number,
  command: String,
  arguments: [String],
}, { _id: false });

const agentSchema = new mongoose.Schema({
  uuid: String,
  name: String,
  ip: String,
  task_queue: [taskSchema],
  last_seen: Date,
  active: Boolean,
  command_results: mongoose.Schema.Types.Mixed,
  saved_addresses: Object,
});

const UserModel = mongoose.model('User', userSchema);
const AgentModel = mongoose.model('Agent', agentSchema);
const TaskModel = mongoose.model('Task', taskSchema);

const testUser = new UserModel({
  username: 'Tyler',
  password: 'test',
});

UserModel.find({ username: 'Tyler' }).exec()
  .then((foundUsers) => {
    if (foundUsers.length === 0) {
      console.log('User not found! Adding Tyler user...');
      testUser.save();
    }
  })
  .catch((err) => {
    console.log(err);
  });

const uuid = '1c25be98-15cb-4597-bee3-12c8ca62685c';
const initialTask = {
    taskid: 2,
    command: 'process_list',
    arguments: ['--maxprocesses', '0'],
};

AgentModel.findOne({ uuid }).exec()
    .then((foundAgent) => {
        if (!foundAgent) {
            console.log('Agent not found! Creating agent...');
            const newAgent = new AgentModel({
                uuid,
                name: '',
                ip: '::ffff:127.0.0.1',
                task_queue: [initialTask],
                last_seen: new Date(),
                active: true,
                command_results: {},
                saved_addresses: {},
            });
            newAgent.save();
        }
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = { UserModel, AgentModel, TaskModel };
