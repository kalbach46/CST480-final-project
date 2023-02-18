CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT,
    password TEXT,
);

-- Optional feature, may or may not use
CREATE TABLE user_stat(
    id TEXT UNIQUE,
    wins INTEGER,
    total INTEGER,
    FOREIGN KEY(id) REFERENCES users(id),
)

CREATE TABLE user_deck( -- We can limit on JS side
    deckid TEXT PRIMARY KEY, -- UUID ?
    userid TEXT,
    deckname TEXT,
    deck TEXT, -- Should be JSON string list : ex : [1,2,3,4,...]
    FOREIGN KEY(userid) REFERENCES users(id)
)