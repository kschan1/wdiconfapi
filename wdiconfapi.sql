-- DROP DATABASE wdiconfapi;
-- CREATE DATABASE wdiconfapi;
\c wdiconfapi
DROP TABLE Events_Users;
DROP TABLE Events_Presenters;
DROP TABLE Events;
DROP TABLE Venues;
DROP TABLE Presenters;
DROP TABLE Users;

CREATE TABLE Venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  address TEXT,
  image_url TEXT
);

CREATE TABLE Events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  date DATE,
  time TIME,
  description TEXT,
  image_url TEXT,
  venue_id INT references Venues(id)
);

CREATE TABLE Presenters (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  company VARCHAR(255),
  title VARCHAR(255),
  email VARCHAR(255),
  bio TEXT,
  image_url TEXT
);

CREATE TABLE Events_Presenters (
  id SERIAL PRIMARY KEY,
  event_id INT references Events(id),
  presenter_id INT references Presenters(id)
);

CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255),
  password_digest VARCHAR(255),
  image_url TEXT,
  admin BOOLEAN
);

CREATE TABLE Events_Users (
  id SERIAL PRIMARY KEY,
  event_id INT references Events(id),
  user_id INT references Users(id)
);

CREATE TABLE Tickets (
  id SERIAL PRIMARY KEY,
  ticket_number INT,
  user_id INT references Users(id)
);

-- Seed files

INSERT INTO Venues(name, address, image_url)
VALUES
(
  'General Assembly',
  '80 William St, Melbourne',
  'http://placehold.it/150x150'
), (
  'Federation Square',
  'Swanston St, Melbourne',
  'http://placehold.it/150x150'
);

INSERT INTO Events(name, date, time, description, venue_id, image_url)
VALUES
(
  'Introduction to HTML',
  '9 December 2016',
  '9:00AM',
  'The best introduction to HTML ever.',
  1,
  'http://placehold.it/150x150'
), (
  'Introduction to CSS',
  '9 December 2016',
  '10:00AM',
  'The best introduction to CSS ever.',
  1,
  'http://placehold.it/150x150'
), (
  'Introduction to JavaScript',
  '9 December 2016',
  '11:00AM',
  'The best introduction to JavaScript ever.',
  1,
  'http://placehold.it/150x150'
), (
  'Introduction to Ruby',
  '10 December 2016',
  '9:00AM',
  'The best introduction to Ruby ever.',
  2,
  'http://placehold.it/150x150'
), (
  'Introduction to Sinatra',
  '10 December 2016 11:00',
  '11:00AM',
  'The best introduction to Sinatra ever.',
  2,
  'http://placehold.it/150x150'
);

INSERT INTO Presenters(first_name, last_name, company, title, email, bio, image_url)
VALUES
(
  'James',
  'Mah',
  'Kepler Analytics',
  'Industrial Designer',
  'jamesmah@workmail.com',
  'Synth kickstarter locavore hell of man braid knausgaard. Hoodie raw denim craft beer, hammock seitan small batch copper mug snackwave tofu PBR&B flannel synth next level vegan echo park. Fashion axe chillwave tacos, trust fund intelligentsia small batch cliche meditation. Tacos subway tile post-ironic, tumblr listicle man braid mixtape ennui kinfolk lumbersexual',
  'http://placehold.it/150x150'
), (
  'Ka Seng',
  'Chan',
  'NHP Electrical',
  'Electrical Engineer',
  'kasengchan@gmail.com',
  'Synth kickstarter locavore hell of man braid knausgaard. Hoodie raw denim craft beer, hammock seitan small batch copper mug snackwave tofu PBR&B flannel synth next level vegan echo park. Fashion axe chillwave tacos, trust fund intelligentsia small batch cliche meditation. Tacos subway tile post-ironic, tumblr listicle man braid mixtape ennui kinfolk lumbersexual',
  'http://placehold.it/150x150'
);

INSERT INTO Events_Presenters(event_id, presenter_id)
VALUES (1, 1), (1, 2), (2, 2);

INSERT INTO Users(first_name, last_name, email, username, password_digest, image_url,admin)
VALUES
(
  'admin',
  'admin',
  'admin',
  '',
  '$2a$10$hg3DoYZP.NVqAJSLmah83eMrhFFbCxmkeLR5hBZ/7UGYCV7bvbR8.',
  'http://placehold.it/150x150',
  'true'
), (
  'James',
  'Mah',
  'james',
  '',
  '$2a$10$I.SexHZDHau5IIBKOzYCYuP84ZBr8sbDaLKVkbLYf4XEzD4jxyWLa',
  'http://placehold.it/150x150',
  'true'
), (
  'Tim',
  'Timmy',
  'tim@gmail.com',
  'timmy',
  'timmy',
  'http://placehold.it/150x150',
  'false'
);


INSERT INTO Events_Users(event_id , user_id)
VALUES (1, 1), (1, 2), (2, 2);
