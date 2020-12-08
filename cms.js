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
              "Add Department",
              "Add Role",
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
                case "Add Department":
                    addDepartment()
                    break;
                case "Add Role":
                    addRole()
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

async function addEmployee(){
    let qryRoles = "SELECT id, title FROM roles";
    let qryManagers = `
        SELECT DISTINCT managers.id, managers.first_name, managers.last_name
        FROM CompanyCMS.employees
        JOIN CompanyCMS.employees as managers
        ON employees.manager_id = managers.id
        ORDER BY managers.last_name ASC;
        `;
    let roles = [];
    let managers = [];
    let qr1 = await connection.query(qryRoles, function(err, data) {
        if (err) throw err;
        console.log("Roles", data);
        data.forEach(element => {
            roles.push({ id: element.id, title: element.title})
        });
    });
    let qr2 = await connection.query(qryManagers, function(err, data) {
        if (err) throw err;
        console.log("Managers", data)
        data.forEach(element => {
            managers.push({ id: element.id, first_name: element.first_name, last_name: element.last_name })
        });
    });
    
    console.log("PAUSE", roles, managers)
    inquirer
        .prompt([
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
            choices: function () {
                let rolesArray = [];
                roles.forEach(element => {
                    rolesArray.push(`${element.id } | ${element.title}`);
                });
                return rolesArray;
            }
            },
            {
            name: "manager",
            type: "list",
            message: "Who will be the new employee's manager?",
            choices: function () {
                let managerArray = [];
                managers.forEach(element => {
                    managerArray.push(`${element.id} | ${element.first_name} ${element.last_name}`);
                });
                return managerArray;
            }
            }
        ]).then(function (ans){
            //Update query to add new employee          
            qry = `INSERT INTO employees SET ?;`
            connection.query(qry, {
                first_name: ans.first_name,
                last_name: ans.last_name,
                role_id: ans.role.split(" | ")[0],
                manager_id: ans.manager.split(" | ")[0]
            });
            runRootDir();
        })
};

function addDepartment() {
    inquirer
    .prompt(
        {
        name: "department_name",
        type: "input",
        message: "What is new Department name?"
        }
    ).then(function (ans){
        //Update query to add new department          
        qry = `INSERT INTO departments SET ?;`
        connection.query(qry, {
            name: ans.department_name,
        });
        runRootDir();
    })
};

function addRole() {
    let qryDepartments = "SELECT id, name FROM departments;";
    connection.query(qryDepartments, function(err, data) {
        if (err) throw err;
        inquirer
        .prompt([
            {
            name: "role_title",
            type: "input",
            message: "What is new Role title?"
            },
            {
            name: "role_salary",
            type: "input",
            message: "What is new Role salary?"
            },
            {
            name: "department_name",
            type: "list",
            message: "What is new Role department?",
            choices: function () {
                let choiceArray = [];
                data.forEach(element => {
                    choiceArray.push(`${element.id} | ${element.name}`);
                });
                return choiceArray;
            }
            }
        ]).then(function (ans){
            //Update query to add new role      
            qry = `INSERT INTO roles SET ?;`
            connection.query(qry, {
                title: ans.role_title,
                salary: ans.role_salary,
                department_id: ans.department_name.split(" | ")[0]     
            });
            runRootDir();
        })       
    });   
}