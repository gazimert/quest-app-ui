export const RefreshToken = () => {
    var request = fetch("/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: localStorage.getItem("currentUser"),
            refreshToken: localStorage.getItem("refreshKey")
        })
    })

    return request;
}