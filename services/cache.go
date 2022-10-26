package main

import (
	"errors"
	"fmt"
	"sync"
)

type record = Action

type memCache struct {
	mutex   sync.RWMutex
	records map[string]record
}

type collabCache struct {
	collabs map[string]bool
}

func Cache() (*memCache, map[string]bool) {
	c := &memCache{
		records: make(map[string]record),
	}

	cc := make(map[string]bool)

	return c, cc
}

func (cache *memCache) add(r record) {
	cache.mutex.Lock()
	defer cache.mutex.Unlock()

	cache.records[r.EventId] = r
}

var (
	errorNotInCache = errors.New("Record is not in cache")
)

func (cache *memCache) read(id string) (record, error) {
	cache.mutex.RLock()
	defer cache.mutex.RUnlock()

	r, ok := cache.records[id]
	if !ok {
		return record{}, errorNotInCache
	}

	return r, nil
}

func (cache *memCache) remove(id string) {
	cache.mutex.Lock()
	defer cache.mutex.Unlock()

	delete(cache.records, id)
}

func (cache *memCache) Print() {
	cache.mutex.RLock()
	defer cache.mutex.RUnlock()

	fmt.Println(cache.records)
}
