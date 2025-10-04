CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage','flat')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2) DEFAULT 0,
    max_discount_amount NUMERIC(10,2),
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    usage_limit INT DEFAULT NULL,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_coupons (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    coupon_id INT REFERENCES coupons(id),
    used_on TIMESTAMP DEFAULT NOW(),
    status BOOLEAN DEFAULT TRUE
);

ALTER TABLE coupons
ADD COLUMN status VARCHAR(20) DEFAULT 'active' NOT NULL
CHECK (status IN ('active','inactive','expired'));