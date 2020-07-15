import { Categories } from '../../categories';

Meteor.publish('categories.findAll', () => {
  return Categories.find();
});
