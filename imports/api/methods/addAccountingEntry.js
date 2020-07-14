import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { AccountingEntries } from '../accountingEntries';
import keyBy from 'lodash.keyby';
import { Accounts } from '../accounts';

export const addAccounting = new ValidatedMethod({
  name: 'addAccounting',

  validate(values) {
    if (!values) {
      throw new Meteor.Error('Validation error', 'Value must not be null');
    }
  },

  run({ startMonth, id, ...values }) {
    const accountsMap = keyBy(Accounts.find().fetch(), '_id');
    const { dueDate } = accountsMap[values.accountId];
    const dates = {
      dueDate: dueDate ? startMonth : values.dueDate,
      purchaseDate: values.purchaseDate,
    };

    if (id) {
      AccountingEntries.update(id, {
        $set: {
          ...values,
          ...dates,
          updatedAt: new Date(),
        },
      });
      return;
    }
    AccountingEntries.insert({
      ...values,
      ...dates,
      createdAt: new Date(),
    });
  },
});
