package main

import (
	"encoding/json"
	"fmt"
	"os"

	static "github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/olahol/melody"
)

type ToolInfo struct {
	ID, X, Y string
}

type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type TCoords [2]Position

// bool, for JSON booleans
// float64, for JSON numbers
// string, for JSON strings
// []interface{}, for JSON arrays
// map[string]interface{}, for JSON objects
// nil for JSON null
type Action struct {
	Type          string      `json:"type"`
	BoardId       string      `json:"boardId"`
	EventId       string      `json:"eventId"`
	Coords        [2]Position `json:"coords"`
	MousePosition Position    `json:"mousePosition"`
	JoinOrder     int         `json:"joinOrder"`
}

// go run *.go

func main() {
	r := gin.Default()
	m := melody.New()

	c, collabs := Cache()

	r.Use(static.Serve("/", static.LocalFile("./public", true)))

	r.GET("/ws", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	m.HandleConnect(func(currSession *melody.Session) {
		sessions, _ := m.Sessions()
		fmt.Println("Handling Connection")
		fmt.Println(len(sessions))

		id := uuid.NewString()
		currSession.Set("info", &ToolInfo{id, "0", "0"})

		for _, session := range sessions {
			info := session.MustGet("info").(*ToolInfo)
			currSession.Write([]byte("set " + info.ID + " " + info.X + " " + info.Y))
		}

		currSession.Write([]byte("i am " + id))
	})

	m.HandleDisconnect(func(s *melody.Session) {
		info := s.MustGet("info").(*ToolInfo)
		m.BroadcastOthers([]byte("disconnected "+info.ID), s)

		action := struct {
			info   ToolInfo
			action string
		}{
			*info,
			"disconnect",
		}

		bs, _ := json.Marshal(action)

		m.BroadcastOthers(bs, s)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		var action Action
		json.Unmarshal(msg, &action)

		fmt.Println("Receiving message: " + action.Type + " " + fmt.Sprintf("%f", action.Coords[0].X))

		switch action.Type {
		case "updateSingleDrawingPosition":
			{
				fmt.Printf("action.Id: %v\n", action.BoardId)
				fmt.Printf("action.coords: %v\n", action.Coords)

				bs, _ := json.Marshal(action)
				m.BroadcastOthers(bs, s)
				// c.add(action)
			}
		case "rtMousePosition":
			{
				fmt.Printf("action.EventId: %v\n", action.EventId)
				fmt.Printf("action.BoardId: %v\n", action.BoardId)
				fmt.Printf("action.MousePosition: %v\n", action.MousePosition)

				bs, _ := json.Marshal(action)

				m.BroadcastOthers(bs, s)
				// c.add(action)
			}
		case "collabChange":
			{
				fmt.Printf("action.EventId: %v\n", action.EventId)
				fmt.Printf("action.BoardId: %v\n", action.BoardId)
				fmt.Printf("action.mousePosition: %v\n", action.MousePosition)
				// c.add(action)
				collabs[action.BoardId] = true
				action.JoinOrder = len(collabs)
				bs, _ := json.Marshal(action)

				// Let the caller know too
				m.Broadcast(bs)
			}
		default:
			{
				bs, _ := json.Marshal(action)
				m.Broadcast([]byte(bs))

			}

		}

		c.Print()

	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	r.Run(":" + port)
}
