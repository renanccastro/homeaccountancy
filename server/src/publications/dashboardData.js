import {AccountingEntries} from "../../../imports/api/accountingEntries";
import {InstallmentsCollection} from "../../../imports/api/installments";
import {Accounts} from "../../../imports/api/accounts";
import {Categories} from "../../../imports/api/categories";

Meteor.publish("dashboardData.fetchAll", function(filters) {
    const { payed = false, received = false , startRange, endRange} = filters;
    const dateQuery = {
        dueDate: { $gte: startRange, $lte: endRange},
    };
    const creditEntries = AccountingEntries.find({
        credit: true,
        payed: received,
        ...dateQuery,
    }).fetch();
    const debitEntries = AccountingEntries.find({
        credit: false,
        payed,
        ...dateQuery,
    }).fetch();

    const installments = InstallmentsCollection.find().fetch();
    const accounts = Accounts.find().fetch();
    const categories = Categories.find().fetch();


    creditEntries.forEach((currentVal) => {
        this.added("creditEntries", currentVal._id, currentVal);
    })

    debitEntries.forEach((currentVal) => {
        this.added("debitEntries", currentVal._id, currentVal);
    })

    installments.forEach((currentVal) => {
        this.added("installments", currentVal._id, currentVal)
    })

    accounts.forEach((currentVal) => {
        this.added("accounts", currentVal._id, currentVal)
    })

    categories.forEach((currentVal) => {
        this.added("categories", currentVal._id, currentVal)
    })

    this.ready()
})