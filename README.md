# GitHub Issues Viewer

A simple full-stack application for viewing and searching GitHub issues. This project consists of:
- A **Flask** backend that serves issue data to a JSON file and React/TypeScript front-end.
- A **React + TypeScript** frontend that displays issues with search and pagination.

---

## Functionality

1. **List of Issues**  
   Displays a list of issues with their ID and title. This list is paginated, so users can navigate through multiple pages of issues.

2. **Search**  
   Provides a search box that filters the list of issues by keywords in the title or by ID. This is useful for quickly finding specific issues.

3. **Pagination**  
   If there are many issues, they are split across multiple pages. Users can move between pages with Previous and Next buttons.

4. **Issue Details**  
   Clicking on any issue in the list opens a detail view. The detail page shows:
   - **Initial Message** in Markdown format.
   - **Comments** (if any) associated with that issue. Bot comments are excluded.

5. **Navigation**  
   The frontend uses React Router to navigate between the list of issues and the detail pages without reloading the page.

---

## Installation

### Backend

1. **Clone or download** this repository.
2. **Install** Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. **Run** the Flask application:
   ```bash
   python app.py
   ```
   By default, the backend listens on port **5001**. Change this in `app.py` if needed.
   This step takes a while since it needs to filter comments for all issues, you will see the progress in your terminal.
4. **Wait**
   - Wait until it finishes and you will have a file called issues_output.json, that will include all the issues.
   - After this setep proceed to next part.

### Frontend

1. **Install** frontend dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
2. **Start** the React development server:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```
   By default, the React app runs at [http://localhost:3000](http://localhost:3000).

---

## Usage

1. **Confirm** the Flask backend is running on port 5001 (or your chosen port).
2. **Confirm** the React frontend is running on port 3000.
3. **Open** your browser at [http://localhost:3000](http://localhost:3000). The issues will be loaded from the backend’s JSON data.

---


