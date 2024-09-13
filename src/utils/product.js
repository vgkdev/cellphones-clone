export const calculateTotalPrice = (prices, quantities) => {
  return prices.reduce((total, price, index) => {
    return total + price * quantities[index];
  }, 0);
};

export const calculateEventDiscount = (total, eventDiscountRate, eventMaxDiscount) => {
    const eventDiscount = total * eventDiscountRate;
    return Math.min(eventDiscount, eventMaxDiscount);
}

export const calculateDiscountAmount = (total, eventDiscountRate, eventMaxDiscount, voucherDiscountRate, voucherMaxDiscount) => {
    const eventDiscount = total * eventDiscountRate;
    const voucherDiscount = total * voucherDiscountRate;
    const costAfterEventDiscount = total - Math.min(eventDiscount, eventMaxDiscount);
    const costAfterVoucherDiscount = costAfterEventDiscount - Math.min(voucherDiscount, voucherMaxDiscount);
    return total - costAfterVoucherDiscount;
}