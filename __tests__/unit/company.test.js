const db = require("../../db");
const Company = require("../../models/company");
const sqlForPartialUpdate = require("../../helpers/partialUpdate")

beforeEach(async function(){
    await db.query("DELETE FROM companies");
    let company1 = await Company.create({
        handle: "test1",
        name: "TestCompany1",
        num_employees: 10,
        description: "test company for test",
        logo_url: "https://jsonschema.net/"
    });
    let company2= await Company.create({
        handle: "test2",
        name: "TestCompany2",
        num_employees: 30,
        description: "test company2 for test",
        logo_url: "https://jsonschema.com/"
    });
});
describe("TEST Company class", function(){
   
    test("can create company", async function(){
        let comp = await Company.create({
            handle: "rithm",
            name: "rithm school",
            num_employees: 10,
            description: "best bootcamp ever",
            logo_url: "https://www.rithmschool.com/" 
        });
        
        expect(comp.name).toBe("rithm school");
    });


    test(" can get all companies by search, min_employees, max_employees queries", async function(){
        let  result = await Company.getAll({
            search: "test",
            min_employees: 10,
            max_employees: 30
        });
        expect(result.length).toEqual(2);

    });

    test("can get all companies by serach query", async function(){
        let result = await Company.getAll({
            search: "test1"
        });
        expect(result[0].name).toBe("TestCompany1")
    })

    test("can get all companies by min employees query", async function(){
        let result = await Company.getAll({
            min_employees: 30
        });
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual("TestCompany2")   
    });

    test("can get all companies by max employees query", async function(){
        let result = await Company.getAll({
            max_employees: 10
        });
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual("TestCompany1")   
    });

    test("can get a company by handle", async function(){
        let comp = await Company.getOne("test1");
        expect(comp).toEqual({
            handle: "test1",
            name: "TestCompany1",
            num_employees: 10,
            description: "test company for test",
            logo_url: "https://jsonschema.net/"
        })
    });

    test("can update a company", async function(){
        let handle = "test1";
        let data = {
            name: "updated company",
            num_employees: 1,
            description: "updated",
            logo_url: "https://updated.net/"
        };
     
        let comp = await Company.update(handle, data);         
        expect(comp).toEqual({
            handle : "test1",
            name: "updated company",
            num_employees: 1,
            description: "updated",
            logo_url: "https://updated.net/"
        });
    });

    afterAll(async function() {
        await db.end();
      });
});