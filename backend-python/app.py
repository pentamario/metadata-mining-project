import os
import time
import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS
#VERY IMPORTANT
#All the documentation needed for setup and functionality of this app is inside a github repository
#Repository link: https://github.com/pentamario/metadata-mining-project
#Version of Python - Python 3.9.6
#Version of React - React 19.0.0
#Version of TypeScript - 4.9.5
#Version of NPM - npm 10.9.2

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# GitHub API token for authentication 
GITHUB_TOKEN = "" #IMPORTANT!!!! Insert your own github token, unverified number of requests might not be enough
headers = {}
if GITHUB_TOKEN:
    headers["Authorization"] = f"token {GITHUB_TOKEN}"

# Cache for storing fetched issues
cached_issues = []

def is_robot_comment(comment):
    """ Check if a comment was made by a bot. """
    user = comment.get("user", {})
    login = user.get("login", "").lower()
    
    # Identify bot users based on type or username pattern
    if user.get("type") == "Bot":
        return True
    if login.endswith("[bot]") or "bot" in login:
        return True
    return False

def fetch_all_issues(owner, repo, state="open", per_page=100):
    """ Fetch all issues from a GitHub repository. """
    all_items = []
    page = 1

    while True:
        # Construct GitHub API request URL
        url = (
            f"https://api.github.com/repos/{owner}/{repo}/issues"
            f"?state={state}&per_page={per_page}&page={page}"
        )
        print(f"Fetching page {page} of {state} items...")

        # Make API request
        resp = requests.get(url, headers=headers)

        if resp.status_code != 200:
            print(f"Error fetching issues (status={resp.status_code}). Possibly rate-limited.")
            print("Response snippet:", resp.text[:300])
            break

        # Parse response
        page_items = resp.json()
        if not page_items:
            break

        all_items.extend(page_items)

        # Stop if we get fewer results than the page limit (end of list)
        if len(page_items) < per_page:
            break

        page += 1

    return all_items

def fetch_and_filter_issues():
    """ Fetch open issues from GitHub and filter out pull requests. """
    owner = "cloudnative-pg"
    repo = "cloudnative-pg"

    # Fetch raw issues data from GitHub
    raw_items = fetch_all_issues(owner, repo, state="open", per_page=100)
    print(f"Total open items (issues + PRs): {len(raw_items)}")

    processed = []
    skip_count = 0

    for idx, item in enumerate(raw_items, start=1):
        # Skip pull requests (they are included in the GitHub issues API response)
        if "pull_request" in item:
            skip_count += 1
            continue

        # Extract issue details
        issue_number = item["number"]
        title = item["title"]
        state = item["state"]
        initial_message = item.get("body", "")
        comment_count = item.get("comments", 0)

        # Process issue comments
        if comment_count == 0:
            reaction = "no reaction"
            comments_markdown = ""
        else:
            print(f"({idx}/{len(raw_items)}) Fetching comments for issue #{issue_number}")
            comments_url = item["comments_url"]
            c_resp = requests.get(comments_url, headers=headers)

            if c_resp.status_code != 200:
                print(f"Warning: error {c_resp.status_code} for comments of issue #{issue_number}")
                all_comments = []
            else:
                all_comments = c_resp.json()

            # Filter out bot comments
            human_comments = [c for c in all_comments if not is_robot_comment(c)]
            
            # Format comments for storage
            if human_comments:
                reaction = "has reaction"
                comments_markdown = "\n\n---\n\n".join(c["body"] for c in human_comments)
            else:
                reaction = "no reaction"
                comments_markdown = ""

        # Store processed issue data
        processed.append({
            "id": issue_number,
            "title": title,
            "state": state,
            "initial_message": initial_message,
            "comments_markdown": comments_markdown,
            "reaction": reaction
        })

    print(f"Skipped {skip_count} PRs. Processed {len(processed)} open issues.")

    # Save processed issues to a JSON file
    output_filename = "issues_output.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(processed, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(processed)} issues to {output_filename}")

    # Update cached issues
    global cached_issues
    cached_issues = processed

# API endpoint to get all cached issues
@app.route("/api/issues")
def get_issues():
    return jsonify(cached_issues)

# API endpoint to get a specific issue by its ID
@app.route("/api/issues/<int:issue_id>")
def get_issue(issue_id):
    for issue in cached_issues:
        if issue["id"] == issue_id:
            return jsonify(issue)
    return jsonify({"error": "Issue not found"}), 404

# Run the script when executed directly
if __name__ == "__main__":
    fetch_and_filter_issues()  # Fetch and process issues at startup
    app.run(port=5001, debug=False)  # Start the Flask server
