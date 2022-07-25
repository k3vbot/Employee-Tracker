DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
    department_id INT NOT NULL,
    name VARCHAR(30) NULL
);

CREATE TABLE role (
    role_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL NOT NULL, 
    department_id INTEGER
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL, 
    role_id INTEGER, 
    manager_id INTEGER
);