import { Meteor } from "meteor/meteor";
import {AccountingEntries} from "../accountingEntries";
import {getInstallmentNumber, InstallmentsCollection} from "../installments";


export const markAsPayed = {
    name: "markAsPayed",

    validate({rows, endDate}){
        if (!rows) {
            throw new Meteor.Error("Validation error", "Rows must not be null" )
        }
    },

    run({rows, endDate}){
        rows.forEach( row => {
            const { _id } = row;
            const accountingEntry = AccountingEntries.findOne(_id);
            if (!accountingEntry) {
                const { startDate } = InstallmentsCollection.findOne(_id);
                const installment = getInstallmentNumber(startDate, endDate);
                InstallmentsCollection.update(_id, {
                    payedInstallments: { $pushToSet: installment },
                });
            } else {
                AccountingEntries.update(_id, { $set: { payed: true } });
            }
        });
    },

    call(args, callback) {
        const options = {
            returnStubValue: true,
            throwStubExceptions: true,
        }

        Meteor.apply(this.name, [args], options, callback);
    },
}

Meteor.methods({
    [markAsPayed.name]: function (args) {
        markAsPayed.validate.call(this, args);
        markAsPayed.run.call(this, args);
    }
})