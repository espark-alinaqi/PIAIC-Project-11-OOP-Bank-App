import inquirer from "inquirer";
import { Customer } from "./classes/customer.js";
import { DisplayInfo, ShowAccountBalance, Credit, Debit, TransactionHistory } from "./customerOptions.js";

const sleep = () => new Promise((r) => setTimeout(r, 2000));

let customers: Customer[] = [];

interface AccountOptions {
    option: 'C' | 'S';
}

async function Choice(): Promise<'C' | 'S'> {
    const { option }: AccountOptions = await inquirer.prompt([
        {
            name: "option",
            message: 'What Would You Like To Do ?',
            type: 'list',
            choices: [{ name: 'Create New Account', value: 'C' }, { name: 'Sign In', value: 'S' }]
        }
    ]);
    return option;
}

async function CreateNewAccount() {
    enum Names {
        Name = 'Name',
        Age = 'Age',
        ContactNumber = 'Contact Number',
        Pin = 'Pin',
        UserID = 'UserID'
    }

    async function Inputs(name: Names, type: string) {
        while (true) {
            const { input } = await inquirer.prompt([
                {
                    name: 'input',
                    message: `Enter Your ${name} : `,
                    type: type
                }
            ]);
            if (!input) {
                continue;
            }
            if (name === Names.ContactNumber) {
                let numRegex = /^(\+92|0|92)[0-9]{10}$/;
                if (!numRegex.test(input)) {
                    console.log(`  Use Pakistani Number`);
                    continue;
                }
            }
            if (name === Names.UserID) {
                let customer = customers.find((val) => val.userId === input);
                if (customer) {
                    console.log(`  This UserID Is Already Taken. Try a Different One.`);
                    continue;
                }
            }
            return input;
        }
    }

    let name = await Inputs(Names.Name, 'string');
    let age = await Inputs(Names.Age, 'number');
    let contactNumber = await Inputs(Names.ContactNumber, 'string');
    let pin = await Inputs(Names.Pin, 'number');
    let userId = await Inputs(Names.UserID, 'string');
    let customer = new Customer(name, age, contactNumber, pin, userId);
    await sleep();
    customers.push(customer);
    console.log(`Account Created Successfully`);
}

async function SignIn() {
    const { userID, pin }: { userID: string, pin: number } = await inquirer.prompt([
        {
            name: 'userID',
            message: "Enter Your UserID : ",
        },
        {
            name: 'pin',
            message: 'Enter Your Pin : ',
            type: 'number'
        }
    ]);

    let customer = customers.find((val) => val.userId === userID);

    if (!customer) {
        console.log(` No Customer With This UserID`);
        return;
    } else {
        if (customer.pin !== pin) {
            console.log(` Incorrect PIN`);
            return;
        }
        console.log('Signed In Successfully');

        while (true) {
            const { userChoice }: { userChoice: 'Show Profile' | 'Debit' | 'Credit' | 'Account Balance' | 'Transaction History' } = await inquirer.prompt([
                {
                    name: 'userChoice',
                    message: 'Make Your Choice',
                    type: 'rawlist',
                    choices: ['Show Profile', 'Debit', 'Credit', 'Account Balance', 'Transaction History']
                }
            ]);

            switch (userChoice) {
                case 'Show Profile':
                    DisplayInfo(customer);
                    break;
                case 'Account Balance':
                    ShowAccountBalance(customer);
                    break;
                case 'Credit':
                    await Credit(customer);
                    break;
                case 'Debit':
                    await Debit(customer);
                    break;
                case 'Transaction History':
                    TransactionHistory(customer);
                    break;
                default:
                    break;
            }

            const { choice }: { choice: 'Perform Another Task' | 'Sign Out' } = await inquirer.prompt([
                {
                    name: 'choice',
                    message: 'Select One: ',
                    type: "list",
                    choices: ['Perform Another Task', 'Sign Out']
                }
            ]);

            if (choice === 'Sign Out') {
                console.log(`\n------------------\n`);
                break;
            } else {
                console.log(`\n------------------\n`);
                continue;
            }
        }
    }
}

async function main() {
    while (true) {
        let choice = await Choice();
        if (choice === 'C') {
            await CreateNewAccount();
        } else if (choice === 'S') {
            await SignIn();
        }

        // EXIT PROGRAM CHOICE
        const input = await inquirer.prompt([
            {
                name: 'exit',
                message: `Do You Want To Exit?`,
                type: "confirm",
                default: false
            }
        ]);

        if (input.exit) {
            break;
        }

        console.log('\n---------------------');
        console.log('---------------------\n');
    }
}

main();
