import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Categories } from '../categories';

export const deleteCategorie = new ValidatedMethod({
  name: 'deleteCategorie',

  validate(id) {
    if (!id) {
      throw new Meteor.Error('Validation error', 'Id must not be null');
    }
  },

  run(id) {
    Categories.remove(id);
  },
});

//TODO ---> on categorie update or delete, do the same operation for each accounting and installment linked to that account. (?)
