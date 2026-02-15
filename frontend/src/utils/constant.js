export const checkout_url = "https://checkout.razorpay.com/v1/checkout.js";
export const razorpayCallBackUrl = (txn_id) => {
    return `http://localhost:1234/api/v1/amount/payment/${txn_id}`
}

export const txn_type = {
  "fix_deposit": {
    name: "Fix Deposit",
    "color": "text-gray-600",
    "bg-color": "bg-gray-100",
    "desc": "Amount for Fix Deposit",
  },
  "Credit": {
    name: "Credit",
    "color": "text-green-600",
    "bg-color": "bg-green-100",
    "desc": "Amount you recieved",
  },
  "Debit": {
    name: "Debit",
    "color": "text-red-600",
    "bg-color": "bg-red-100",
    "desc": "Amount taken away from you",
  },
};