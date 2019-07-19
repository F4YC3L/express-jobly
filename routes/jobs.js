const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema")
const Job = require("../models/job");
const ExpressError = require("../helpers/expressError");
const newJobSchema = require("../schemas/jobNewSchema.json")
const jobUpdateSchema = require("../schemas/jobUpdateSchema.json")

/** GET / - get list of jobs.
 *
 * => {jobs: [jobData, ...]}
 *
 **/
router.get("/", async function (req, res, next){
	try {
		const jobs = await Job.getAllJobs(req.body);
		if(jobs){
			return res.json({jobs: jobs});
		}
	}
	catch(err){
			next(err);
	}
});

/** GET /:id get a single job.
 *  => {job: jobData} 
**/

router.get("/:id", async function(req, res, next){
	try{
		const job = await Job.getOneJob(req.params.id);
		if(job){
			return res.json({ job: job });
		}
	}catch(err){
		return next(err);
	}
});

/** POST / create a new job.
 * => {job: jobData}
 */

router.post("/", async function(req, res, next){
	try {
		const result = jsonschema.validate(req.body, newJobSchema)

		if(!result.valid){
			throw new ExpressError(result.errors.map(err => err.stack), 400);
		}
        const job = await Job.createJob(req.body);
        return res.status(201).json({ job });
        
		}catch(err){
			return next(err);
	}
 });


 /** PATCH /:handle update an existing job 
 *  => {job: jobData}
*/
router.patch("/:id", async function(req, res, next){
    const result = jsonschema.validate(req.body, jobUpdateSchema)
    if(!result.valid){
        // pass validation errors to error handler
    //  (the "stack" key is generally the most useful)
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
    }
       try {
          const job = await Job.jobUpdate(req.params.id, req.body);
          if(job){
              return res.json({job: job});
          }
  
       } catch(err){
           return next(err);
       }
    });    

/** DELETE /:id delete a single Job. 
 * => {message: "Job deleted"}
*/

router.delete("/:id", async function(req, res, next){
	try{
		const result = await Job.jobRemove(req.params.id);
		if(result){
			return res.json({ message: "Job deleted" });
		}
	}catch(err){
		return next(err);
	}
})

 module.exports = router;