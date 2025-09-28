"use client"

import { useState, useEffect } from "react"
import { api, type Course } from "@/services/api"

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const data = await api.getCourses()
        setCourses(data)
      } catch (err) {
        setError("Failed to fetch courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const createCourse = async (courseData: Omit<Course, "id">) => {
    try {
      const newCourse = await api.createCourse(courseData)
      setCourses((prev) => [...prev, newCourse])
      return newCourse
    } catch (err) {
      setError("Failed to create course")
      throw err
    }
  }

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      const updatedCourse = await api.updateCourse(id, updates)
      if (updatedCourse) {
        setCourses((prev) => prev.map((course) => (course.id === id ? updatedCourse : course)))
      }
      return updatedCourse
    } catch (err) {
      setError("Failed to update course")
      throw err
    }
  }

  const deleteCourse = async (id: string) => {
    try {
      const success = await api.deleteCourse(id)
      if (success) {
        setCourses((prev) => prev.filter((course) => course.id !== id))
      }
      return success
    } catch (err) {
      setError("Failed to delete course")
      throw err
    }
  }

  return {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    refetch: () => {
      setLoading(true)
      api
        .getCourses()
        .then(setCourses)
        .finally(() => setLoading(false))
    },
  }
}
