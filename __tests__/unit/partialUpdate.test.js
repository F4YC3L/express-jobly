

const sqlForPartialUpdate = require("../../helpers/partialUpdate");


describe("partialUpdate()", function () {
  test("should generate a proper partial update query with just 1 field",
      function () {
       const  { query, values } = sqlForPartialUpdate (
          "users",
          {name: "test"},
          "username",
          "testuser");
        
    expect(query).toEqual(`UPDATE users SET name=$1 WHERE username=$2 RETURNING *`);
    expect(values).toEqual(["test", "testuser"])

  });
});
 


