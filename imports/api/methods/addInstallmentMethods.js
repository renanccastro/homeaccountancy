import {Meteor} from "meteor/meteor";
import {InstallmentsCollection} from "../installments";
import {Accounts} from "../accounts";
import keyBy from "lodash.keyby";


export const addInstallment = {
    name: "addInstallment",

    validate({startMonth, startDate, ...values }){
        if (!startMonth || !startDate) {
            throw new Meteor.Error("Validation error", "Date must not be null");
        }
    },

    run({startMonth, startDate, ...values }){
        const { accountMap } =
            {
                accountMap: keyBy(Accounts.find().fetch(), '_id'),
            };
        const { dueDate } = accountMap[values.accountId];
        InstallmentsCollection.insert({
            ...values,
            startDate: dueDate
                ? startMonth.set('date', dueDate).toDate()
                : values.startDate.toDate(),
            purchaseDate: values.dueDate?.toDate(),
            finished: false,
            payedInstallments: [],
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
    [addInstallment.name]: function (args) {
        addInstallment.validate.call(this, args);
        addInstallment.run.call(this, args);
    },
})