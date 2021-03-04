import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Accounts } from '../accounts';

export const addAccount = new ValidatedMethod({
  name: 'addAccount',

  validate({ updateId, ...values }) {
    if (!values) {
      throw new Meteor.Error('Validation error', 'Value must not be null');
    }
  },

  run({ updateId, ...values }) {
    if (updateId) {
      Accounts.update(updateId, {
        $set: {
          ...values,
          updatedAt: new Date(),
        },
      });
      return;
    }
    Accounts.insert({
      ...values,
      createdAt: new Date(),
    });
  },
});
