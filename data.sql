\c jobly 

DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS jobs;

CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer,
    description text NOT NULL,
    logo_url text NOT NULL
);

CREATE TABLE jobs (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL,
    company_handle text NOT NULL REFERENCES companies,
    date_posted timestamp without time zone NOT NULL
);