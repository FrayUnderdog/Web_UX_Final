function savePreferences(preferences) {
    try {
        localStorage.setItem("userPreferences", JSON.stringify(preferences));
        console.log("Preferences saved successfully!");
    } catch (error) {
        console.error("Error saving preferences:", error);
    }
}

// Retrieve user preferences from localStorage
function getPreferences() {
    try {
        const storedPreferences = localStorage.getItem("userPreferences");
        return storedPreferences ? JSON.parse(storedPreferences) : {};
    } catch (error) {
        console.error("Error retrieving preferences:", error);
        return {};
    }
}

// Update user preferences dynamically
function updatePreferences(newPreferences) {
    try {
        const currentPreferences = getPreferences();
        const updatedPreferences = { ...currentPreferences, ...newPreferences };
        savePreferences(updatedPreferences);
        console.log("Preferences updated successfully!");
        return updatedPreferences;
    } catch (error) {
        console.error("Error updating preferences:", error);
        return null;
    }
}

// Example Usage
// Saving preferences
const preferences = {
    categories: ["technology", "sports"],
    ageGroup: "adult",
};
savePreferences(preferences);

// Retrieving preferences
const userPreferences = getPreferences();
console.log("Retrieved Preferences:", userPreferences);

// Updating preferences
const updatedPreferences = updatePreferences({ categories: ["business", "science"] });
console.log("Updated Preferences:", updatedPreferences);
