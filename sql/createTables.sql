DROP TABLE movie;
DROP TABLE match_record;

CREATE TABLE movie(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    year VARCHAR(100) NOT NULL,
    director VARCHAR(100) NOT NULL,
    poster VARCHAR(500),
    score INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX inx_score ON movie(score);

CREATE TABLE match_record(
    id INT NOT NULL AUTO_INCREMENT,
    winning_id INT NOT NULL,
    losing_id INT NOT NULL,
    winning_score_before INT NOT NULL,
    losing_score_before INT NOT NULL,
    winning_score_after INT NOT NULL,
    losing_score_after INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE tmdb_movie(
    id INT NOT NULL AUTO_INCREMENT,
    tmdb_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    poster VARCHAR(500),
    score INT NOT NULL,
    PRIMARY KEY (id)
)