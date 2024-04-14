export interface Payment {
    id: number,
    userId: number,
    amount: number,
    date: Date,
    payment_type: string,
    recipient_id: number,
    sender_id: number
}