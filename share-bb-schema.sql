CREATE TYPE state AS ENUM ('host', 'renter');

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  user_type state NOT NULL
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  location TEXT NOT NULL,
  price INTEGER CHECK (price >= 0),
  capacity INTEGER CHECK (capacity >= 1),
  owner_username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);


CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  renter_username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  listings_id INTEGER
    REFERENCES listings ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);
