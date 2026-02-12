export const checkout_url = "https://checkout.razorpay.com/v1/checkout.js";
export const razorpayCallBackUrl = (txn_id) => {
    return `http://localhost:1234/api/v1/amount/payment/${txn_id}`
}