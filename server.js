const express = require("express");
const fs = require("fs");
const sqlite = require("sqlite3").verbose();

const db = new sqlite.Database("./db/music.sqlite3");

const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const COLUMNS_ARTIST = [
  "artist.name as artist_name",
  "artist.picture as artist_picture",
  "artist.address as artist_address"
];

const COLUMNS_SONG = [
  "song.id",
  "song.name",
  "song.source",
  "song.copyright"
];

app.get("/api/eeg", (req, res) => {
  db.serialize(function() {
    // WARNING: Not for production use! The following statement
    // is not protected against SQL injections.
    const r = db.all(
      `
      select value from wave order by id desc limit 10;
      `
    , (err, rows) =>{
      if (rows){
        res.json(rows);
    }else{
      res.json([]);
    }});
  });
});

app.get("/api/song", (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }
  db.serialize(function() {
    // WARNING: Not for production use! The following statement
    // is not protected against SQL injections.
    const r = db.all(
      `
      select ${COLUMNS_ARTIST.join(", ")}, ${COLUMNS_SONG.join(", ")} from artist inner join song
      on artist.id = song.artist_id where artist.name like '%${param}%' or song.name like '%${param}%'
      limit 100
      `
    , (err, rows) =>{
      if (rows){
        res.json(rows);
    }else{
      res.json([]);
    }});
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
