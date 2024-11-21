'use client'

import React, { useState } from 'react'
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react'

export default function UploadAssignment() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [course, setCourse] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setIsUploading(true)
    // Simulating an upload process
    setTimeout(() => {
      setIsUploading(false)
      setUploadStatus('success')
      // Reset form after successful upload
      setSelectedFile(null)
      setCourse('')
      setDueDate('')
      setDescription('')
    }, 2000)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-purple-900 mb-12">
          <Upload className="inline-block mr-2 mb-1" size={36} />
          Upload Assignment
        </h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          <div className="mb-6">
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Select a course</option>
              <option value="intro-programming">Intro to Programming</option>
              <option value="data-structures">Data Structures</option>
              <option value="algorithms">Algorithms</option>
              <option value="web-development">Web Development</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Assignment File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                    <span>Upload a file</span>
                    <input id="file" name="file" type="file" className="sr-only" onChange={handleFileChange} required />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Assignment'}
            </button>
          </div>
        </form>
        {uploadStatus && (
          <div className={`mt-4 p-4 rounded-md ${uploadStatus === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {uploadStatus === 'success' ? (
              <div className="flex items-center text-green-800">
                <CheckCircle className="mr-2" size={20} />
                Assignment uploaded successfully!
              </div>
            ) : (
              <div className="flex items-center text-red-800">
                <AlertCircle className="mr-2" size={20} />
                Error uploading assignment. Please try again.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}