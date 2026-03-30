/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useDiary(user) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletedEntry, setDeletedEntry] = useState(null)
  const [showUndo, setShowUndo] = useState(false)
  const [undoTimeLeft, setUndoTimeLeft] = useState(5)
  const undoTimeoutRef = useRef(null)
  const timerIntervalRef = useRef(null)

  useEffect(() => {
    if (!user) {
      setEntries([])
      setLoading(false)
      return
    }

    let isMounted = true

    const loadEntries = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .order('date', { ascending: false })
      
      if (!isMounted) return
      
      if (error) {
        setEntries([])
      } else {
        setEntries(data)
      }
      setLoading(false)
    }

    loadEntries()

    return () => {
      isMounted = false
    }
  }, [user])

  const getEntry = useCallback((date) => {
    return entries.find(entry => entry.date === date)
  }, [entries])

  const saveEntry = useCallback(async (date, content) => {
    if (!user) return false

    // Если есть активное уведомление об удалении для этой даты — сбрасываем
    if (deletedEntry && deletedEntry.date === date && showUndo) {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current)
        undoTimeoutRef.current = null
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      setDeletedEntry(null)
      setShowUndo(false)
      setUndoTimeLeft(5)
    }

    const existing = getEntry(date)
    
    if (existing) {
      const { error } = await supabase
        .from('diary_entries')
        .update({ content: content.trim() })
        .eq('id', existing.id)
      
      if (error) return false
      
      setEntries(prev => prev.map(e => 
        e.id === existing.id ? { ...e, content: content.trim() } : e
      ))
    } else {
      const { data, error } = await supabase
        .from('diary_entries')
        .insert({
          user_id: user.id,
          date,
          content: content.trim()
        })
        .select()
      
      if (error) return false
      
      setEntries(prev => [data[0], ...prev])
    }
    
    return true
  }, [user, getEntry, deletedEntry, showUndo])

  const deleteEntry = useCallback(async (date) => {
    if (!user) return false

    const entry = getEntry(date)
    if (!entry) return false

    setDeletedEntry(entry)
    setShowUndo(true)
    setUndoTimeLeft(5)
    
    setEntries(prev => prev.filter(e => e.id !== entry.id))

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    timerIntervalRef.current = setInterval(() => {
      setUndoTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    undoTimeoutRef.current = setTimeout(async () => {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', entry.id)
      
      if (error) {
        setEntries(prev => [...prev, entry].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        ))
      }
      
      setDeletedEntry(null)
      setShowUndo(false)
      setUndoTimeLeft(5)
      undoTimeoutRef.current = null
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }, 5000)

    return true
  }, [user, getEntry])

  const undoDelete = useCallback(async () => {
    if (!deletedEntry) return null

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
      undoTimeoutRef.current = null
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    const restored = { ...deletedEntry }
    
    setEntries(prev => [...prev, restored].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    ))
    
    setDeletedEntry(null)
    setShowUndo(false)
    setUndoTimeLeft(5)
    
    return restored
  }, [deletedEntry])

  return { 
    entries, 
    loading, 
    getEntry, 
    saveEntry, 
    deleteEntry,
    undoDelete,
    showUndo,
    undoTimeLeft
  }
}