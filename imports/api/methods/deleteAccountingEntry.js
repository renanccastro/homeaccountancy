import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { AccountingEntries } from '../accountingEntries';

export const deleteAccountingEntry = new ValidatedMethod({
  name: 'deleteAccountingEntry',
  validate({ entryId }) {
    if (!entryId) {
      throw new Meteor.Error('Validation error', 'Entry id shall not be null.');
    }
  },
  run({ entryId }) {
    AccountingEntries.remove(entryId);
  },
});
