import React from "react";
import { Link } from "react-router-dom";
import { useIssues }  from "./hooks/useIssues";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";


const IssuesList: React.FC = () => {
  const { searchTerm, setSearchTerm, currentPage, updatePage, totalPages, selectedIssues } = useIssues();

  return (
    <div className="lg:px-10 sm:px-4 px-4 mb-10">

      <div className="relative mb-4">

        <Search
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 transition-opacity"
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            updatePage(1);
          }}
          className="w-full md:w-[50%] lg:w-[30%] pl-10 p-2 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>

      <div className="w-full space-y-2">
        <div className="flex items-center bg-gray-100 p-2 rounded-md font-semibold text-gray-600">
          <div className="w-16 text-left">ID</div>
          <div className="flex-1 text-left">Title</div>
        </div>

        {selectedIssues.length > 0 ? (
          selectedIssues.map((issue) => (
            <Link
              key={issue.id}
              to={`/issues/${issue.id}?page=${currentPage}&search=${searchTerm}`}
              className="flex items-center bg-white p-2 rounded-md shadow-sm hover:bg-gray-50 border border-gray-200 transition"
            >
              <div className="w-16 font-semibold text-gray-800 shrink-0">#{issue.id}</div>
              <div className="flex-1 text-blue-600 hover:underline truncate">
                {issue.title}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-600 text-center py-4">No issues found.</p>
        )}
      </div>























      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => updatePage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => updatePage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default IssuesList;
