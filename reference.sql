-- Get password for specific user
select password from users where id = ?;

-- sign up
insert into users(id, username, password) values (?,?,?)



-- Get all user decks | assuming already have user id
select * from user_deck where id = ?;

-- get number of decks user have already
select count(*) from user_deck where id = ?;

-- delete deck | meaning user have to send deck id with them
delete from user_deck where deckid=?

-- update deck | send all details
update user_deck set deckname = ?, deck = ? where deckid = ?

-- Adding deck
insert into user_deck(deckid, userid, deckname, deck) values (?,?,?,?)