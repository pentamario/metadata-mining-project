import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Define the structure of an issue
interface Issue {
  id: number;
  title: string;
  state: string;
  initial_message: string;
  comments_markdown: string;
  reaction: string;
}

// Number of issues displayed per page
const ITEMS_PER_PAGE = 15;

export function useIssues() {
  // State to store all issues
  const [issues, setIssues] = useState<Issue[]>([]);

  // State to store the search term
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Hooks for URL handling
  const location = useLocation();
  const navigate = useNavigate();

  // Get the current page number from the URL (default to 1 if not present)
  const queryParams = new URLSearchParams(location.search);
  const initialPage: number = Number(queryParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  useEffect(() => {
    // Fetch issues from the backend API
    fetch("http://localhost:5001/api/issues")
      .then((resp) => resp.json())
      .then((data: Issue[]) => {
        setIssues(data); // Store fetched issues in state
      })
      .catch((err: Error) => {
        console.error("Error fetching issues:", err);
      });
  }, []);

  // Function to update the page number and reflect it in the URL
  const updatePage = (newPage: number): void => {
    setCurrentPage(newPage);
    navigate(`?page=${newPage}&search=${searchTerm}`, { replace: true });
  };

  // Filter issues by search term (matches title or ID prefix)
  const filteredIssues: Issue[] = issues.filter((issue) =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Match title
    issue.id.toString().startsWith(searchTerm) // Match ID prefix
  );

  // Calculate total number of pages
  const totalPages: number = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  // Get the issues for the current page
  const startIndex: number = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedIssues: Issue[] = filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    searchTerm,       // Current search term
    setSearchTerm,    // Function to update search term
    currentPage,      // Current page number
    updatePage,       // Function to change pages
    totalPages,       // Total number of pages
    selectedIssues,   // Issues to display on the current page
  };
}
