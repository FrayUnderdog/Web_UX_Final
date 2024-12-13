// Save a liked article
function likeArticle(articleId) {
    try {
        const likedArticles = JSON.parse(localStorage.getItem("likedArticles")) || [];
        if (!likedArticles.includes(articleId)) {
            likedArticles.push(articleId);
            localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
            console.log(`Article ${articleId} liked successfully!`);
        } else {
            console.log(`Article ${articleId} is already liked.`);
        }
    } catch (error) {
        console.error("Error liking article:", error);
    }
}

// Retrieve liked articles
function getLikedArticles() {
    try {
        return JSON.parse(localStorage.getItem("likedArticles")) || [];
    } catch (error) {
        console.error("Error retrieving liked articles:", error);
        return [];
    }
}

// Remove a liked article
function unlikeArticle(articleId) {
    try {
        const likedArticles = getLikedArticles();
        const updatedArticles = likedArticles.filter(id => id !== articleId);
        localStorage.setItem("likedArticles", JSON.stringify(updatedArticles));
        console.log(`Article ${articleId} unliked successfully!`);
    } catch (error) {
        console.error("Error unliking article:", error);
    }
}

// Save an article for later
function saveArticle(article) {
    try {
        const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
        if (!savedArticles.some(saved => saved.id === article.id)) {
            savedArticles.push(article);
            localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
            console.log(`Article "${article.id}" saved successfully!`);
        } else {
            console.log(`Article "${article.id}" is already saved.`);
        }
    } catch (error) {
        console.error("Error saving article:", error);
    }
}

// Retrieve saved articles
function getSavedArticles() {
    try {
        return JSON.parse(localStorage.getItem("savedArticles")) || [];
    } catch (error) {
        console.error("Error retrieving saved articles:", error);
        return [];
    }
}

// Remove a saved article
function removeSavedArticle(articleId) {
    try {
        const savedArticles = getSavedArticles();
        const updatedArticles = savedArticles.filter(article => article.id !== articleId);
        localStorage.setItem("savedArticles", JSON.stringify(updatedArticles));
        console.log(`Article ${articleId} removed successfully!`);
    } catch (error) {
        console.error("Error removing saved article:", error);
    }
}

// Load and render articles (generic function for saved and liked articles)
function loadArticles(containerId, articles, removeCallback, emptyMessage) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear the container

    if (articles.length === 0) {
        container.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }

    articles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("article");

        const title = document.createElement("h3");
        title.textContent = article.title || "Untitled";

        const description = document.createElement("p");
        description.textContent = article.description || "No description available.";

        const link = document.createElement("a");
        link.href = article.url || "#";
        link.target = "_blank";
        link.textContent = "Read more";

        const removeButton = document.createElement("button");
        removeButton.textContent = removeCallback === removeSavedArticle ? "Remove" : "Unlike";
        removeButton.addEventListener("click", () => {
            removeCallback(article.id);
            loadPageContent(); // Refresh the page dynamically
        });

        articleDiv.appendChild(title);
        articleDiv.appendChild(description);
        articleDiv.appendChild(link);
        articleDiv.appendChild(removeButton);

        container.appendChild(articleDiv);
    });
}

// Load and render saved articles
function loadSavedArticles(containerId) {
    const savedArticles = getSavedArticles();
    loadArticles(containerId, savedArticles, removeSavedArticle, "No saved articles found.");
}

// Load and render liked articles
function loadLikedArticles(containerId, allArticles) {
    const likedArticleIds = getLikedArticles();
    const likedArticles = allArticles.filter(article => likedArticleIds.includes(article.id));
    loadArticles(containerId, likedArticles, unlikeArticle, "No liked articles found.");
}

// Event Listeners for Like and Save Buttons
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-button")) {
        const articleId = e.target.dataset.articleId;
        likeArticle(articleId);
    }
    if (e.target.classList.contains("save-button")) {
        const articleId = e.target.dataset.articleId;
        const title = e.target.dataset.articleTitle || "Untitled";
        const description = e.target.dataset.articleDescription || "No description available.";
        const url = e.target.dataset.articleUrl || "#";

        saveArticle({
            id: articleId,
            title: title,
            description: description,
            url: url
        });
    }
});

// Load saved and liked articles based on the current page
document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    if (page === "interaction") {
        const allArticles = getSavedArticles(); // Assuming liked articles are saved as well
        loadSavedArticles("saved-articles");
        loadLikedArticles("liked-articles", allArticles);
    }
});
