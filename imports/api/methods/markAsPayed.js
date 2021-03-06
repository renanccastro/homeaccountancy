import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { AccountingEntries } from '../accountingEntries';
import { getInstallmentNumber, InstallmentsCollection } from '../installments';

export const markAsPayed = new ValidatedMethod({
  name: 'markAsPayed',
  validate({ rowsIds, endDate }) {
    if (!rowsIds) {
      throw new Meteor.Error('Validation error', 'Rows must not be null');
    }
    if (!endDate) {
      throw new Meteor.Error('Validation error', 'EndDate must not be null');
    }
  },
  run({ rowsIds, endDate }) {
    rowsIds.forEach((rowId) => {
      const accountingEntry = AccountingEntries.findOne(rowId);
      if (!accountingEntry) {
        const { startDate } = InstallmentsCollection.findOne(rowId);
        const installment = getInstallmentNumber(startDate, endDate);
        InstallmentsCollection.update(rowId, {
          payedInstallments: { $pushToSet: installment },
        });
      } else {
        AccountingEntries.update(rowId, { $set: { payed: true } });
      }
    });
  },
});
