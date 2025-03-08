const GITHUB_USERNAME = "MaxiEliteExecutor"; // Change to your GitHub username
const REPO_NAME = "Netlifysus"; // Change to your repo name
const FILE_PATH = "posts.json";
const BRANCH = "main"; // Change if you're using a different branch
const TOKEN = process.env.GITHUB_TOKEN; // From environment variable

const API_URL = `https://api.github.com/repos/MaxiEliteExecutor/Netlifysus/contents/posts.json`;

document.addEventListener("DOMContentLoaded", loadDiscussions);

// Load discussions from GitHub
async function loadDiscussions() {
    try {
        const response = await fetch(API_URL, {
            headers: { "Authorization": `token ${TOKEN}` }
        });
        const data = await response.json();

        if (data.content) {
            const content = atob(data.content);
            const discussions = JSON.parse(content);
            displayDiscussions(discussions);
        }
    } catch (error) {
        console.error("Error loading discussions:", error);
    }
}

// Display discussions
function displayDiscussions(discussions) {
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "<h2>Community Posts</h2>";

    discussions.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        const postContent = document.createElement("p");
        postContent.textContent = post.content;

        const postDate = document.createElement("small");
        postDate.textContent = `Posted on: ${post.date}`;

        postDiv.appendChild(postContent);
        postDiv.appendChild(postDate);
        postsContainer.appendChild(postDiv);
    });
}

// Submit new post
async function submitPost() {
    const postText = document.getElementById("discussionText").value;
    if (postText.trim() === "") {
        alert("Please write something before submitting.");
        return;
    }

    try {
        // Get current discussions
        const response = await fetch(API_URL, {
            headers: { "Authorization": `token ${TOKEN}` }
        });
        const data = await response.json();

        let discussions = [];
        if (data.content) {
            const content = atob(data.content);
            discussions = JSON.parse(content);
        }

        // Add new post
        const newPost = { content: postText, date: new Date().toLocaleString() };
        discussions.push(newPost);

        // Convert JSON to Base64
        const updatedContent = btoa(JSON.stringify(discussions, null, 2));

        // Update file on GitHub
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
    }
}

