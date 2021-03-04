import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Categories } from '../categories';

export const addCategorie = new ValidatedMethod({
  name: 'addCategorie',

  validate(values) {
    if (!values) {
      throw new Meteor.Error('Validation error', 'Value must not be null');
    }
  },

  run(values) {
    Categories.insert({
      ...values,
      createdAt: new Date(),
    });
  },
});
