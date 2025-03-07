document.addEventListener("DOMContentLoaded", loadDiscussions);

function loadDiscussions() {
    const discussions = JSON.parse(localStorage.getItem("discussions")) || [];
    displayDiscussions(discussions);
}

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

function submitPost() {
    const postText = document.getElementById("discussionText").value;
    if (postText.trim() === "") {
        alert("Please write something before submitting.");
        return;
    }

    const newPost = {
        content: postText,
        date: new Date().toLocaleString()
    };

    const discussions = JSON.parse(localStorage.getItem("discussions")) || [];
    discussions.push(newPost);

    localStorage.setItem("discussions", JSON.stringify(discussions));

    document.getElementById("discussionText").value = "";
    loadDiscussions();
}
