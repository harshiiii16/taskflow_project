-- TaskFlow Seed Data
USE taskflow;

-- BCrypt hash of "admin123" and "member123"
INSERT INTO users (name, email, password, role, color) VALUES
('Alex Morgan', 'admin@demo.com',  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBpwTTyU2B2p6e', 'ADMIN',  '#e8ff5a'),
('Jamie Lee',   'member@demo.com', '$2a$10$8K1p/a0dR1lWs4EFnm2pOOtZ6I1PB5vNGH7tKBrMHp5MrKy8nQDKG', 'MEMBER', '#5a9eff'),
('Sam Patel',   'sam@demo.com',    '$2a$10$8K1p/a0dR1lWs4EFnm2pOOtZ6I1PB5vNGH7tKBrMHp5MrKy8nQDKG', 'MEMBER', '#c77dff');

INSERT INTO projects (name, description, created_by) VALUES
('Website Redesign', 'Full overhaul of company site',   1),
('Mobile App MVP',   'React Native launch build',       1),
('API Integration',  'Connect third-party services',    1);

INSERT INTO project_members (project_id, user_id) VALUES
(1,1),(1,2),(1,3),
(2,1),(2,3),
(3,1),(3,2);

INSERT INTO tasks (title, project_id, assignee_id, priority, status, due_date) VALUES
('Design new homepage mockups',  1, 2, 'HIGH',   'DONE',        '2026-04-28'),
('Build responsive navbar',      1, 3, 'MEDIUM',  'IN_PROGRESS', '2026-05-10'),
('Write copy for hero section',  1, 2, 'LOW',     'TODO',        '2026-05-15'),
('Set up React Native project',  2, 1, 'HIGH',   'DONE',        '2026-04-20'),
('Implement auth screens',       2, 3, 'HIGH',   'IN_PROGRESS', '2026-05-08'),
('Stripe payment integration',   3, 2, 'HIGH',   'TODO',        '2026-04-30'),
('Webhook endpoint setup',       3, 1, 'MEDIUM',  'TODO',        '2026-05-02');
