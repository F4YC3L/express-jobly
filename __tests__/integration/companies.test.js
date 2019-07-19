const request = require('supertest');
const app = require('../../app');
const db = require("../../db");
const Company = require('../../models/company')



describe("Companies Routes Test",  function () {
	beforeEach(async function () {
		await db.query("DELETE FROM companies");
		let company = await Company.create({
			handle: "test",
			name: "TestCompany",
			num_employees: 10,
			description: "test company for test",
			logo_url: "https://jsonschema.net/"
			});
	});


	describe("POST /companies", function(){
		test("creates a company", async function(){
			const response = await request(app)
					.post("/companies")
					.send({
						handle: "testCompany9",
						name: "company testing",
						num_employees: 10,
						description: "test company for test",
						logo_url: "https://test-compamy.com/"	
					});
			expect(response.statusCode).toBe(201);
		});
		test("prevent creation of 2 companies with same handle and name", async function(){
			const response = await request(app)
					.post("/companies")
					.send({
						handle: "test",
						name: "TestCompany"
					});
				expect(response.statusCode).toBe(404)
		});
	});
	describe('GET /companies/:handle', async function() {
		test('Gets a single a company', async function() {
			const response = await request(app)
				.get(`/companies/test`)
				
			expect(response.body.company).toHaveProperty('handle');
			expect(response.body.company.handle).toBe('test');
		});
	
		test('Responds with a 404 if it cannot find the company in question', async function() {
			const response = await request(app)
				.get(`/companies/wrong`)
			
			expect(response.statusCode).toBe(404);
		});
	});


	describe("DELETE /companies/:handle", function(){
		test("delete one compant", async function(){
			const response = await request(app)
				.delete("/companies/test");

			expect(response.body).toEqual({ message: 'company deleted' });
		});
	});

		
});	
afterAll( async function () {
  await db.end();
});

