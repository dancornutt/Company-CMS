DROP DATABASE IF EXISTS CompanyCMS;

CREATE DATABASE CompanyCMS;

USE CompanyCMS;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL REFERENCES departments(id),
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL REFERENCES roles(id),
  manager_id INT NULL REFERENCES employees(id),
  PRIMARY KEY (id)
);

INSERT INTO departments (name)
VALUES ("sales");
INSERT INTO departments (name)
VALUES ("marketing");
INSERT INTO departments (name)
VALUES ("engineering");

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Dan", "Cornutt", 1, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Tracy", "Smith", 1, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Rogers", 4);

INSERT INTO roles (title, salary, department_id)
VALUES ("programmer", 80000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("scrum master", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("lead", 120000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("manager", 1200, 1);
