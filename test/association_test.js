const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');
const Comment = require('../src/comment');

describe('Associations', () => {
	let joe, blogPost, comment;
	beforeEach((done) => {
		joe = new User({ name: 'Joe' });
		blogPost = new BlogPost({ title: 'JS is great!', content: 'Yes it is!' });
		comment = new Comment({ content: 'Congrats on a great post!' });

		// form up association in a direct manner
		joe.blogPosts.push(blogPost);
		blogPost.comments.push(comment);
		comment.user = joe;

		Promise.all([joe.save(), blogPost.save(), comment.save()])
			.then(() => done());
	});

	// it.only will be the only test running so we don't run the other tests
	it('saves a relation between a user and a blogpost', (done) => {
		User.findOne({ name: 'Joe' })
			// can add modifiers to enhance the query in some way
			.populate('blogPosts')
			// .then executes the query;
			.then((user) => {
				assert(user.blogPosts[0].title === 'JS is great!');
				assert(user.blogPosts[0].content === 'Yes it is!');
				done();
			});
	});

	it('saves a full relationship graph', (done) => {
		User.findOne({ name: 'Joe' })
			.populate({
				// configuration option
				path: 'blogPosts',
				populate: {
					// when populating deeper, will need to specify the model to unravel with
					path: 'comments',
					model: 'comment',
					populate: {
						path: 'user',
						model: 'user'
					}
				}
			})
			.then((user) => {
				assert(user.name === 'Joe');
				assert(user.blogPosts[0].title === 'JS is great!');
				assert(user.blogPosts[0].comments[0].content === 'Congrats on a great post!');
				assert(user.blogPosts[0].comments[0].user.name === 'Joe');
				done();
			});
	});
});

// mongoose events init, validate, save, remove
// we can write middleware before each type of events