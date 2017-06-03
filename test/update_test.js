'use strict'

const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
  let joe;

  beforeEach((done) => {
    joe = new User({ name: 'Joe', likes: 0 });
    joe.save()
      .then(() => done());
  })

  function assertName(operation, done) {
    // operation will be a promise
    operation
    // pass in empty object to return all the records
      .then(() => User.find({}))
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].name === 'Alex');
        done();
      })
  }

  it('instance type using set n save', (done) => {
    // not saved yet
    joe.set('name', 'Alex');
    assertName(joe.save(), done);
  });

  it('a model instance can update', (done) => {
    // update takes in an obj with props to update; updating all at once
    assertName(joe.update({ name: 'Alex' }), done);
  });

  it('a model class can update', (done) => {
    // update takes in a second arg for the update value
    assertName(
      User.update({ name: 'Joe' }, { name: 'Alex' }),
      done
    );
  });

  it('a model class can update one record', (done) => {
    assertName(
      User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }),
      done
    );
  });

  it('a model class can find a record with an Id and update', (done) => {
    assertName(
      User.findByIdAndUpdate(joe._id, { name: 'Alex' }),
      done
    );
  });

  // xit instead of it will x out the test and not run it
  it('a user can have their likes incremented by 1', (done) => {
    // mongo update operators / modifiers
    // these are more efficient than grabbing an entire record
    // load it up to our server. Then change it in some fashion and
    // send it back to our db
    // ie. increment, multiply, rename, set value, unset value, min, max

    User.update({ name: 'Joe' }, { $inc: { likes: 1 } })
      .then(() => User.findOne({ name: 'Joe' }))
      .then((user) => {
        assert(user.likes === 1);
        done();
      });
  });
});