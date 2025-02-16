import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

interface Issue {
  id: number
  title: string
  state: string
  initial_message: string
  comments_markdown: string
  reaction: string
}

function IssueDetails(){
  const { issueId } = useParams()
  const [issue, setIssue] = useState<Issue | null>(null)

  useEffect(() => {
    fetch(`http://localhost:5001/api/issues/${issueId}`)
      .then((resp) => resp.json())
      .then((data: Issue) => {
        setIssue(data)
      })
      .catch((err) => {
        console.error('Error fetching issue details:', err)
      })
  }, [issueId])

  if (!issue) {
    return <p>Loading issue details...</p>
  }

  return (
    <div className="lg:px-10 sm:px-4 px-4 pb-10 max-w-full overflow-hidden">
      <h2 className="text-2xl font-bold text-primary mb-4">
        #{issue.id} – {issue.title}
      </h2>

      <div className="text-gray-700 flex flex-col">
        <span>
          <strong className="text-gray-900">State:</strong> {issue.state}
        </span>
        <span>
          <strong className="text-gray-900">Reaction:</strong> {issue.reaction}
        </span>
      </div>

      <div className="mb-6 border lg:px-10 sm:px-4 px-4 py-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Initial Message</h3>
        <div className="space-y-2">
          <ReactMarkdown>{issue.initial_message}</ReactMarkdown>
        </div>
      </div>

      {issue.comments_markdown && issue.comments_markdown.trim() && (
      <div className="overflow-x-auto mb-6 border lg:px-10 sm:px-4 px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Comments</h3>
        <div className="border-t pt-4 break-words overflow-x-auto space-y-2">
          <ReactMarkdown>{issue.comments_markdown}</ReactMarkdown>
        </div>
      </div>
      )}

      <hr className="my-6 border-gray-300" />
      <a href="/" className="inline-flex items-center text-blue-600 hover:underline">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Issues List
      </a>
    </div>

  )
}

export default IssueDetails
