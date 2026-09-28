--
-- ER/Studio 8.0 SQL Code Generation
-- Company :      -
-- Project :      ChatBot.DM1
-- Author :       dserrano
--
-- Date Created : Sunday, September 27, 2026 19:14:45
-- Target DBMS : PostgreSQL 8.0
--

-- 
-- TABLE: CONSUMO_TOKENS 
--

CREATE TABLE CONSUMO_TOKENS(
    ID_CONSUMO  SERIAL PRIMARY KEY,
    CATEGORIA   varchar(150),
    TOKENS      INT    NOT NULL,
    FECHA       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_MENSAJE  INT    NOT NULL
)
;


-- 
-- TABLE: CONVERSACION 
--

CREATE TABLE CONVERSACION(
    ID_CONVERSACION  SERIAL PRIMARY KEY,
    FECHA_CREACION   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_USUARIO       INT    NOT NULL
)
;



-- 
-- TABLE: MENSAJES 
--

CREATE TABLE MENSAJES(
    ID_MENSAJE      SERIAL PRIMARY KEY,
    ROL              varchar(10),
    CONTENIDO        TEXT,
    FECHA            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_CONVERSACION   INT    NOT NULL
)
;



-- 
-- TABLE: PELICULA 
--

CREATE TABLE PELICULA (
    id_pelicula         SERIAL PRIMARY KEY,
    titulo              VARCHAR(150) NOT NULL,
    genero              VARCHAR(100),
    plataforma          VARCHAR(100),
    anio_lanzamiento    INTEGER,
    calificacion        NUMERIC(3,1),
    director            VARCHAR(150),
    actores             TEXT,
    productora          VARCHAR(150),
    duracion_minutos    INTEGER,
    clasificacion       VARCHAR(20),
    activo 				INT DEFAULT 1,
    ID_USUARIO 			INT DEFAULT 1,
    fecha_registro      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
;



-- 
-- TABLE: USUARIO 
--

CREATE TABLE USUARIO(
    ID_USUARIO      SERIAL PRIMARY KEY,
    USUARIO         varchar(50),
    ROL             varchar(10),
    NOMBRE          varchar(300),
    CORREO          varchar(100),
    CLAVE           varchar(1000),
    FECHA_REGISTRO  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
;


-- 
-- TABLE: VIDEOJUEGO 
--

CREATE TABLE VIDEOJUEGO(
    id_videojuego       SERIAL PRIMARY KEY,
    titulo              VARCHAR(150) NOT NULL,
    genero              VARCHAR(100),
    plataforma          VARCHAR(100),
    anio_lanzamiento    INTEGER,
    calificacion        NUMERIC(3,1),
    desarrollador       VARCHAR(150),
    jugadores           VARCHAR(50),
    activo 				INT DEFAULT 1,
    ID_USUARIO 			INT DEFAULT 1,
    fecha_registro      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
;



-- 
-- TABLE: CONSUMO_TOKENS 
--

ALTER TABLE CONSUMO_TOKENS ADD CONSTRAINT RefMENSAJES31 
    FOREIGN KEY (ID_MENSAJE)
    REFERENCES MENSAJES(ID_MENSAJE)
;


-- 
-- TABLE: CONVERSACION 
--

ALTER TABLE CONVERSACION ADD CONSTRAINT RefUSUARIO11 
    FOREIGN KEY (ID_USUARIO)
    REFERENCES USUARIO(ID_USUARIO)
;


-- 
-- TABLE: VIDEOJUEGO 
--

ALTER TABLE VIDEOJUEGO ADD CONSTRAINT RefUSUARIO20 
    FOREIGN KEY (ID_USUARIO)
    REFERENCES USUARIO(ID_USUARIO)
;


-- 
-- TABLE: PELICULA 
--

ALTER TABLE PELICULA ADD CONSTRAINT RefUSUARIO23 
    FOREIGN KEY (ID_USUARIO)
    REFERENCES USUARIO(ID_USUARIO)
;


-- 
-- 
-- TABLE: MENSAJES 
--

ALTER TABLE MENSAJES ADD CONSTRAINT RefCONVERSACION21 
    FOREIGN KEY (ID_CONVERSACION)
    REFERENCES CONVERSACION(ID_CONVERSACION)
;


-----
INSERT INTO USUARIO (USUARIO, ROL, NOMBRE, CORREO, CLAVE) VALUES ('DSERRANO','ADMIN','DAVID ALEJANDRO SERRANO SALAZAR','DAVSERR2010@GMAIL.COM','123456');
INSERT INTO USUARIO (USUARIO, ROL, NOMBRE, CORREO, CLAVE) VALUES ('ZGARCIA','USER','ZAIDA YOMARA GARCIA','DAVSERR2010@GMAIL.COM','123456');
INSERT INTO USUARIO (USUARIO, ROL, NOMBRE, CORREO, CLAVE) VALUES ('DISERRANO','USER','DIEGO ALEJANDRO SERRANO GARCIA','DAVSERR2010@GMAIL.COM','123456');


INSERT INTO PELICULA
(titulo, anio_lanzamiento, genero, director, actores, duracion_minutos, calificacion)
VALUES

('El Padrino', 1972, 'Crimen, Drama', 'Francis Ford Coppola',
 'Marlon Brando, Al Pacino, James Caan', 175, 9.2),

('El Padrino II', 1974, 'Crimen, Drama', 'Francis Ford Coppola',
 'Al Pacino, Robert De Niro, Robert Duvall', 202, 9.0),

('El caballero de la noche', 2008, 'Acción, Crimen, Drama', 'Christopher Nolan',
 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine', 152, 9.1),

('Interestelar', 2014, 'Ciencia ficción, Drama', 'Christopher Nolan',
 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', 169, 8.7),

('Inception: El origen', 2010, 'Ciencia ficción, Acción, Suspenso', 'Christopher Nolan',
 'Leonardo DiCaprio, Joseph Gordon-Levitt, Tom Hardy, Ellen Page', 148, 8.8),

('Matrix', 1999, 'Ciencia ficción, Acción', 'Lana Wachowski, Lilly Wachowski',
 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss', 136, 8.7),

('El señor de los anillos: La comunidad del anillo', 2001, 'Fantasía, Aventura', 'Peter Jackson',
 'Elijah Wood, Ian McKellen, Viggo Mortensen, Orlando Bloom', 178, 8.9),

('El señor de los anillos: Las dos torres', 2002, 'Fantasía, Aventura', 'Peter Jackson',
 'Elijah Wood, Viggo Mortensen, Ian McKellen, Orlando Bloom', 179, 8.8),

('El señor de los anillos: El retorno del rey', 2003, 'Fantasía, Aventura', 'Peter Jackson',
 'Elijah Wood, Viggo Mortensen, Ian McKellen, Orlando Bloom', 201, 9.0),

('Forrest Gump', 1994, 'Drama, Romance', 'Robert Zemeckis',
 'Tom Hanks, Robin Wright, Gary Sinise', 142, 8.8),

('Pulp Fiction', 1994, 'Crimen, Drama', 'Quentin Tarantino',
 'John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis', 154, 8.8),

('El club de la pelea', 1999, 'Drama, Suspenso', 'David Fincher',
 'Brad Pitt, Edward Norton, Helena Bonham Carter', 139, 8.8),

('Gladiador', 2000, 'Acción, Drama, Histórico', 'Ridley Scott',
 'Russell Crowe, Joaquin Phoenix, Connie Nielsen', 155, 8.5),

('Django sin cadenas', 2012, 'Western, Drama, Acción', 'Quentin Tarantino',
 'Jamie Foxx, Christoph Waltz, Leonardo DiCaprio', 165, 8.5),

('Los infiltrados', 2006, 'Crimen, Drama, Suspenso', 'Martin Scorsese',
 'Leonardo DiCaprio, Matt Damon, Jack Nicholson, Mark Wahlberg', 151, 8.5),

('El silencio de los inocentes', 1991, 'Crimen, Suspenso, Terror', 'Jonathan Demme',
 'Jodie Foster, Anthony Hopkins, Scott Glenn', 118, 8.6),

('La milla verde', 1999, 'Drama, Fantasía', 'Frank Darabont',
 'Tom Hanks, Michael Clarke Duncan, David Morse', 189, 8.6),

('Terminator 2: El juicio final', 1991, 'Acción, Ciencia ficción', 'James Cameron',
 'Arnold Schwarzenegger, Linda Hamilton, Edward Furlong', 137, 8.6),

('Volver al futuro', 1985, 'Ciencia ficción, Aventura, Comedia', 'Robert Zemeckis',
 'Michael J. Fox, Christopher Lloyd, Lea Thompson', 116, 8.5),

('Jurassic Park', 1993, 'Ciencia ficción, Aventura', 'Steven Spielberg',
 'Sam Neill, Laura Dern, Jeff Goldblum', 127, 8.2),

('Tiburón', 1975, 'Suspenso, Aventura', 'Steven Spielberg',
 'Roy Scheider, Robert Shaw, Richard Dreyfuss', 124, 8.1),

('E.T. el extraterrestre', 1982, 'Ciencia ficción, Aventura', 'Steven Spielberg',
 'Henry Thomas, Drew Barrymore, Peter Coyote', 115, 7.9),

('Titanic', 1997, 'Drama, Romance', 'James Cameron',
 'Leonardo DiCaprio, Kate Winslet, Billy Zane', 194, 7.9),

('Avatar', 2009, 'Ciencia ficción, Aventura', 'James Cameron',
 'Sam Worthington, Zoe Saldana, Sigourney Weaver', 162, 7.8),

('Avatar: El camino del agua', 2022, 'Ciencia ficción, Aventura', 'James Cameron',
 'Sam Worthington, Zoe Saldana, Sigourney Weaver, Kate Winslet', 192, 7.6),

('Avengers: Endgame', 2019, 'Acción, Ciencia ficción, Aventura', 'Anthony Russo, Joe Russo',
 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Scarlett Johansson', 181, 8.4),

('Avengers: Infinity War', 2018, 'Acción, Ciencia ficción, Aventura', 'Anthony Russo, Joe Russo',
 'Robert Downey Jr., Chris Hemsworth, Chris Evans, Josh Brolin', 149, 8.4),

('Iron Man', 2008, 'Acción, Ciencia ficción', 'Jon Favreau',
 'Robert Downey Jr., Gwyneth Paltrow, Jeff Bridges', 126, 7.9),

('Spider-Man: Sin camino a casa', 2021, 'Acción, Ciencia ficción, Aventura', 'Jon Watts',
 'Tom Holland, Zendaya, Benedict Cumberbatch', 148, 8.2),

('Black Panther', 2018, 'Acción, Aventura, Ciencia ficción', 'Ryan Coogler',
 'Chadwick Boseman, Michael B. Jordan, Lupita Nyong''o', 134, 7.3),

('Joker', 2019, 'Crimen, Drama, Suspenso', 'Todd Phillips',
 'Joaquin Phoenix, Robert De Niro, Zazie Beetz', 122, 8.3),

('Parásitos', 2019, 'Drama, Suspenso', 'Bong Joon Ho',
 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong', 132, 8.5),

('Oppenheimer', 2023, 'Drama, Histórico', 'Christopher Nolan',
 'Cillian Murphy, Emily Blunt, Robert Downey Jr., Matt Damon', 180, 8.6),

('Barbie', 2023, 'Comedia, Fantasía', 'Greta Gerwig',
 'Margot Robbie, Ryan Gosling, America Ferrera', 114, 6.8),

('Duna', 2021, 'Ciencia ficción, Aventura, Drama', 'Denis Villeneuve',
 'Timothée Chalamet, Rebecca Ferguson, Oscar Isaac', 155, 8.0),

('Duna: Parte Dos', 2024, 'Ciencia ficción, Aventura, Drama', 'Denis Villeneuve',
 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Austin Butler', 166, 8.5),

('Toy Story', 1995, 'Animación, Aventura, Comedia', 'John Lasseter',
 'Tom Hanks, Tim Allen, Don Rickles', 81, 8.3),

('Toy Story 3', 2010, 'Animación, Aventura, Comedia', 'Lee Unkrich',
 'Tom Hanks, Tim Allen, Joan Cusack', 103, 8.3),

('Coco', 2017, 'Animación, Aventura, Fantasía', 'Lee Unkrich, Adrian Molina',
 'Anthony Gonzalez, Gael García Bernal, Benjamin Bratt', 105, 8.4),

('Encanto', 2021, 'Animación, Fantasía, Musical', 'Jared Bush, Byron Howard, Charise Castro Smith',
 'Stephanie Beatriz, María Cecilia Botero, John Leguizamo', 102, 7.2),

('El viaje de Chihiro', 2001, 'Animación, Fantasía, Aventura', 'Hayao Miyazaki',
 'Rumi Hiiragi, Miyu Irino, Mari Natsuki', 125, 8.6),

('Spider-Man: Un nuevo universo', 2018, 'Animación, Acción, Aventura',
 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
 'Shameik Moore, Jake Johnson, Hailee Steinfeld', 117, 8.4),

('Los Increíbles', 2004, 'Animación, Acción, Aventura', 'Brad Bird',
 'Craig T. Nelson, Holly Hunter, Samuel L. Jackson', 115, 8.0),

('Harry Potter y la piedra filosofal', 2001, 'Fantasía, Aventura', 'Chris Columbus',
 'Daniel Radcliffe, Emma Watson, Rupert Grint', 152, 7.6),

('Harry Potter y las reliquias de la muerte: Parte 2', 2011, 'Fantasía, Aventura, Drama', 'David Yates',
 'Daniel Radcliffe, Emma Watson, Rupert Grint', 130, 8.1),

('Star Wars: El imperio contraataca', 1980, 'Ciencia ficción, Aventura', 'Irvin Kershner',
 'Mark Hamill, Harrison Ford, Carrie Fisher', 124, 8.7),

('Star Wars: Una nueva esperanza', 1977, 'Ciencia ficción, Aventura', 'George Lucas',
 'Mark Hamill, Harrison Ford, Carrie Fisher', 121, 8.6),

('Mad Max: Furia en el camino', 2015, 'Acción, Ciencia ficción', 'George Miller',
 'Tom Hardy, Charlize Theron, Nicholas Hoult', 120, 8.1),

('Whiplash: Música y obsesión', 2014, 'Drama, Música', 'Damien Chazelle',
 'Miles Teller, J.K. Simmons, Paul Reiser', 106, 8.5),

('La La Land: Una historia de amor', 2016, 'Musical, Drama, Romance', 'Damien Chazelle',
 'Ryan Gosling, Emma Stone, John Legend', 128, 8.0);



INSERT INTO VIDEOJUEGO (
    titulo,
    genero,
    plataforma,
    anio_lanzamiento,
    calificacion,
    desarrollador,
    jugadores
) VALUES

('Minecraft', 'Sandbox', 'PC, PlayStation, Xbox, Switch, Móvil', 2011, 9.0, 'Mojang Studios', '1-8+'),

('Grand Theft Auto V', 'Acción / Mundo abierto', 'PC, PlayStation, Xbox', 2013, 9.5, 'Rockstar North', '1-30'),

('Red Dead Redemption 2', 'Acción / Aventura', 'PC, PlayStation, Xbox', 2018, 9.8, 'Rockstar Studios', '1-32'),

('The Last of Us', 'Acción / Aventura', 'PlayStation, PC', 2013, 9.5, 'Naughty Dog', '1'),

('The Last of Us Part II', 'Acción / Aventura', 'PlayStation', 2020, 9.2, 'Naughty Dog', '1'),

('The Legend of Zelda: Breath of the Wild', 'Aventura / Acción', 'Nintendo Switch, Wii U', 2017, 9.7, 'Nintendo', '1'),

('The Legend of Zelda: Tears of the Kingdom', 'Aventura / Acción', 'Nintendo Switch', 2023, 9.6, 'Nintendo', '1'),

('Super Mario Odyssey', 'Plataformas / Aventura', 'Nintendo Switch', 2017, 9.5, 'Nintendo', '1-2'),

('Mario Kart 8 Deluxe', 'Carreras', 'Nintendo Switch', 2017, 9.2, 'Nintendo', '1-12'),

('Super Smash Bros. Ultimate', 'Lucha', 'Nintendo Switch', 2018, 9.3, 'Bandai Namco Studios / Sora Ltd.', '1-8'),

('Pokémon Rojo y Azul', 'RPG', 'Game Boy', 1996, 9.0, 'Game Freak', '1-2'),

('Pokémon Escarlata y Violeta', 'RPG', 'Nintendo Switch', 2022, 8.0, 'Game Freak', '1-4'),

('Fortnite', 'Battle Royale / Acción', 'PC, PlayStation, Xbox, Switch, Móvil', 2017, 8.5, 'Epic Games', '1-100'),

('Call of Duty: Warzone', 'Battle Royale / Shooter', 'PC, PlayStation, Xbox', 2020, 8.2, 'Infinity Ward / Raven Software', '1-150'),

('Call of Duty: Modern Warfare', 'Shooter', 'PC, PlayStation, Xbox', 2019, 8.5, 'Infinity Ward', '1-64'),

('Counter-Strike 2', 'Shooter táctico', 'PC', 2023, 8.5, 'Valve', '1-10'),

('League of Legends', 'MOBA', 'PC', 2009, 9.0, 'Riot Games', '1-10'),

('Dota 2', 'MOBA', 'PC', 2013, 9.0, 'Valve', '1-10'),

('Valorant', 'Shooter táctico', 'PC', 2020, 8.5, 'Riot Games', '1-10'),

('Overwatch 2', 'Shooter / Acción', 'PC, PlayStation, Xbox, Switch', 2022, 8.0, 'Blizzard Entertainment', '1-10'),

('Elden Ring', 'RPG / Acción', 'PC, PlayStation, Xbox', 2022, 9.6, 'FromSoftware', '1-4'),

('Dark Souls', 'RPG / Acción', 'PC, PlayStation, Xbox', 2011, 9.0, 'FromSoftware', '1-4'),

('Bloodborne', 'RPG / Acción', 'PlayStation', 2015, 9.5, 'FromSoftware', '1-5'),

('Sekiro: Shadows Die Twice', 'Acción / Aventura', 'PC, PlayStation, Xbox', 2019, 9.5, 'FromSoftware', '1'),

('Cyberpunk 2077', 'RPG / Mundo abierto', 'PC, PlayStation, Xbox', 2020, 8.5, 'CD Projekt Red', '1'),

('The Witcher 3: Wild Hunt', 'RPG / Mundo abierto', 'PC, PlayStation, Xbox, Switch', 2015, 9.8, 'CD Projekt Red', '1'),

('Baldur’s Gate 3', 'RPG', 'PC, PlayStation, Xbox', 2023, 9.7, 'Larian Studios', '1-4'),

('God of War', 'Acción / Aventura', 'PlayStation, PC', 2018, 9.5, 'Santa Monica Studio', '1'),

('God of War Ragnarök', 'Acción / Aventura', 'PlayStation, PC', 2022, 9.5, 'Santa Monica Studio', '1'),

('Horizon Zero Dawn', 'RPG / Acción', 'PlayStation, PC', 2017, 9.0, 'Guerrilla Games', '1'),

('Horizon Forbidden West', 'RPG / Acción', 'PlayStation, PC', 2022, 9.0, 'Guerrilla Games', '1'),

('Assassin’s Creed II', 'Acción / Aventura', 'PC, PlayStation, Xbox', 2009, 9.0, 'Ubisoft Montreal', '1'),

('Assassin’s Creed Valhalla', 'RPG / Acción', 'PC, PlayStation, Xbox', 2020, 8.5, 'Ubisoft Montreal', '1'),

('Resident Evil 4', 'Survival Horror / Acción', 'PC, PlayStation, Xbox', 2005, 9.5, 'Capcom', '1'),

('Resident Evil 2', 'Survival Horror', 'PC, PlayStation, Xbox', 2019, 9.2, 'Capcom', '1'),

('Silent Hill 2', 'Survival Horror', 'PC, PlayStation', 2001, 9.2, 'Konami', '1'),

('Final Fantasy VII', 'RPG', 'PlayStation, PC, Switch', 1997, 9.5, 'Square', '1'),

('Final Fantasy VII Rebirth', 'RPG / Acción', 'PlayStation', 2024, 9.0, 'Square Enix', '1'),

('Halo: Combat Evolved', 'Shooter', 'Xbox, PC', 2001, 9.5, 'Bungie', '1-16'),

('Halo Infinite', 'Shooter', 'PC, Xbox', 2021, 8.5, '343 Industries', '1-24'),

('Super Mario Bros.', 'Plataformas', 'NES', 1985, 9.0, 'Nintendo', '1-2'),

('Sonic the Hedgehog', 'Plataformas', 'Mega Drive / Genesis', 1991, 9.0, 'Sonic Team', '1'),

('Terraria', 'Sandbox / Aventura', 'PC, Consolas, Móvil', 2011, 9.0, 'Re-Logic', '1-8'),

('Among Us', 'Multijugador / Deducción', 'PC, Móvil, Consolas', 2018, 8.0, 'Innersloth', '4-15'),

('Roblox', 'Plataforma / Sandbox', 'PC, Móvil, Consolas', 2006, 8.0, 'Roblox Corporation', '1+'),

('Free Fire', 'Battle Royale', 'Móvil', 2017, 8.0, 'Garena', '1-50'),

('Candy Crush Saga', 'Puzzle', 'Móvil, Web', 2012, 8.0, 'King', '1'),

('Clash of Clans', 'Estrategia', 'Móvil', 2012, 8.5, 'Supercell', '1+'),

('League of Legends: Wild Rift', 'MOBA', 'Móvil', 2020, 8.5, 'Riot Games', '1-10'),

('It Takes Two', 'Aventura / Plataformas', 'PC, PlayStation, Xbox, Switch', 2021, 9.0, 'Hazelight Studios', '2'),

('Animal Crossing: New Horizons', 'Simulación / Sandbox', 'Nintendo Switch', 2020, 8.5, 'Nintendo', '1-8'),

('Hogwarts Legacy', 'RPG / Aventura', 'PC, PlayStation, Xbox, Switch', 2023, 8.5, 'Avalanche Software', '1'),

('Marvel''s Spider-Man: Miles Morales', 'Acción / Aventura', 'PlayStation, PC', 2020, 8.5, 'Insomniac Games', '1'),

('Marvel''s Spider-Man 2', 'Acción / Aventura', 'PlayStation, PC', 2023, 9.0, 'Insomniac Games', '1'),

('Forza Horizon 5', 'Carreras / Mundo abierto', 'PC, Xbox', 2021, 9.0, 'Playground Games', '1-12'),

('Resident Evil Village', 'Survival Horror / Acción', 'PC, PlayStation, Xbox', 2021, 8.5, 'Capcom', '1'),

('Dead Space', 'Survival Horror / Acción', 'PC, PlayStation, Xbox', 2023, 8.5, 'Motive Studio', '1'),

('Street Fighter 6', 'Lucha', 'PC, PlayStation, Xbox', 2023, 8.8, 'Capcom', '1-2'),

('Tekken 8', 'Lucha', 'PC, PlayStation, Xbox', 2024, 8.5, 'Bandai Namco Studios', '1-2'),

('Mortal Kombat 1', 'Lucha', 'PC, PlayStation, Xbox, Switch', 2023, 8.0, 'NetherRealm Studios', '1-2'),

('Dragon Ball: Sparking! ZERO', 'Lucha / Acción', 'PC, PlayStation, Xbox', 2024, 8.5, 'Spike Chunsoft', '1-2'),

('Black Myth: Wukong', 'RPG / Acción', 'PC, PlayStation', 2024, 8.5, 'Game Science', '1'),

('Palworld', 'Supervivencia / Acción', 'PC, Xbox', 2024, 8.0, 'Pocketpair', '1-32'),

('Helldivers 2', 'Shooter / Acción', 'PC, PlayStation', 2024, 8.5, 'Arrowhead Game Studios', '1-4'),

('Astro Bot', 'Plataformas / Aventura', 'PlayStation 5', 2024, 9.0, 'Team Asobi', '1'),

('Metaphor: ReFantazio', 'RPG', 'PC, PlayStation, Xbox', 2024, 9.0, 'Studio Zero', '1'),

('EA Sports FC 24', 'Deportes / Fútbol', 'PC, PlayStation, Xbox, Switch', 2023, 8.0, 'EA Vancouver', '1-22'),

('EA Sports FC 25', 'Deportes / Fútbol', 'PC, PlayStation, Xbox, Switch', 2024, 7.8, 'EA Canada', '1-22'),

('Marvel Rivals', 'Shooter / Acción', 'PC, PlayStation, Xbox', 2024, 8.0, 'NetEase Games', '1-12');