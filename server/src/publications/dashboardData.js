import {AccountingEntries} from "../../../imports/api/accountingEntries";
import {InstallmentsCollection} from "../../../imports/api/installments";
import {Accounts} from "../../../imports/api/accounts";
import {Categories} from "../../../imports/api/categories";

Meteor.publish("dashboardData.fetchAll", function(filters) {
    const { payed = false, received = false , startRange, endRange} = filters;
    const dateQuery = {
        dueDate: { $gte: startRange, $lte: endRange},
    };
    const entries = AccountingEntries.find({
        payed: received,
        ...dateQuery,
    });

    const installments = InstallmentsCollection.find();
    const accounts = Accounts.find();
    const categories = Categories.find();

    return [entries, installments, accounts, categories];
})