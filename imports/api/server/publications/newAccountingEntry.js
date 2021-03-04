import { Accounts } from '../../accounts';
import { Categories } from '../../categories';

Meteor.publish('newAccounting.fetchAll', function () {
  const accounts = Accounts.find();
  const categories = Categories.find();

  return [accounts, categories];
});
