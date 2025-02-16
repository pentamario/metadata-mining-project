import React from 'react'
import { Routes, Route } from 'react-router-dom'
import IssuesList from './IssuesList'
import IssueDetails from './IssueDetails'

function App()  {
  return (
    <div>
      <Routes>
        <Route path="/" element={<IssuesList />} />
        <Route path="/issues/:issueId" element={<IssueDetails />} />
      </Routes>
    </div>
  )
}

export default App
