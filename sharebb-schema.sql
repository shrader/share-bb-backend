CREATE TYPE state AS ENUM ('host', 'renter');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25),
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
    CHECK (position('@' IN email) > 1),
  user_type state NOT NULL
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL UNIQUE,
  location TEXT NOT NULL,
  price INTEGER CHECK (price >= 0),
  capacity INTEGER CHECK (capacity >= 1),
  description TEXT NOT NULL,
  owner_id INTEGER NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users (id)
);
  -- owner_id INTEGER NOT NULL
  --   REFERENCES users ON DELETE CASCADE

  -- FOREIGN KEY (so_id) REFERENCES so_headers (id)


CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  renter_id INTEGER NOT NULL,
    FOREIGN KEY (renter_id) REFERENCES users (id),
  listing_id INTEGER NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings (id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

--  `INSERT INTO listings
--            (renter_id, listing_id, start_date, end_date)
--            VALUES ($1, $2, $3, $4)
--            RETURNING id, renter_id, listing_id, start_date, end_date`,
