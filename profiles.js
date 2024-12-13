document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profile-form");
    const profileList = document.getElementById("profile-list");

    // Load and display existing profiles
    loadAndDisplayProfiles();

    // Handle form submission to create a new profile
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const profileName = document.getElementById("profile-name").value.trim();
        if (!profileName) {
            alert("Please enter a profile name.");
            return;
        }

        // Save the profile
        saveProfile(profileName, getPreferences());
        alert(`Profile "${profileName}" saved successfully!`);
        loadAndDisplayProfiles(); // Update the list
        form.reset(); // Clear the form
    });
});

// Load and display profiles in the profile list
function loadAndDisplayProfiles() {
    const profiles = getProfiles();
    const profileList = document.getElementById("profile-list");
    profileList.innerHTML = ""; // Clear existing list

    Object.keys(profiles).forEach(profileName => {
        const profileDiv = document.createElement("div");
        profileDiv.className = "profile-item";
        profileDiv.textContent = profileName;

        // Add a "Set Active" button
        const setActiveButton = document.createElement("button");
        setActiveButton.textContent = "Set Active";
        setActiveButton.onclick = () => {
            setActiveProfile(profileName);
            alert(`Profile "${profileName}" is now active!`);
        };

        // Add a "Delete" button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
            deleteProfile(profileName);
            loadAndDisplayProfiles(); // Refresh the list
        };

        // Append buttons to the profile div
        profileDiv.appendChild(setActiveButton);
        profileDiv.appendChild(deleteButton);
        profileList.appendChild(profileDiv);
    });
}

// Save a new profile
function saveProfile(profileName, preferences) {
    const profiles = getProfiles();
    profiles[profileName] = preferences || {}; // Add or overwrite profile
    localStorage.setItem("userProfiles", JSON.stringify(profiles));
    console.log(`Profile "${profileName}" saved successfully!`);
}

// Get all saved profiles
function getProfiles() {
    try {
        const profiles = JSON.parse(localStorage.getItem("userProfiles"));
        return profiles || {};
    } catch (error) {
        console.error("Error retrieving profiles:", error);
        return {};
    }
}

// Set the active profile
function setActiveProfile(profileName) {
    const profiles = getProfiles();
    if (!profiles[profileName]) {
        console.error(`Profile "${profileName}" does not exist.`);
        return;
    }
    localStorage.setItem("activeProfile", profileName);
    console.log(`Active profile set to "${profileName}"`);
}

// Delete a profile
function deleteProfile(profileName) {
    const profiles = getProfiles();
    if (profiles[profileName]) {
        delete profiles[profileName];
        localStorage.setItem("userProfiles", JSON.stringify(profiles));
        console.log(`Profile "${profileName}" deleted successfully!`);
    } else {
        console.error(`Profile "${profileName}" not found.`);
    }
}

// Get the active profile
function getActiveProfile() {
    const activeProfileName = localStorage.getItem("activeProfile");
    if (!activeProfileName) {
        console.log("No active profile found.");
        return null;
    }
    const profiles = getProfiles();
    return profiles[activeProfileName] || null;
}

// Mock function to get preferences (replace this with actual preferences fetching logic)
function getPreferences() {
    return { categories: ["default"], ageGroup: "adult" }; // Example preferences
}
