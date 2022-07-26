INSERT INTO department (name, department_id)
VALUES
('Marketing', 1),
('Finance', 2),
('Engineering', 3),
('Legal', 4);

INSERT INTO role (role_id, title, salary, department_id)
VALUES
(1, 'Senior Marketer', 100000, 1),
(2, 'Marketer', 80000, 1),
(3, 'Senior Accountant', 120000, 2),
(4, 'Accountant', 90000, 2),
(5, 'Senior Software Developer', 200000, 3),
(6, 'Software Developer', 120000, 3),
(7, 'General Counsel', 400000, 4),
(8, 'Legal Consultant', 200000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Chris', 'Pratt', 2, 1),
('Donny', 'Yen', 7, null),
('Scarlett', 'Johansson', 1, null),
('Chris', 'Evans', 8, 2),
('Jessica', 'Alba', 4, 3),
('Brie', 'Larson', 6, 4),
('Robert', 'Downey Jr', 5, null),
('Amy', 'Adams', 3, null);


