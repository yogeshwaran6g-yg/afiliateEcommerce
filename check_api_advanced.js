async function checkApi() {
    try {
        console.log("Checking API on port 4000...");
        const response = await fetch("http://localhost:4000/api/v1/admin/user-notifications");
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response Body:", JSON.stringify(data, null, 2));

        console.log("\nChecking with unread_only=true...");
        const responseUnread = await fetch("http://localhost:4000/api/v1/admin/user-notifications?unread_only=true");
        const dataUnread = await responseUnread.json();
        console.log("Unread Body:", JSON.stringify(dataUnread, null, 2));

        process.exit(0);
    } catch (error) {
        console.error("API Error:", error);
        process.exit(1);
    }
}
checkApi();
