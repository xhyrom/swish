package database

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Database struct {
	*sql.DB 
}

type Track struct {
	Id int `json:"id"`
	VideoId string `json:"video_id"`
	From string `json:"from_user"`
	To string `json:"to_user"`
}

func NewDatabase(creds Credentials) *Database {
	db, err := sql.Open("postgres", creds.ConnectionString())
	if err != nil {
		panic(err)
	}

	return &Database{db}
}

func (d *Database) GetQueue() []Track {
	rows, err := d.Query("SELECT * FROM queue")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	var queue []Track
	for rows.Next() {
		var track Track
		if err := rows.Scan(&track.Id, &track.VideoId, &track.From, &track.To); err != nil {
			panic(err)
		}
		queue = append(queue, track)
	}

	return queue
}