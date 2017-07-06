DROP DATABASE IF EXISTS church_app;
CREATE DATABASE church_app;

\c church_app;

CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phonenumber BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS churches(
    id SERIAL PRIMARY KEY,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat FLOAT8 NOT NULL,
    lng FLOAT8 NOT NULL,
    review TEXT,
    review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    saved_profile INTEGER,
    search_profile INTEGER NOT NULL,
    FOREIGN KEY (saved_profile) REFERENCES users(id),
    FOREIGN KEY (search_profile) REFERENCES users(id)
);