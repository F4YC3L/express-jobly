/** Company class for jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


class Company{

	static async getAll(data){
		let expQuery = [];
		let valueQuery = [];
		let finalQuery;
		let idx =1;
		let startingQuery = `SELECT handle, name
													FROM companies`;
		if(data.min_employees && data.max_employees){
			if(data.min_employees > data.max_employees){
				throw new ExpressError(`parametres are incorrect`, 400);
			}
		}
		if(data.min_employees){
			expQuery.push(`num_employees >= $${idx}`);
			valueQuery.push(data.min_employees);
			idx++;
		}	
		if(data.max_employees){
			expQuery.push(`num_employees <= $${idx}`);
			valueQuery.push(data.max_employees);
			idx++;
		}

		if(data.search){
			expQuery.push(`name ILIKE $${idx} OR handle ILIKE $${idx} `);
			valueQuery.push(`%${data.search}%`)
		
		}
		if(expQuery.length>0){
			finalQuery = `${startingQuery} WHERE ${expQuery.join(' AND ')}`;
			const results = await db.query(finalQuery, valueQuery);
			return results.rows;
		} else{
			const results = await db.query(startingQuery)
			return results.rows;
		}
		
	}
	
	static async getOne(data){
		const result = await db.query(
			`SELECT handle, name, num_employees, description, logo_url
				FROM companies
					WHERE handle = $1`,
					[data]);

		if (!result.rows[0]) {
			throw new ExpressError(`No such company: ${data}`, 404);
		}
		return result.rows[0];
	}

	static async create(data){
		const result = await db.query(
			`INSERT INTO companies (
						handle,
						name,
						num_employees,
						description,
						logo_url)
					VALUES ($1, $2, $3, $4, $5)
					RETURNING handle, name, num_employees, description, logo_url`,
			[data.handle, data.name, data.num_employees, data.description, data.logo_url]);

		if (!result.rows[0]) {
			throw new ExpressError(`This company already exist: ${data}`, 404);
		}
		return result.rows[0];
	}

	static async remove(data){
		const result = await db.query(
			`DELETE FROM companies
				WHERE handle = $1
					RETURNING handle`,
					[data]);
		if (!result.rows[0]) {
			throw new ExpressError(`This doesn't exist`, 404);
		}
		return result.rows[0];
	}
	// (table, items, key, id)

	static async update(handle, data){
	
			const	{ query, values } = sqlForPartialUpdate("companies", data, 'handle', handle )
			const result = await db.query(query,values)
		if (result.rows.length === 0) {
      throw { message: `There is no company with an handle '${handle}`, status: 404 }
    }
    return result.rows[0];
	}
}

module.exports = Company;