import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Accounts } from '../accounts';

// TODO ----> error TypeError: config._d.getTime is not a function
export const deleteAccount = new ValidatedMethod({
  name: 'deleteAccount',

  validate(id) {
    if (!id) {
      throw new Meteor.Error('Validation error', 'Id must not be null');
    }
  },

  run(id) {
    Accounts.remove(id);
  },
});

//TODO ---> on account update or delete, do the same operation for each accounting and installment linked to that account. (?)
