-- password
INSERT INTO users(id, username, password) VALUES ('1','passworkd', '$argon2id$v=19$m=65536,t=3,p=4$0toyJJQ6Xdv5rUQq1cCoCQ$hYs/2qQrQDy4gld9v4fy0kiQnBzpAu/FWyJgyTq3Ito');
-- abc
INSERT INTO users(id, username, password) VALUES ('2','abc', '$argon2id$v=19$m=65536,t=3,p=4$aet/Up/t2f9Bu8teKj5SZA$KTYJ35q136nHVyphnqR3Zs9an5gS0hn1inw5YUoi8TU');
-- fiddlesticks
INSERT INTO users(id, username, password) VALUES ('3','fiddlesticks', '$argon2id$v=19$m=65536,t=3,p=4$KwUDBdwmyFhYtFmdiUI+Nw$aVYp48DsGXYrBYMELdUbj4iO89eS8BwOhK9OPhYHQOE');
-- correcthorsebatterystaple
INSERT INTO users(id, username, password) VALUES ('4','correcthorsebatterystaple', '$argon2id$v=19$m=65536,t=3,p=4$A2+TzjOmpPShDeSaGiBjEg$zf1NFDQYKZWHXhge/f9ZhjrmmnzQ8v8q4UWHXX75SMI');


INSERT INTO user_stat(id, wins, total) VALUES('1', 10, 20);
INSERT INTO user_stat(id, wins, total) VALUES('2', 5, 15);
INSERT INTO user_stat(id, wins, total) VALUES('3', 10, 20);
INSERT INTO user_stat(id, wins, total) VALUES('4', 5, 15);


INSERT INTO user_deck(deckid, userid, deckname, deck) VALUES('1', '1', 'My deck', '[1,2,3]');
INSERT INTO user_deck(deckid, userid, deckname, deck) VALUES('2', '2', 'Test deck', '[4,5,6]');