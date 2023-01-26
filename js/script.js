const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.getElementById('loading');
const postContainer = document.querySelector('#posts-container');

const postPage = document.querySelector('#post');
const postContainer2 = document.querySelector('#post-container');
const commentsContainer = document.querySelector('#comments-container');

const commentForm = document.querySelector('#comment-form');
const emailInput = document.querySelector('#email');
const bodyInput = document.querySelector('#body')

// pegar id da url

const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get('id')

//pegar todos os posts

async function getAllPosts() {

    const response = await fetch(url)

    console.log(response)

    const data = await response.json()

    console.log(data)

    loadingElement.style.display = 'none'

    data.map( (post) => {

        const div = document.createElement('div');
        const title = document.createElement('h2');
        const body = document.createElement('p');
        const link = document.createElement('a');

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = 'Leia este post';
        link.setAttribute('href', `./post.html?id=${post.id}`);
        




        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postContainer.appendChild(div);

    });
}

//pegar cada post individual

async function getPost(id) {

    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])

    const dataPost = await responsePost.json()

    const dataComments = await responseComments.json()

    loadingElement.style.display = 'none'
    postPage.classList.remove('hide')

    const title = document.createElement('h1')
    const body = document.createElement('p')

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer2.appendChild(title)
    postContainer2.appendChild(body)

    console.log(dataComments)

    dataComments.map((comment) => {

        CreateComment(comment)

    })

}

function CreateComment(comment) {

    const div = document.createElement('div');
    const email = document.createElement('h3')
    const commentBody = document.createElement('p')

    email.innerText = comment.email
    commentBody.innerText = comment.body

    div.appendChild(email)
    div.appendChild(commentBody)

    commentsContainer.appendChild(div)

}

//postar seu comentario
async function postComment(comment) {
    const response = await fetch(`${url}/${postId}/comments`,{
        method: 'POST',
        body: comment,
        headers: {
            'Content-type': 'application/json',
        },
    });

    const data = await response.json()

    CreateComment(data);

}


if(!postId) {
    getAllPosts()
} else {
    getPost(postId)

    // adiciona um evento no form
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let comment = {
            email: emailInput.value,
            body: bodyInput.value,
        };

        comment = JSON.stringify(comment)

        emailInput.value = ''
        bodyInput.value = ''

        postComment(comment)


    })
}

