import { Accounts } from '../../accounts';

Meteor.publish('accounts.findAll', () => {
  return Accounts.find();
});
