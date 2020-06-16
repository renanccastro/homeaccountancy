import { Accounts } from '../../../imports/api/accounts';

Meteor.publish('accounts.findAll', () => {
  return Accounts.find();
});
