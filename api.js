const NEWS_API_TOP_HEADLINES = "https://api.thenewsapi.com/v1/news/top";
const NEWS_API_EVERYTHING = "https://api.thenewsapi.com/v1/news/all";
const API_KEY = "91zyvc7FvG2Oucuvt5SN0eKcJXnm9NARjIr9t9nx";

// Initialize Cache
let newsCache = JSON.parse(localStorage.getItem("newsCache")) || {};

// Fetch articles by category
async function fetchNewsByCategory(category, page = 1) {
    const cacheKey = `${category}-${page}`;
    if (newsCache[cacheKey]) {
        console.log(`Using cached data for category: ${category} (Page: ${page})`);
        return newsCache[cacheKey];
    }

    try {
        const response = await fetch(`${NEWS_API_TOP_HEADLINES}?api_token=${API_KEY}&categories=${category}&page=${page}&language=en`);
        if (!response.ok) throw new Error(`Failed to fetch news for category: ${category}`);

        const data = await response.json();
        console.log("API Response:", data);
        newsCache[cacheKey] = data.data || []; // Adjusted based on actual response structure
        localStorage.setItem("newsCache", JSON.stringify(newsCache));
        return data.data || [];
    } catch (error) {
        console.error("Error fetching news by category:", error);
        return [];
    }
}


// Fetch articles by query
async function fetchNewsByQuery(query) {
    if (newsCache[query]) {
        console.log(`Using cached data for query: ${query}`);
        return newsCache[query];
    }

    try {
        const response = await fetch(`${NEWS_API_URL}?q=${query}&apiKey=${API_KEY}`);
        if (!response.ok) throw new Error(`Failed to fetch news for query: ${query}`);

        const data = await response.json();
        newsCache[query] = data.articles;
        localStorage.setItem("newsCache", JSON.stringify(newsCache));
        return data.articles;
    } catch (error) {
        console.error("Error fetching news by query:", error);
        return [];
    }
}
