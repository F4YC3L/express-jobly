const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema")
const Company = require("../models/company");
const ExpressError = require("../helpers/expressError");
const newCompSchema = require("../schemas/companyNewSchema.json")
const updateCompSchema = require("../schemas/companyUpdateSchema.json")



/** GET / - get list of companies.
 *
 * => {companies: [companyData, ...]}
 *
 **/
router.get("/", async function (req, res, next){
	try {
		const companies = await Company.getAll(req.body);
		if(companies){
			return res.json({companies: companies});
		}
	}
	catch(err){
			next(err);
	}
});

/** GET /:handle get a single company.
 *  => {compamy: compamyData} 
**/

router.get("/:handle", async function(req, res, next){
	try{
		const company = await Company.getOne(req.params.handle);
		if(company){
			return res.json({ company: company });
		}
	}catch(err){
		return next(err);
	}
});


/** POST / create a new company.
 * => {company: companyData}
 */

 router.post("/", async function(req, res, next){
	try {
		const result = jsonschema.validate(req.body, newCompSchema)

		if(!result.valid){
			throw new ExpressError(result.errors.map(error => error.stack), 400);
		}
		console.log("success")
		const company = await Company.create(req.body);
		return res.status(201).json({ company });
		}catch(err){
			return next(err);
	}
 });

/** DELETE /:handle delete a single company. 
 * => {message: "Company deleted"}
*/

router.delete("/:handle", async function(req, res, next){
	try{
		const result = await Company.remove(req.params.handle);
		if(result){
			return res.json({ message: "company deleted" });
		}
	}catch(err){
		return next(err);
	}
})

/** PATCH /:handle update an existing company 
 *  => {company: companyData}
*/
 router.patch("/:handle", async function(req, res, next){
  const result = jsonschema.validate(req.body, updateCompSchema)
  if(!result.valid){
      // pass validation errors to error handler
  //  (the "stack" key is generally the most useful)
  let listOfErrors = result.errors.map(error => error.stack);
  let error = new ExpressError(listOfErrors, 400);
  return next(error);
  }
	 try {
		const company = await Company.update(req.params.handle, req.body);
		if(company){
			return res.json({company: company});
		}

	 } catch(err){
		 return next(err);
	 }
 });

 module.exports = router;