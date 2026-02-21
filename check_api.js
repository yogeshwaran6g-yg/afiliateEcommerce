async function checkApi() {
    try {
        const response = await fetch("http://localhost:5000/api/admin/user-notifications");
        const data = await response.json();
        console.log("API status:", response.status);
        console.log("API response data:", JSON.stringify(data, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("API Check Error:", error);
        process.exit(1);
    }
}

checkApi();
