"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
//const { ensureLoggedIn, ensureAdmin, ensureAdminOrUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userRegister.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const applicationSchema = require("../schemas/applicationState.json");
//may want to add schema validator for bookings

const router = express.Router();


/** POST / { booking }  => { booking, token }
 *
 * Adds a new booking. This is not the registration endpoint --- instead
 *
 * This returns the newly created booking:
 *  {booking: { renterUsername, listingId, startDate, endDate  }, token }
 *
 **/

router.post("/", async function (req, res, next) {
  // const validator = jsonschema.validate(req.body, userNewSchema);
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }

  const booking = await Booking.register(req.body);
  return res.status(201).json({ booking });
});

/** POST /[username]/job/[id]  =>  { applied: id }
 *
 * Authorization required: Admin or logged in user
 **/

// router.post("/:username/jobs/:id", async function(req, res, next) { 
//   const validator = jsonschema.validate(req.body, applicationSchema);
//   if (!validator.valid) {
//     const errs = validator.errors.map(e => e.stack);
//     throw new BadRequestError(errs);
//   }

//   const state = req.body;
//   state.jobId = req.params.id;

//   await User.apply(req.params.username, req.params.id, req.body.state)
//   return res.status(201).json(state)
// })


/** GET / => { bookings: [ {renterUsername, listingId, startDate, endDate}, ... ] }
 *
 * Returns list of all bookings.
 *
 * 
 **/

router.get("/", async function (req, res, next) {
  const bookings = await Booking.findAll();
  return res.json({ bookings });
});


/** PATCH /[id] { booking } => { booking }
 *
 * Data can include:
 *   { renterUsername, listingId, startDate, endDate}
 *
 * Returns { id ,renterUsername, listingId, startDate, endDate}
 *
 * 
 **/

router.patch("/:id", async function (req, res, next) {
  // const validator = jsonschema.validate(req.body, userUpdateSchema);
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }

  const booking = await Booking.update(req.params.id, req.body);
  return res.json({ booking });
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: login
 **/

 //need to add some authentication here
router.delete("/:id", async function (req, res, next) {
  await Booking.remove(req.params.id);
  return res.json({ deleted: req.params.id });
});


module.exports = router;