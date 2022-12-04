import { Accounts } from "src/accounts/schemas/accounts.schema";

export const ACCOUNTS_MOCK = [
    {
        "status": "active",
        "accountType": "user",
        "restrictedByLevel": false,
        "accountLevel": null,
        "subscripted": false,
        "email": "iancardernas96@gmail.com",
        "createdAt": {
            "$date": {
                "$numberLong": "1670122309248"
            }
        },
        "updatedAt": {
            "$date": {
                "$numberLong": "1670122309248"
            }
        },
    }
] as unknown as Accounts[];