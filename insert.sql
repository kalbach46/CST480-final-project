-- Chatgpt lol
INSERT INTO users(id, username, password) VALUES('1', 'Alice', 'password123');
INSERT INTO users(id, username, password) VALUES('2', 'Bob', 'password456');

INSERT INTO user_stat(id, wins, total) VALUES('1', 10, 20);
INSERT INTO user_stat(id, wins, total) VALUES('2', 5, 15);

INSERT INTO user_deck(deckid, userid, deckname, deck) VALUES('d1', '1', 'My deck', '[1,2,3]');
INSERT INTO user_deck(deckid, userid, deckname, deck) VALUES('d2', '2', 'Test deck', '[4,5,6]');