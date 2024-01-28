import { Customer } from "./classes/customer.js";
import inquirer from "inquirer";

const sleep = () => new Promise((r) => setTimeout(r, 2000))

export function DisplayInfo(customer: Customer) {
    console.log("--------------------------------------");
    console.log(`Name            : ${customer.name}`);
    console.log(`Age             : ${customer.age}`);
    console.log(`Contact Number  : ${customer.contactNumber}`);
    console.log(`UserID          : ${customer.userId}`);
    console.log(`Account Balance : RS: ${customer.bankAccount.accountBalance}`);
    console.log(`Account Number  : ${customer.bankAccount.accountNumber}`);
    console.log("--------------------------------------");
}

export function ShowAccountBalance(customer: Customer) {
    console.log("--------------------------------------");
    console.log(`Account Balance : RS: ${customer.bankAccount.accountBalance}`);
    console.log("--------------------------------------");
}

export async function Credit(customer: Customer) {
    while (true) {
        const { amount } = await inquirer.prompt([{
            name: 'amount',
            message: 'Enter Amount : ',
            type: 'number'
        }]);

        await sleep();

        if (!amount) {
            console.error(" Enter Correct Amount");
            continue;
        }

        customer.bankAccount.Credit(amount);

        if (amount > 100) {
            console.log("Transaction Successful");
        } else {
            console.log("Transaction Successful And RS:1 Minus");
        }

        return;
    }
}

export async function Debit(customer: Customer) {
    while (true) {
        const { amount } = await inquirer.prompt([{
            name: 'amount',
            message: 'Enter Amount : ',
            type: 'number'
        }]);

        await sleep();

        if (!amount) {
            console.error(" Enter Correct Amount");
            continue;
        }

        if (amount > customer.bankAccount.accountBalance) {
            console.error(" Amount is Greater than Your Balance");
            return;
        }

        customer.bankAccount.Debit(amount);
        console.log("Transaction Successful");
        return;
    }
}

export function TransactionHistory(customer: Customer) {
    if (!customer.bankAccount.transactionHistory.length) {
        console.log(" No Transaction Available");
        return;
    }

    console.table(customer.bankAccount.transactionHistory.map((val) => {
        return { ...val, fee: `RS: ${val.fee}`, amount: `RS: ${val.amount}` };
    }));
}
