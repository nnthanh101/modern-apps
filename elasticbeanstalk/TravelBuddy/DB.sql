#
# Lab 1 - DB Seed Script
#

use travelbuddy;
DROP TABLE IF EXISTS `flightspecial`;
CREATE TABLE `flightspecial` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `header` varchar(255) NOT NULL DEFAULT '',
  `body` varchar(255) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `originCode` varchar(6) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `destinationCode` varchar(6) DEFAULT NULL,
  `cost` int(11) NOT NULL,
  `expiryDate` bigint(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 200),
'London to Prague', 'Jewel of the East', 'London', 'LHR', 'Paris', 'CDG'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 200),
'Paris to London', 'Weekend getaway!', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 200),
'Dubai to Cairo', 'Middle East adventure', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 500),
'Melbourne to Hawaii', 'Escape to the sun this winter', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 200),
'Buenos Aires to Rio', 'Time to carnivale!', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 500),
'Sydney to Rome', 'An Italian classic', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 500),
'Melbourne to Sydney', 'Well trodden path', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 500),
'Hong Kong to Kuala Lumpur', 'Hop step and a jump', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 500),
'Lisbon to Madrid', 'Spanish adventure', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 500),
'Aswan to Cairo', 'An experience of a lifetime', 'Origin', 'ORG', 'Destination', 'DST'
);

INSERT INTO `flightspecial`
(`expiryDate`, `cost`, `header`, `body`, `origin`, `originCode`, `destination`, `destinationCode`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 500),
'New York to London', 'Trans-Atlantic', 'Origin', 'ORG', 'Destination', 'DST'
);

#---------------------------------------------------------------------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS `hotelspecial`;
CREATE TABLE `hotelspecial` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `hotel` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `cost` int(11) NOT NULL,
  `expiryDate` bigint(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Sommerset Hotel', 'Minimum stay 3 nights', 'Sydney'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Freedmom Apartments', 'Pets allowed!', 'Sydney'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Studio City', 'Minimum stay one week', 'Los Angeles'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Le Fleur Hotel', 'Not available weekends', 'Los Angeles'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Classic Hotel', 'Includes breakfast', 'Dallas'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Groundhog Suites', 'Internet access included', 'Florida'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Sophmore Suites', 'Maximum 2 people per room', 'London'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Hotel Sandra', 'Minimum stay two nights', 'Cairo'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Apartamentos de Nestor', 'Pool and spa access included', 'Madrid'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'Kangaroo Hotel', 'Maximum 2 people per room', 'Manchester'
);

INSERT INTO `hotelspecial`
(`expiryDate`, `cost`, `hotel`, `description`, `location`)
VALUES (
(SELECT (UNIX_TIMESTAMP() * 1000)) + 79200 + (RAND() * 20000000),
(50 + RAND() * 1000),
'EasyStay Apartments', 'Minimum stay one week', 'Melbourne'
);
