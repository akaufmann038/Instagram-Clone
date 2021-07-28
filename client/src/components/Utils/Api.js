// gets data for logged in user
const getUsersApi = async (handleUsers) => {
    await fetch("http://localhost:5000/posts", {
        method: "GET"
    })
        .then(res => res.json())
        .then(res => handleUsers(res))
}

const deleteUserApi = async (id) => {
    await fetch("http://localhost:5000/delete-user", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: id })
    })
}

const deletePostApi = async (userId, postId) => {
    await fetch("http://localhost:5000/delete-post", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId, postId: postId })
    })
}

const addUserApi = async () => {
    await fetch("http://localhost:5000/new-user", {
        method: "POST"
    })
}

export { getUsersApi, deleteUserApi, deletePostApi, addUserApi }