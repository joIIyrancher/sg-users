const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User would be considered document.
// Post would be consideredsubdocuments
const PostSchema = new Schema({
	title: String
});

module.exports = PostSchema;