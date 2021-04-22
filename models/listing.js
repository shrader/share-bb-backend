"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
// const { filterCompanies } = require("../helpers/filterCompanies");
 const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Listing {
  /** Create a listing (from data), update db, return new listing data.
   *
   * data should be { location, price, capacity, description, title, username }
   *
   * Returns { location, price, capacity, description, title, username }
   *
   * Throws BadRequestError if listing already in database.
   * */


  static async create({ location, price, capacity, description, title, ownerId }) {
    const duplicateCheck = await db.query(
      `SELECT location
           FROM listings
           WHERE location = $1`,
      [location]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate listing: ${location}`);

    const result = await db.query(
      `INSERT INTO listings
           (title, location, price, capacity, description, owner_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING title, location, price, capacity, description, owner_id AS ownerId`,
      [
        title,
        location,
        price,
        capacity,
        description,
        ownerId
      ],
    );
    const listing = result.rows[0];

    return listing;
  }

  /** Find all listings.
   *
   * Returns [{ location, price, capacity, description, title, username }, ...]
   * */

  static async findAll() {
    const listingsRes = await db.query(
      `SELECT location, 
              price, 
              capacity, 
              description, 
              title, 
              owner_id
           FROM listings
           ORDER BY title`);
    return listingsRes.rows;
  }

  /** Find filtered companies
   *
   * Returns [{ location, price, capacity, description, title, username }, ...]
   * */
  static async filter(queries) {
    let filters = filterListings(queries);

    const listingsRes = await db.query(
      `SELECT 
            location, 
            price, 
            capacity, 
            description, 
            title, 
            owner_id
      FROM listings
      WHERE ${filters.sql}
      ORDER BY title`, filters.values
    )
    return listingsRes.rows;
  }

  /** Given a listing title, return data about listing.
   *
   * Returns { location, price, capacity, description, title, username }
   *   //TODO: where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  // static async get(handle) {
  //   const companyRes = await db.query(
  //     `SELECT handle,
  //                 name,
  //                 description,
  //                 num_employees AS "numEmployees",
  //                 logo_url AS "logoUrl",
  //                 id,
  //                 title,
  //                 salary,
  //                 equity
  //          FROM companies
  //          LEFT OUTER JOIN jobs ON jobs.company_handle = companies.handle
  //          WHERE handle = $1`,
  //     [handle]);

  //   const company = companyRes.rows[0];
  //   let jobs;

  //   if (!company) throw new NotFoundError(`No company: ${handle}`);

  //   if (companyRes.rows[0].id === null) {
  //     jobs = [];
  //   } else {
  //     jobs = companyRes.rows.map(job => {
  //       return { id: job.id, title: job.title, salary: job.salary, equity: job.equity }
  //     })
  //   }

  //   return {
  //     handle: company.handle,
  //     name: company.name,
  //     description: company.description,
  //     numEmployees: company.numEmployees,
  //     logoUrl: company.logoUrl,
  //     jobs: jobs
  //   }
  // }

  /** Update listing data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { location, price, capacity, description, title, username }
   *
   * Returns { location, price, capacity, description, title, username }
   *
   * Throws NotFoundError if not found.
   */

  static async update(title, data) {
    const { setCols, values } = sqlForPartialUpdate(data);
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE listings 
                      SET ${setCols} 
                      WHERE title = ${handleVarIdx} 
                      RETURNING 
                          location, 
                          price, 
                          capacity, 
                          description, 
                          title, 
                          owner_id`;
    const result = await db.query(querySql, [...values, title]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${title}`);

    return listing;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(title) {
    const result = await db.query(
      `DELETE
           FROM listings
           WHERE title = $1
           RETURNING title`,
      [title]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${title}`);
  }
}


module.exports = Listing