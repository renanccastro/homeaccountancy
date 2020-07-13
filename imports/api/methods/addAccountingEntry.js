import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { AccountingEntries } from '../accountingEntries';
import keyBy from 'lodash.keyby';
import { Accounts } from '../accounts';
// TODO ----> error TypeError: config._d.getTime is not a function

export const addAccounting = new ValidatedMethod({
  name: 'addAccounting',

  validate({ startMonth, updateId, ...values }) {
    if (!values) {
      throw new Meteor.Error('Validation error', 'Value must not be null');
    }
  },

  run({ startMonth, updateId, ...values }) {
    const accountsMap = keyBy(Accounts.find().fetch(), '_id');
    const { dueDate } = accountsMap[values.accountId];
    const dates = {
      dueDate: dueDate
        ? startMonth.set('date', dueDate).toDate()
        : values.dueDate.toDate(),
      purchaseDate: values.purchaseDate?.toDate(),
    };

    if (updateId) {
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
