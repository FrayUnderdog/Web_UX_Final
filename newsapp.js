document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    if (page === "index") {
        initializeIndexPage();
    } else if (page === "dashboard") {
        initializeDashboardPage();
    } else if (page === "settings") {
        initializeSettingsPage();
    } else {
        initializeApp(); // Default initialization for other pages
    }
});

// Index Page Initialization
function initializeIndexPage() {
    const form = document.getElementById("preferences-form");
    const errorSummary = document.getElementById("error-summary");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Form submitted!");

        const interests = Array.from(document.querySelectorAll("input[name='interests']:checked")).map(input => input.value);
        const age = parseInt(document.getElementById("age-input").value, 10);
        const gender = document.getElementById("gender").value;
        const searchKeywords = document.getElementById("search-keywords").value.trim();

        errorSummary.innerHTML = "";
        const errors = validateInputs(interests, age, searchKeywords);

        if (errors.length > 0) {
            errorSummary.innerHTML = errors.join("<br>");
            return;
        }

        const preferences = {
            categories: interests,
            age,
            gender: gender || null,
            keywords: searchKeywords || null
        };

        savePreferences(preferences);
        alert("Preferences saved successfully!");
        window.location.href = "dashboard.html";
    });
}

function initializeDashboardPage() {
    const preferences = getPreferences();
    if (!preferences || Object.keys(preferences).length === 0) {
        console.log("No preferences found. Redirecting to onboarding...");
        redirectToOnboarding();
        return;
    }

    console.log("Loaded preferences:", preferences);
    const newsFeed = document.getElementById("news-feed");

    preferences.categories.forEach(category => {
        fetchNewsByCategory(category)
            .then(articles => {
                if (articles.length > 0) {
                    renderArticles(articles, newsFeed, category);
                } else {
                    console.log(`No articles found for category: ${category}`);
                }
            })
            .catch(err => console.error(`Error fetching articles for category: ${category}`, err));
    });

    const loadMoreButton = document.getElementById("load-more");
    loadMoreButton.style.display = "block";
    loadMoreButton.addEventListener("click", () => {
        preferences.categories.forEach(category => {
            fetchNewsByCategory(category, 2)
                .then(articles => renderArticles(articles.slice(0, 2), newsFeed, category));
        });
    });

    setupGlobalEventListeners();
}

// Settings Page Initialization
function initializeSettingsPage() {
    console.log("Settings page loaded.");
    setupGlobalEventListeners();
}

// Utility Functions
function savePreferences(preferences) {
    if (!preferences || Object.keys(preferences).length === 0) {
        console.warn("No preferences to save.");
        return;
    }
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    console.log("Preferences saved to localStorage:", preferences);
}

function getPreferences() {
    const storedPreferences = localStorage.getItem("userPreferences");
    return storedPreferences ? JSON.parse(storedPreferences) : {};
}

function redirectToOnboarding() {
    window.location.href = "index.html";
}

function validateInputs(interests, age, searchKeywords) {
    const errors = [];
    if (!validateAge(age)) errors.push("Enter a valid age between 20 and 70.");
    if (!validateInterests(interests)) errors.push("Please select at least one interest.");
    if (searchKeywords.length > 50) errors.push("Keywords should not exceed 50 characters.");
    return errors;
}

function validateAge(age) {
    return age >= 20 && age <= 70;
}

function validateInterests(interests) {
    return interests.length > 0;
}

// Setup Global Event Listeners
function setupGlobalEventListeners() {
    const profileSwitcher = document.getElementById("profile-switcher");
    if (profileSwitcher) {
        profileSwitcher.addEventListener("change", () => {
            const selectedProfile = profileSwitcher.value;
            setActiveProfile(selectedProfile);
        });
    }

    const settingsButton = document.getElementById("settings-button");
    if (settingsButton) {
        settingsButton.addEventListener("click", () => {
            window.location.href = "settings.html";
        });
    }
}

function setActiveProfile(profile) {
    console.log(`Active profile set to: ${profile}`);
    localStorage.setItem("activeProfile", JSON.stringify(profile));
}

function getActiveProfile() {
    const storedProfile = localStorage.getItem("activeProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
}

// Render articles and add proper attributes for "Like" and "Save"
function renderArticles(articles, container, category) {
    const categorySection = document.createElement("section");
    categorySection.classList.add("news-section");

    const categoryHeader = document.createElement("h2");
    categoryHeader.innerText = `News for ${category}`;
    categorySection.appendChild(categoryHeader);

    if (articles.length === 0) {
        const noArticlesMessage = document.createElement("p");
        noArticlesMessage.innerText = "No articles available for this category.";
        categorySection.appendChild(noArticlesMessage);
    } else {
        articles.forEach((article) => {
            const articleDiv = document.createElement("div");
            articleDiv.classList.add("article");

            const articleTitle = document.createElement("h3");
            articleTitle.innerText = article.title;

            const articleDescription = document.createElement("p");
            articleDescription.innerText = article.description || "No description available.";

            const articleLink = document.createElement("a");
            articleLink.href = article.url;
            articleLink.target = "_blank";
            articleLink.innerText = "Read more";

            // Add Like and Save buttons with proper attributes
            const likeButton = document.createElement("button");
            likeButton.classList.add("like-button");
            likeButton.dataset.articleId = article.id || article.url; // Ensure ID is set (fallback to URL if no ID)
            likeButton.innerText = "Like";

            const saveButton = document.createElement("button");
            saveButton.classList.add("save-button");
            saveButton.dataset.articleId = article.id || article.url; // Ensure ID is set (fallback to URL if no ID)
            saveButton.dataset.articleTitle = article.title; // Set article title
            saveButton.dataset.articleDescription = article.description || "No description available.";
            saveButton.dataset.articleUrl = article.url; // Set article URL
            saveButton.innerText = "Save";

            articleDiv.appendChild(articleTitle);
            articleDiv.appendChild(articleDescription);
            articleDiv.appendChild(articleLink);
            articleDiv.appendChild(likeButton);
            articleDiv.appendChild(saveButton);

            categorySection.appendChild(articleDiv);
        });
    }

    container.appendChild(categorySection);
    console.log(`Rendering ${articles.length} articles for category: ${category}`);
}
