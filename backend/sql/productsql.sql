CREATE TABLE
    products (
        product_id SERIAL PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        category VARCHAR(100) NOT NULL,
        sub_category VARCHAR(100) NULL,
        product_code VARCHAR(50) UNIQUE NOT NULL,
        brand VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        mrp NUMERIC(10, 2) NOT NULL,
        stock_quantity INT NOT NULL,
        discount NUMERIC(5, 2) NULL,
        image_path VARCHAR(255) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

select
    *
from
    products;

ALTER TABLE products
ADD COLUMN alt_tag VARCHAR(500);


ALTER TABLE products
ADD COLUMN title_id INT;

ALTER TABLE products
ADD CONSTRAINT fk_title
FOREIGN KEY (title_id)
REFERENCES category_title (title_id)
ON DELETE SET NULL;