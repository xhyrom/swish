package player

import (
	"math/rand"
	"time"

	"github.com/gopxl/beep"
	"github.com/gopxl/beep/effects"
	"github.com/gopxl/beep/speaker"
)

func Noise() beep.Streamer {
	return beep.StreamerFunc(func(samples [][2]float64) (n int, ok bool) {
		for i := range samples {
			samples[i][0] = rand.Float64()*2 - 1
			samples[i][1] = rand.Float64()*2 - 1
		}
		return len(samples), true
	})
}

func Play() {
	done := make(chan bool)
	sr := beep.SampleRate(44100)
	speaker.Init(sr, sr.N(time.Second/10))

	volume := &effects.Volume{
		Streamer: Noise(),
		Base:     2,
		Volume:   -8,
		Silent:   false,
	}
	speaker.Play(beep.Seq(volume, beep.Callback(func() {
		done <- true
	})))

	<-done
}