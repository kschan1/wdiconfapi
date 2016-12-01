CREATE DATABASE wdiconfapi;
\c wdiconfapi

CREATE TABLE Venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  address TEXT
);

CREATE TABLE Events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  date DATE,
  time TIME,
  description TEXT,
  venue_id INT references Venues(id)
);

CREATE TABLE Presenters (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  company VARCHAR(255),
  title VARCHAR(255),
  email VARCHAR(255)
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
  email VARCHAR(255),
  username VARCHAR(255),
  password_digest VARCHAR(255)
);

CREATE TABLE Events_Users (
  id SERIAL PRIMARY KEY,
  event_id INT references Events(id),
  user_id INT references Users(id)
);

-- Seed files

INSERT INTO Venues(name, address)
VALUES
(
  'General Assembly',
  '80 William St, Melbourne'
), (
  'Federation Square',
  'Swanston St, Melbourne'
);

INSERT INTO Events(name, date, time, description, venue_id)
VALUES
(
  'Introduction to HTML',
  '9 December 2016',
  '9:00AM',
  'The best introduction to HTML ever.',
  1
), (
  'Introduction to CSS',
  '9 December 2016',
  '10:00AM',
  'The best introduction to CSS ever.',
  1
), (
  'Introduction to JavaScript',
  '9 December 2016',
  '11:00AM',
  'The best introduction to JavaScript ever.',
  1
), (
  'Introduction to Ruby',
  '10 December 2016',
  '9:00AM',
  'The best introduction to Ruby ever.',
  2
), (
  'Introduction to Sinatra',
  '10 December 2016 11:00',
  '11:00AM',
  'The best introduction to Sinatra ever.',
  2
);

INSERT INTO Presenters(first_name, last_name, company, title, email)
VALUES
(
  'James',
  'Mah',
  'Kepler Analytics',
  'Industrial Designer',
  'jamesmah@workmail.com'
), (
  'Ka Seng',
  'Chan',
  'NHP Electrical',
  'Electrical Engineer',
  'kasengchan@gmail.com'
);

INSERT INTO Events_Presenters(event_id, presenter_id)
VALUES (1, 1), (1, 2), (2, 2);

INSERT INTO Users(first_name, last_name, email, username, password_digest)
VALUES
(
  'Chaz',
  'Pereira',
  'chaz@gmail.com',
  'chazzy',
  'chazzy'
), (
  'Tim',
  'Timmy',
  'tim@gmail.com',
  'timmy',
  'timmy'
);


INSERT INTO Events_Users(event_id , user_id)
VALUES (1, 1), (1, 2), (2, 2);