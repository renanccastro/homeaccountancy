import {AccountingEntries} from "../../../imports/api/accountingEntries";

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

    creditEntries.forEach((currentVal) => {
        this.added("creditEntries", currentVal._id, currentVal);
    })

    debitEntries.forEach((currentVal) => {
        this.added("debitEntries", currentVal._id, currentVal);
    })

    this.ready()
})