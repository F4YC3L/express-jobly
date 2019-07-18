CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer,
    description text NOT NULL,
    logo_url text NOT NULL
);