CREATE TABLE IF NOT EXISTS blood_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    blood_group VARCHAR(5) NOT NULL
);

