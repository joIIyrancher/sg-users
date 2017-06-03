const mongoose = require('mongoose');
const PostSchema = require('./post');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
  	type: String,
  	validate: {
  		validator: (name) => name.length > 2,
  		message: 'Name must be longer than 2 characters.'
  	},
  	required: [true, 'Name is required.']
  },
  likes: Number,
  posts: [PostSchema], // array of post schemas
  blogPosts: [{
  	type: Schema.Types.ObjectId,
  	ref: 'blogPost'
  }]
});
// mongoose is able to infer that [PostSchema] is a subdocument

// need to use function key word and not use a fat arrow function
// The reason for not using '=>' is because 'this' inside a fat arrow
// function is the file itself and not the user created
UserSchema.virtual('postCount').get(function() {
	return this.posts.length;
});

// model instance is available as 'this', inside of 'function()' but not inside of '=>' function
UserSchema.pre('remove', function(next) {
	// this === joe
	// using mongoose.model would avoid cyclical loading issue
	const BlogPost = mongoose.model('blogPost');

	BlogPost.remove({ _id: { $in: this.blogPosts } })
		.then(() => next());
});

// 'user' would be the name of our collection in mongo
// UserSchema specifies properties in creating a user
const User = mongoose.model('user', UserSchema);

module.exports = User;