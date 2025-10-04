export const calculatePriceDetails = (items) => {
    let subtotal = 0;
    let discount = 0;

    for (const item of items) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        if (item.category === 'shoe') {
            discount += itemTotal * 0.2;
        }
    }

    const deliveryFee = subtotal > 500 ? 0 : 60;
    const grandTotal = subtotal - discount + deliveryFee;

    return {
        subtotal,
        discount,
        deliveryFee,
        grandTotal
    };
};
