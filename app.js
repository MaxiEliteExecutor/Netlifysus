// Load posts on page load
document.addEventListener('DOMContentLoaded', displayPosts);

// Initialize posts from localStorage
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Function to submit a new post
function submitPost() {
    const postText = document.getElementById("discussionText").value;

    if (postText.trim() === "") {
        alert("Please write something before submitting.");
        return;
    }

    // Create new post object
    const newPost = {
        content: postText,
        date: new Date().toLocaleString()
    };

    // Add post to the list
    posts.push(newPost);

    // Save to localStorage
    localStorage.setItem('posts', JSON.stringify(posts));

    // Clear textarea and update posts
    document.getElementById("discussionText").value = "";
    displayPosts();
}

// Function to display posts
function displayPosts() {
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "<h2>Community Posts</h2>";  // Reset posts section

    posts.forEach(post => {
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
