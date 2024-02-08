SELECT datname FROM pg_catalog.pg_database WHERE datname = 'products';

CREATE TABLE IF NOT EXISTS products( 
  id  VARCHAR(100) PRIMARY KEY NOT NULL,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255) NOT NULL,
  price  DECIMAL(10,2) NOT NULL
);