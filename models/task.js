var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Task List Schema
var taskSchema = new Schema ({
	task: String,
	user: {
		type: Schema.ObjectId,
		ref:"users"
	},
});

mongoose.model('tasks', taskSchema);