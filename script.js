let loggedInUser = null;
const validUser = { username: "rh94", password: "asdf123" };
const posts = [];

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === validUser.username && password === validUser.password) {
        loggedInUser = username;
        document.getElementById("loginPage").classList.remove("active");
        document.getElementById("homePage").classList.add("active");
        document.getElementById("navBar").style.display = "flex";
        renderPosts();
    } else {
        alert("Invalid username or password");
    }
}

function skip() {
    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("homePage").classList.add("active");
    document.getElementById("navBar").style.display = "flex";
    renderPosts();
}

function openPostPopup() {
    if (!loggedInUser) {
        alert("Only logged-in users can post.");
        return;
    }
    document.getElementById("postPopup").style.display = "block";
}

function closePopup() {
    document.getElementById("postPopup").style.display = "none";
    document.getElementById("postContent").value = "";
    document.getElementById("imageUpload").value = "";
    document.getElementById("imagePreview").innerHTML = "";
}

function submitPost() {
    const content = document.getElementById("postContent").value;
    const imageInput = document.getElementById("imageUpload");
    const images = [];

    if (imageInput.files.length > 0) {
        Array.from(imageInput.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                images.push(e.target.result);
                if (images.length === imageInput.files.length) {
                    createPost(content, images);
                }
            };
            reader.readAsDataURL(file);
        });
    } else {
        createPost(content, []);
    }
}

function createPost(content, images) {
    const post = {
        id: Date.now(),
        user: loggedInUser,
        content,
        images,
        likes: 0
    };
    posts.push(post);
    closePopup();
    renderPosts();
}

function renderPosts() {
    const postList = document.getElementById("postList");
    postList.innerHTML = "";
    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <p>${convertLinksToAnchors(post.content)}</p>
            ${post.images.map(img => `<img src="${img}" alt="Post Image">`).join("")}
            <p>Likes: ${post.likes}</p>
            ${post.user === loggedInUser ? `<button onclick="deletePost(${post.id})">Delete</button>` : ""}
            <button onclick="likePost(${post.id})">Like</button>
        `;
        postList.appendChild(postElement);
    });
}

function convertLinksToAnchors(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}

function deletePost(postId) {
    const index = posts.findIndex(post => post.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
        renderPosts();
    }
}

function likePost(postId) {
    const post = posts.find(post => post.id === postId);
    if (post) {
        post.likes++;
        renderPosts();
    }
}

document.getElementById("homeBtn").addEventListener("click", () => {
    switchPage("homePage");
});

document.getElementById("postBtn").addEventListener("click", openPostPopup);

document.getElementById("settingsBtn").addEventListener("click", () => {
    if (!loggedInUser) {
        alert("Only logged-in users can access settings.");
        return;
    }
    switchPage("settingsPage");
    renderUserPosts();
});

function renderUserPosts() {
    const userPosts = document.getElementById("userPosts");
    userPosts.innerHTML = "";
    posts.filter(post => post.user === loggedInUser).forEach(post => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <p>${convertLinksToAnchors(post.content)}</p>
            ${post.images.map(img => `<img src="${img}" alt="Post Image">`).join("")}
            <button onclick="deletePost(${post.id})">Delete</button>
        `;
        userPosts.appendChild(postElement);
    });
}

function switchPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });
    document.getElementById(pageId).classList.add("active");
}
