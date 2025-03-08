const GITHUB_USERNAME = "MaxiEliteExecutor"; // Change to your GitHub username
const REPO_NAME = "Netlifysus"; // Change to your repo name
const FILE_PATH = "posts.json";
const BRANCH = "main"; // Change if you're using a different branch
const TOKEN = process.env.GITHUB_TOKEN; // From environment variable

// Define API_URL at the top of the file to avoid referencing it before initialization
const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;

document.addEventListener("DOMContentLoaded", loadDiscussions);

async function loadDiscussions() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `token ${TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.content) {
            const decodedContent = atob(data.content.trim());
            const discussions = decodedContent ? JSON.parse(decodedContent) : [];
            displayDiscussions(discussions);
        } else {
            console.warn("No content found in posts.json");
        }
    } catch (error) {
        console.error("Error loading discussions:", error);
        document.getElementById("postsContainer").innerHTML = "<p>Failed to load posts.</p>";
    }
}

async function submitPost() {
    const postText = document.getElementById("discussionText").value;
    if (postText.trim() === "") {
        alert("Please write something before submitting.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `token ${TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = atob(data.content); // Decode Base64 content
        let discussions = JSON.parse(content);

        const newPost = { content: postText, date: new Date().toLocaleString() };
        discussions.push(newPost);

        const updatedContent = btoa(JSON.stringify(discussions, null, 2));

        await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Authorization": `token ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Update posts.json",
                content: updatedContent,
                sha: data.sha // Required to update the file
            })
        });

        document.getElementById("discussionText").value = "";
        loadDiscussions(); // Reload discussions
    } catch (error) {
        console.error("Error submitting post:", error);
        alert("Failed to submit post.");
    }
}
