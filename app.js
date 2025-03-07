const PASTEBIN_API_KEY = "NQdjdImhD2x4mA5xcNvY1adtRSGHlMXw";  // Replace with your new API key
const PASTE_ID = "GE25jku9";  // Replace with your actual Pastebin paste ID

// Fetch discussions from Pastebin
async function fetchDiscussions() {
    try {
        const response = await fetch(`https://pastebin.com/raw/${PASTE_ID}`);
        const discussions = await response.json();
        displayDiscussions(discussions);
    } catch (error) {
        console.error("Error fetching discussions:", error);
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

// Submit a new post
async function submitPost() {
    const postText = document.getElementById("discussionText").value;
    if (postText.trim() === "") {
        alert("Please write something before submitting.");
        return;
    }

    const newPost = {
        content: postText,
        date: new Date().toLocaleString()
    };

    try {
        // Fetch current discussions
        const response = await fetch(`https://pastebin.com/raw/${PASTE_ID}`);
        const discussions = await response.json();

        // Add new post
        discussions.push(newPost);

        // Update Pastebin with new discussions
        await updatePastebin(discussions);

        // Clear text area & refresh discussions
        document.getElementById("discussionText").value = "";
        fetchDiscussions();
    } catch (error) {
        console.error("Error submitting post:", error);
    }
}

// Update Pastebin with new discussions
async function updatePastebin(updatedData) {
    try {
        const formData = new URLSearchParams();
        formData.append("api_dev_key", PASTEBIN_API_KEY);
        formData.append("api_paste_code", JSON.stringify(updatedData, null, 2));
        formData.append("api_paste_format", "json");
        formData.append("api_option", "edit");
        formData.append("api_paste_key", PASTE_ID);

        const response = await fetch("https://pastebin.com/api/api_post.php", {
            method: "POST",
            body: formData
        });

        const result = await response.text();
        if (result.includes("Bad API request")) {
            console.error("Error updating Pastebin:", result);
        } else {
            console.log("Discussion updated on Pastebin!");
        }
    } catch (error) {
        console.error("Error updating Pastebin JSON:", error);
    }
}

// Load discussions when the page loads
document.addEventListener("DOMContentLoaded", fetchDiscussions);

