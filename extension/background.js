const API_URL = 'http://localhost:5000/api';

// Create an alarm to track usage every 1 minute
chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("trackerAlarm", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "trackerAlarm") {
        trackActiveTab();
    }
});

async function trackActiveTab() {
    try {
        // 1. Get the currently active tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length === 0) return;
        
        const activeTab = tabs[0];
        if (!activeTab.url) return;

        // 2. Extract hostname from URL
        const urlObj = new URL(activeTab.url);
        const currentHostname = urlObj.hostname.replace(/^www\./, '');

        // 3. Get Auth Token and Tracked Websites from Storage
        const { token, trackedWebsites, dailyLimit } = await chrome.storage.local.get(['token', 'trackedWebsites', 'dailyLimit']);
        if (!token || !trackedWebsites) return; // User not logged in or hasn't loaded data

        // 4. Check if the active tab matches any tracked website
        const matchedWebsite = trackedWebsites.find(w => {
            try {
                const trackedUrlObj = new URL(w.url);
                const trackedHostname = trackedUrlObj.hostname.replace(/^www\./, '');
                return currentHostname.includes(trackedHostname) || trackedHostname.includes(currentHostname);
            } catch (e) {
                return false;
            }
        });

        if (matchedWebsite) {
            // 5. Send POST to backend track-usage
            const response = await fetch(`${API_URL}/track-usage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    website_id: matchedWebsite.id,
                    duration: 1
                })
            });

            if (response.ok) {
                console.log(`Successfully tracked 1 min for ${matchedWebsite.name}`);
                checkLimitsAndBlock(token, activeTab.id);
            }
        }
    } catch (error) {
        console.error("Error tracking tab:", error);
    }
}

async function checkLimitsAndBlock(token, tabId) {
    try {
        // We need to fetch the latest report to see if they exceeded today's total
        const res = await fetch(`${API_URL}/get-reports`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const limitsRes = await fetch(`${API_URL}/get-limits`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok || !limitsRes.ok) return;

        const data = await res.json();
        const limitsData = await limitsRes.json();
        
        const totalDaily = data.totalDaily || 0;
        const dailyLimit = limitsData.daily_limit;

        if (totalDaily >= dailyLimit) {
            // 6. Block the page and redirect
            chrome.tabs.update(tabId, { url: 'http://localhost:5000/blocked' });
        }
    } catch (e) {
         console.error("Error checking limits:", e);
    }
}

// Allow popup to trigger a data refresh when user logs in
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'refreshData') {
        refreshBackendData();
        sendResponse({ status: 'ok' });
    }
    return true;
});

async function refreshBackendData() {
    const { token } = await chrome.storage.local.get('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/get-websites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const websites = await res.json();
            await chrome.storage.local.set({ trackedWebsites: websites });
            console.log("Tracked websites updated.");
        }
    } catch (e) {
        console.error("Failed to refresh websites", e);
    }
}
