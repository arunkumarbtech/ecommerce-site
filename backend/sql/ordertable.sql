CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_id INT REFERENCES addresses(address_id) ON DELETE SET NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, 
    payment_status VARCHAR(50) DEFAULT 'paid',
    order_status VARCHAR(50) DEFAULT 'placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);