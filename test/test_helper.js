const mongoose = require('mongoose');

// tells mongoose to use global.Promise instead
// global.Promise is the ES6 Promise library of nodejs env
mongoose.Promise = global.Promise;

// before vs beforeEach: before is only called one time before the
// whole test suite
before((done) => {
  mongoose.connect('mongodb://localhost/users_test');
  mongoose.connection
    .once('open', () => { done(); })
    .on('error', (error) => console.warn('Warning', error));
});

// Hook: a function that is executed before any tests are executed inside our test suite
// beforeEach is a hook that will run before each test in test suite
beforeEach((done) => {
  // empties out the users collections before each test run
  // drop takes in a callback
  // mongoose.connection.collections.users.drop(() => {
  //   // Ready to run the next test!
  //   done();
  // });

  // refactored for dropping multiple collections
  // notice how it is "blogposts" all lower case
  // this is because mongoose normalizes the collections
  const { users, comments, blogposts } = mongoose.connection.collections;
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});

// Every single function that we write inside mocha that we hand
// off to a 'beforeEach' or an 'it' or a 'describe' gets called 
// with a done callback.
// you execute done to tell mocha that the operation is done