const request = require('supertest');
const app = require('../../app');
const db = require("../../db");
const Company = require('../../models/company')
const Job = require("../../models/job")

let jobId;
describe("Jobs Routes Test", function () {
	beforeEach(async function () {
		await db.query("DELETE FROM jobs");
		await db.query("DELETE FROM companies");

		let company = await Company.create({
			handle: "test",
			name: "TestCompany",
			num_employees: 10,
			description: "test company for test",
			logo_url: "https://jsonschema.net/"
		});
		let job = await Job.createJob({
			title: "technician",
			salary: 6000,
			equity: .5,
			company_handle: "test"
		});
		jobId = job.id;
		result = await db.query(`select id, title from jobs where id = ${jobId}`)
	});

	describe("POST /jobs", function () {
		test("creates a job", async function () {
			const response = await request(app)
				.post("/jobs")
				.send({
					title: "engineer",
					salary: "40000",
					equity: ".6",
					company_handle: "test"
				});

			expect(response.statusCode).toEqual(201);
			expect(response.body).toEqual({
				job: {
					id: expect.any(Number),
					title: "engineer",
					salary: 40000,
					equity: 0.6,
					company_handle: "test",
					date_posted: expect.any(String)
				}
			});
		});

	});

	describe("Get /jobs/:id", function () {
		test("gets a job by id", async function () {
			const response = await request(app)
				.get(`/jobs/${jobId}`);

			expect(response.statusCode).toEqual(200);
			expect(response.body).toEqual({
				job: {
					id: jobId,
					title: "technician",
					salary: 6000,
					equity: .5,
					date_posted: expect.any(String),
					company: {
						handle: "test",
						name: "TestCompany",
						num_employees: 10,
						description: "test company for test",
						logo_url: "https://jsonschema.net/"
					}
				}
			});

		});
	});
});

afterAll(async function () {
	await db.end();
});