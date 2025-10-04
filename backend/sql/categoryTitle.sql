CREATE TABLE category_title (
    title_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    title_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories (category_id)
        ON DELETE CASCADE
);