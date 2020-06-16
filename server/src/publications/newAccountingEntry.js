import { Accounts } from '../../../imports/api/accounts';
import { Categories } from '../../../imports/api/categories';

Meteor.publish('newAccounting.fetchAll', function () {
  const accounts = Accounts.find();
  const categories = Categories.find();

  return [accounts, categories];
});
