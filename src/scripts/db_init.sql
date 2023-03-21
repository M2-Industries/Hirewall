CREATE TABLE users (
  _id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE applications (
  _id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  salary VARCHAR(15),
  last_action_id_fk INT,
  comments VARCHAR(1000)
--   FOREIGN KEY (user_id_fk) REFERENCES users(_id),
--   FOREIGN KEY (last_action_id_fk) REFERENCES actions(_id),
)

CREATE TABLE actions (
  _id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  application_id_fk INT NOT NULL,
  date,
  action_type VARCHAR(100) NOT NULL,
  notes VARCHAR(1000) NOT NULL
);

ALTER TABLE applications
ADD CONSTRAINT fk_applications_users
FOREIGN KEY (user_id)
REFERENCES users(_id);

ALTER TABLE actions
ADD CONSTRAINT fk_actions_applications
FOREIGN KEY (application_id_fk)
REFERENCES applications(_id);

ALTER TABLE applications
ADD CONSTRAINT fk_applications_actions
FOREIGN KEY (last_action_id_fk)
REFERENCES actions(_id);