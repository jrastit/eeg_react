#!/usr/bin/env ruby

require 'sqlite3'
require 'csv'

COLUMNS_ARTIST = {
 id: 'int',
 name: 'varchar(100)',
 picture: 'varchar(200)',
 address: 'varchar(100)'
}

COLUMNS_SONG = {
	id: 'int',
	name: 'varchar(100)',
 	source: 'varchar(200)',
	artist_id: 'int',
 	copyright: 'varchar(300)'
}

COLUMNS_WAVE = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
	value: 'INT',
 	my_time: 'TIMESTAMP',
}

db = SQLite3::Database.new '../music.sqlite3'

res = db.execute 'SELECT name FROM sqlite_master WHERE type = "table"'

if res.flatten.include?('wave')
  puts 'table `entries` already exists — dropping'
  db.execute 'DROP TABLE wave'
end

columns = COLUMNS_WAVE.inject('') do |memo, pair|
  name, type = pair
  memo += "\n#{name} #{type},"
end.chomp(',')

db.execute <<-SQL
  create table wave (
    #{columns}
  );
SQL

if res.flatten.include?('artist')
  puts 'table `entries` already exists — dropping'
  db.execute 'DROP TABLE artist'
end

columns = COLUMNS_ARTIST.inject('') do |memo, pair|
  name, type = pair
  memo += "\n#{name} #{type},"
end.chomp(',')

db.execute <<-SQL
  create table artist (
    #{columns}
  );
SQL

print "Working..."

dir = File.dirname(File.expand_path(__FILE__))
lineno_artist = 1
CSV.foreach(File.join(dir, 'raw-artist.csv'), {:encoding => 'ISO8859-1'}) do |row|
  lineno_artist = $.

  next if lineno_artist == 1
  print '.' if lineno_artist % 1 == 0

  # Humanize descriptions
  # row[1] = row[1].capitalize.gsub(/([\,\/])\s*/, '\1 ').gsub(/\s*\&\s*/, ' \1 ')

  sql = <<-SQL
    INSERT INTO artist (#{COLUMNS_ARTIST.keys.join(', ')})
    VALUES (#{(['?'] * COLUMNS_ARTIST.size).join(', ')})
	SQL
  db.execute sql, row
end

print "\n"

if res.flatten.include?('song')
  puts 'table `song` already exists — dropping'
  db.execute 'DROP TABLE song'
end

columns = COLUMNS_SONG.inject('') do |memo, pair|
  name, type = pair
  memo += "\n#{name} #{type},"
end.chomp(',')

db.execute <<-SQL
  create table song (
    #{columns}
  );
SQL

print "Working..."

dir = File.dirname(File.expand_path(__FILE__))
lineno_song = 1
CSV.foreach(File.join(dir, 'raw-song.csv'), {:encoding => 'ISO8859-1'}) do |row|
  lineno_song = $.

  next if lineno_song == 1
  print '.' if lineno_song % 1 == 0

  # Humanize descriptions
  # row[1] = row[1].capitalize.gsub(/([\,\/])\s*/, '\1 ').gsub(/\s*\&\s*/, ' \1 ')

  sql = <<-SQL
    INSERT INTO song (#{COLUMNS_SONG.keys.join(', ')})
    VALUES (#{(['?'] * COLUMNS_SONG.size).join(', ')})
	SQL
  db.execute sql, row
end

print "\n"

print "done."
print "\n#{lineno_artist - 1} artist, #{lineno_song - 1} song imported.\n"
