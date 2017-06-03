// No need to require mocha
// But we will need to require assert function
const assert = require('assert');

const User = require('../src/user');

describe('Creating records', () => {
  it('saves a user', (done) => {
    // 1) create instance of model
    const joe = new User({ name: 'Joe' });
    // 2) save model to our db   (save returns a promise)
    joe.save()
    // 3) write test to verify the save
      .then(() => {
        // Has joe been saved successfully?

        // when we create a new instance of a model, 
        // and it hasn't been saved yet, mongoose will automatically
        // place a flag on the model called isNew. If the record has not
        // been saved to the db, isNew will be true

        // (always want to assert a truthy value)
        assert(!joe.isNew);
        // done is a callback to tell mocha when an operation ends
        done();
      });
  });
});