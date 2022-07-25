const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

PORT = process.env.PORT || 3001;

connection.connect(err => {
    if (err) throw err;
    console.log('Connected as id ' = connection.threadId);
    firstAction();
});

const firstAction = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View Departments',
                      'View Roles',
                      'View Employees',
                      'Add a Role',
                      'Add an Employee',
                      'View Employees by Department',
                      'Delete a Role',
                      'Delete an Employee',
                      'Exit']
        }
    ])
        .then((answers) => {
            const { choices } = answers;
            if (choices === 'View Departments') {
                showDepartments();
            }
            if (choices === 'View Roles') {
                showRoles();
            }
            if (choices === 'View Employees') {
                showEmployees();
            }
            if (choices === 'Add a Role') {
                addRole();
            }
            if (choices === 'Add an Employee') {
                addEmployee();
            }
            if (choices === 'View Employees by Department') {
                eeByDepartment();
            }
            if (choices === 'Delete a Role') {
                deleteRole();
            }
            if (choices === 'Delete an Employee') {
                deleteEmployee();
            }
            if (choices === 'Exit') {
                connection.end()
            };
        });
};
