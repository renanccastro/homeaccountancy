import {Accounts} from "../../../imports/api/accounts";
import {Categories} from "../../../imports/api/categories";

Meteor.publish("newAccounting.fetchAll", function() {
    const accounts = Accounts.find().fetch();
    const categories = Categories.find().fetch();

    accounts.forEach(currentVal => {
        this.added("accounts", currentVal._id, currentVal)
    })
    categories.forEach(currentVal => {
        this.added("categories", currentVal._id, currentVal)
    })

    this.ready();
})