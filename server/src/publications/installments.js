import { InstallmentsCollection } from '../../../imports/api/installments';
import { Categories } from '../../../imports/api/categories';
import { Accounts } from '../../../imports/api/accounts';

Meteor.publish('installments.findAll', () => {
  return [InstallmentsCollection.find(), Categories.find(), Accounts.find()];
});
