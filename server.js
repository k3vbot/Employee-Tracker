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
    console.log('Connected as id ' + connection.threadId);
    initialize();
});

const initialize = () => {
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

showDepartments = () => {
    const query = 'SELECT department_id, name FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        initialize();
    });
};

showRoles = () => {
    const query = 'SELECT role.role_id, role.title, department.name FROM role INNER JOIN department ON role.department_id = department.department_id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        initialize();
    });
};

showEmployees = () => {
    const query = `SELECT employee.id, 
                          employee.first_name,
                          employee.last_name,
                          role.title,
                          department.name AS department,
                          role.salary,
                          CONCAT (manager.first_name, " ", manager.last_name) AS manager
                   FROM employee
                          LEFT JOIN role ON employee.role_id = role.role_id
                          LEFT JOIN department ON role.department_id = department.department_id
                          LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        initialize();
    });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What Role do you want to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a Role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the Salary of this Role?',
            validate: addSalary => {
                if (addSalary) {
                    return true;
                } else {
                    console.log('Please enter a Salary');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const parameters = [answer.role, answer.salary];

            const roleQuery = `SELECT name, department_id FROM department`;
            connection.query(roleQuery, (err, data) => {
                if (err) throw err;

            const dept = data.map(({ name, department_id }) => ({ name: name, value: department_id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ])
            .then(deptChoice => {
                const dept = deptChoice.dept;
                parameters.push(dept);

                const query = `INSERT INTO role (title, salary, department_id)
                                Values (?, ?, ?)`;
                
                connection.query(query, parameters, (err, result) => {
                    if (err) throw err;
                    console.log('Added' + answer.role + 'to roles!');

                showRoles();
                });
            });
            });
        });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the new employee?',
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter the first name of the employee.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the new employee?',
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter the last name of the employee.');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const parameters = [answer.firstName, answer.lastName]

        const roleQuery = `SELECT role.role_id, role.title FROM role`;

        connection.query(roleQuery, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ role_id, title }) => ({ name: title, value: role_id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the Role of the new employee?",
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                parameters.push(role);

                const managerQuery = `SELECT * FROM employee`;
                connection.query(managerQuery, (err, data) => {
                    if (err) throw err;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the new employee's manager?",
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        parameters.push(manager);
                        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, ?)`;
                        connection.query(query, parameters, (err, res) => {
                            if (err) throw err;
                            console.log("Employee has been sucessfully added!");
                        showEmployees();
                        });
                    });
                });
            });
        });
    });
};

eeByDepartment = () => {
    console.log('Showing employee by departments ... \n');
    const query = `SELECT employee.first_name,
                          employee.last_name,
                          department.name AS department
                   FROM employee
                   LEFT JOIN role ON employee.role_id = role.role_id
                   LEFT JOIN department ON role.department_id = department.department_id`;
    connection.query(query, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        initialize();
    });
};

deleteRole = () => {
    const roleQuery = `SELECT * FROM role`;

    connection.query(roleQuery, (err, data) => {
        if (err) throw err;

    const role = data.map(({ title, role_id }) => ({ name: title, value: role_id }));

    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Which role should be deleted?',
            choices: role
        }
    ])
    .then(roleChoice => {
        const role = roleChoice.role;
        const query = `DELETE FROM role WHERE role_id = ?`;

        connection.query(query, role, (err, result) => {
            if (err) throw err;
            console.log('Role successfully deleted!');

        showRoles();
        });
    });
    });
};

deleteEmployee = () => {
    const employeeQuery = `SELECT * FROM employee`;

    connection.query(employeeQuery, (err, data) => {
        if (err) throw err;
    
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));

    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: "Which employee do you want to delete?",
            choices: employees
        }
    ])
    .then(employeeChoice => {
        const employee = employeeChoice.name;

        const query = `DELETE FROM employee WHERE id = ?`;

        connection.query(query, employee, (err, result) => {
            if (err) throw err;
            console.log("Employee successfully deleted!");

            showEmployees();
        });
    });
    });
};