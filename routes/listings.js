"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
// const { ensureAdmin } = require("../middleware/auth");
const Listing = require("../models/listing");
// const listingNewSchema = require("../schemas/jobNew.json");

const router = express.Router({ mergeParams: true });


/** POST / { listing } => { listing }
 *
 * listing should be { location, price, capacity, description, title, username }
 *
 * Returns { location, price, capacity, description, title, username }
 *
 */

router.post("/", async function (req, res, next) {
//   const validator = jsonschema.validate(req.body, jobNewSchema);
//   if (!validator.valid) {
//     const errs = validator.errors.map(e => e.stack);
//     throw new BadRequestError(errs);
//   }

  const listing = await Listing.create(req.body);
  return res.status(201).json({ listing });
});


/** GET / =>
 *   { listings: [ { location, price, capacity, description, title, username }, ...] }
 *
 * Can provide search filter in query:
 * - max price
 * - location
 * - title (will find case-insensitive, partial matches)
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as int/bool
  if (q.maxPrice !== undefined) q.maxPrice = +q.maxPricey;

//   const validator = jsonschema.validate(q, jobSearchSchema);
//   if (!validator.valid) {
//     const errs = validator.errors.map(e => e.stack);
//     throw new BadRequestError(errs);
//   }

  const listings = await Listing.findAll(q);
  return res.json({ listings });
});


/** GET /[listingId] => { listing }
 *
 * Returns { location, price, capacity, description, title, username }
 *   where company is { location, price, capacity, description, title, username }
 *
 */

router.get("/:id", async function (req, res, next) {
  const listing = await Listing.get(req.params.id);
  return res.json({ listing });
});


/** PATCH /[jobId]  { fld1, fld2, ... } => { job }
 *
 * Data can include: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.patch("/:id", async function (req, res, next) {
  const validator = jsonschema.validate(req.body, listingUpdateSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const listing = await Listing.update(req.params.id, req.body);
  return res.json({ listing });
});


/** DELETE /[handle]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:id", async function (req, res, next) {
  await Listing.remove(req.params.id);
  return res.json({ deleted: +req.params.id });
});


module.exports = router;
