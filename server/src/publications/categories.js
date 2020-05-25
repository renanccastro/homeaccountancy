import {Categories} from "../../../imports/api/categories";

Meteor.publish("categories.findAll", () => {
    return Categories.find();
})