package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	*pgxpool.Pool 
}

type Track struct {
	Id int `json:"id"`
	VideoId string `json:"video_id"`
	From *string `json:"from_user"`
	To *string `json:"to_user"`
}

func NewDatabase(creds Credentials) *Database {
	db, err := pgxpool.New(context.Background(), creds.ConnectionString())
	if err != nil {
		panic(err)
	}

	return &Database{db}
}

func (d *Database) GetQueue() []Track {
	rows, err := d.Query(context.Background(), "SELECT * FROM queue")
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