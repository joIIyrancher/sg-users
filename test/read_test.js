'use strict'

// mocha --watch has some compatibility issues with mongoose
// that's why we are using nodemon to watch for changes
// and exec mocha

const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {
  let joe, maria, alex, zach;
  beforeEach((done) => {
    // inserts a record with a name of joe just so that our
    // test can find it
    joe = new User({ name: 'Joe' });
    maria = new User({ name: 'Maria' });
    alex = new User({ name: 'Alex' });
    zach = new User({ name: 'Zach' });
    
    Promise.all([joe.save(), maria.save(), alex.save(), zach.save()])
      // save takes some time
      .then(() => done());
  });

  it('finds all users with a name of joe', (done) => {
    User.find({ name: 'Joe' })
      .then((users) => {
        assert(users[0]._id.toString() === joe._id.toString());
        done();
      });
  });

  it('find a user with a particular id', (done) => {
    // We are not converting _id to string because we are not
    // doing comparison
    User.findOne({ _id: joe._id })
      .then((user) => {
        assert(user.name === 'Joe');
        done();
      });
  });

  it('can skip and limit the result set', (done) => {
    // sort, skip and limit are query modifiers
    User.find({})
      // 1 = sort all the users by name in ascending order
      // -1 = sort all the users by name in descending order
      .sort({ name: 1 })
      .skip(1)
      .limit(2)
      .then((users) => {
        assert(users.length === 2);
        assert(users[0].name === 'Joe');
        assert(users[1].name === 'Maria');
        done();
      });
  });
});