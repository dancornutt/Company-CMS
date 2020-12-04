const mysql = require("mysql");
const inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "CompanyCMS"
});

connection.connect(function(err) {
    if (err) throw err;
    runRootDir();
});

function runRootDir(){
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
              "View All Employees",
              "View All Employees By Department",
              "Add Employee",
              "Remove Employee",
              "Update Employee Role",
              "Update Employee Manager",
              "Exit"
            ]  
        }).then(function (ans){
            switch (ans.action) {
                case "View All Employees":
                    searchAll();
                    break;
                case "View All Employees By Department":
                    searchByDepartment();
                    break;
                case "View All Employees By Manager":
                    seachByManager();
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                case "Update Employee Role":
                    updateEmployee("role")
                    break;
                case "Update Employee Manager":
                    updateEmployee("manager")
                    break;
                case "Exit":
                    break;  
            }
        })
};

function searchAll() {
    // let qry = "SELECT * FROM employees";
    let qry = `
        SELECT 
            employees.id as id, 
            employees.first_name as first_name, 
            employees.last_name as last_name, 
            roles.title as title,
            roles.salary as salary, 
            manager.first_name as manager_first_name,
            manager.last_name as manager_last_name,
            departments.name as department
        FROM CompanyCMS.employees 
        LEFT JOIN CompanyCMS.roles 
        ON employees.role_id = roles.id
        LEFT JOIN CompanyCMS.employees AS manager
        ON employees.manager_id = manager.id
        LEFT JOIN CompanyCMS.departments AS departments
        ON roles.department_id = departments.id;
    `
    connection.query(qry, function(err, res) {
        if (err) throw err;
        console.log(`id   first_name   last_name   title                    department   salary   manager`)
        console.log(`--   ----------   ---------   ----------------------   ----------   ------   ---------------`)
        for (let i = 0; i < res.length; i ++) {
            console.log(
                `${res[i].id}   ${res[i].first_name}   ${res[i].last_name}    ${res[i].title}   ${res[i].department}    ${res[i].salary}   ${res[i].manager_first_name} ${res[i].manager_last_name}`
            );
        };
        runRootDir();
    })
}

function addEmployee(){
    let qryRoles = "SELECT tile FROM roles";
    let qryManagers = `
        SELECT DISTINCT managers.first_name, managers.last_name
        FROM CompanyCMS.employees
        JOIN CompanyCMS.employees as managers
        ON employees.manager_id = managers.id
        ORDER BY managers.last_name ASC;
        `;
    let roles = [];
    let managers = [];
    connection.query(qryRoles, function(err, res) {
        if (err) throw err;
        console.log(res)
        roles = [...res]
    });
    connection.query(qryManagers, function(err, res) {
        if (err) throw err;
        console.log(res)
        managers = [...res]
    });
    inquirer
        .prompt(
            {
            name: "first_name",
            type: "input",
            message: "What is the new employee's first name?"
            },
            {
            name: "last_name",
            type: "input",
            message: "What is the new employee's first name?"    
            },
            {
            name: "role",
            type: "list",
            message: "What is the role of the new employee?",
            choices: roles
            },
            {
            name: "manager",
            type: "list",
            message: "Who will be the new employee's manager?",
            choices: managers
            }
        ).then(function (ans){
            //Update query to add new employee
        })
};