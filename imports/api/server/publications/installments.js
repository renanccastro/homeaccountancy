import { InstallmentsCollection } from '../../installments';
import { Accounts } from '../../accounts';
import { Categories } from '../../categories';

Meteor.publish('installments.findAll', () => {
  return [InstallmentsCollection.find(), Categories.find(), Accounts.find()];
});
