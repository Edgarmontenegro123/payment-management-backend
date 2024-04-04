export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    is_recipient: boolean,
    bank_account_number: string,
    is_active: boolean
}