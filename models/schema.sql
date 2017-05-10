DROP DATABASE IF EXISTS church_app;
CREATE DATABASE church_app;

\c church_app;

CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    zip INTEGER
);

CREATE TABLE IF NOT EXISTS churches(
    id SERIAL PRIMARY KEY,
    name TEXT,
    address TEXT,
    review TEXT,
    profile INTEGER,
    searchprofile INTEGER
);