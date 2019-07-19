const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


class Job {
	static async getAllJobs(data) {
		let expQuery = [];
		let valueQuery = [];
		let finalQuery;
		let idx = 1;
		let startingQuery = `SELECT title, company_handle
							FROM jobs`;

		if (data.min_salary) {
			expQuery.push(`salary >= $${idx}`);
			valueQuery.push(data.min_salary);
			idx++;
		}
		if (data.min_equity) {
			expQuery.push(`equity >= $${idx}`);
			valueQuery.push(data.min_equity);
			idx++;
		}
		if (data.search) {
			expQuery.push(`title ILIKE $${idx}`);
			valueQuery.push(`%${data.search}%`);
		}

		if (expQuery.length > 0) {
			finalQuery = `${startingQuery} WHERE ${expQuery.join(' AND ')}`;
			const results = await db.query(finalQuery, valueQuery);
			return results.rows;
		} else {
			const results = await db.query(startingQuery)
			return results.rows;
		}
	}

	static async getOneJob(id) {
		const result = await db.query(
			`SELECT j.id,
							j.title,
							j.salary,
							j.equity,
							j.date_posted,
							c.handle,
							c.name,
							c.num_employees,
							c.description,
							c.logo_url
				FROM jobs AS j
					JOIN companies AS c 
						ON j.company_handle = c.handle
						WHERE j.id = $1`,
			[id]);
		return {
			id: result.rows[0].id,
			title: result.rows[0].title,
			salary: result.rows[0].salary,
			equity:  result.rows[0].equity,
			date_posted:  result.rows[0].date_posted,
			company: {
				handle:  result.rows[0].handle,
				name:  result.rows[0].name,
				num_employees:  result.rows[0].num_employees,
				description:  result.rows[0].description,
				logo_url:  result.rows[0].logo_url
			}
		}

	
	}

	static async createJob(data) {

		const result = await db.query(
			`INSERT INTO jobs (
					title,
					salary,
					equity,
					company_handle,
					date_posted)
				VALUES ($1, $2, $3, $4, current_timestamp)
				RETURNING id, title, salary, equity, company_handle, date_posted`,
			[data.title, data.salary, data.equity, data.company_handle]);

		return result.rows[0];


	}

	static async jobUpdate(id, data){
	
		const	{ query, values } = sqlForPartialUpdate("jobs", data, 'id', id )
		const result = await db.query(query,values)
		console.log("query......", query);
		console.log("values......", values)
	if (result.rows.length === 0) {
		throw { message: `This job doesn't exist`, status: 404 }
	}
	return result.rows[0];
}


	static async jobRemove(id){
		const result = await db.query(
			`DELETE FROM jobs
				WHERE id = $1
					RETURNING id`,
					[id]);
		if (!result.rows[0]) {
			throw new ExpressError(`This job doesn't exist`, 404);
		}
		return result.rows[0];
}
}

module.exports = Job;




