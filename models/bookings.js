/**
 * CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  renter_username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  listings_id INTEGER
    REFERENCES listings ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);
 */

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Booking {
  /** Create a booking (from data), update db, return new listing data.
   *
   * data should be { renter_username, listing_id, start_date, end_date }
   *
   * Returns { id, renter_username, listing_id, start_date, end_date}
   *
   * Throws BadRequestError if booking already in database.
   * */


  static async create({ renterUsername, listingId, startDate, endDate }) {
    const duplicateCheck = await db.query(
      `SELECT listing_id, renter_username
           FROM bookings
           WHERE listing_id = $1 AND renter_username = $2`,
      [listingId, renterUsername]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate listing: ${location}`);

    const result = await db.query(
      `INSERT INTO listings
           (renter_username, listing_id, start_date, end_date)
           VALUES ($1, $2, $3, $4)
           RETURNING id, renter_username, listing_id, start_date, end_date`,
      [
        renterUsername,
        listingId,
        startDate,
        endDate
      ],
    );
    const booking = result.rows[0];

    return booking;
  }

   /** Find all listings.
   *
   * Returns [{ id, renter_username, listing_id, start_date, end_date }, ...]
   * */

  static async findAll() {
    const bookingsRes = await db.query(
      `SELECT id,
              renter_username,
              listing_id,
              start_date,
              end_date
           FROM booking
           ORDER BY listing_id`);
    return bookingsRes.rows;
  }

   /** Update booking data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { renter_username, listing_id, start_date, end_date }
   *
   * Returns { id, renter_username, listing_id, start_date, end_date}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data);
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE listings 
                      SET ${setCols} 
                      WHERE title = ${idVarIdx} 
                      RETURNING 
                      id,
                      renter_username,
                      listing_id,
                      start_date,
                      end_date`;
    const result = await db.query(querySql, [...values, id]);
    const booking = result.rows[0];

    if (!booking) throw new NotFoundError(`No booking: ${id}`);

    return booking;
  }

    /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM bookings
           WHERE id = $1
           RETURNING id`,
      [id]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${id}`);
  }

}