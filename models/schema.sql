DROP DATABASE IF EXISTS church_app;
CREATE DATABASE church_app;

\c church_app;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    zip INTEGER
);

CREATE TABLE churches(
    id SERIAL PRIMARY KEY,
    name TEXT,
    address TEXT,
    saved BOOLEAN,
    review TEXT
);