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

   // console.log(response)

    const data = await response.json()
    
   //console.log(data)

    loadingElement.style.display = 'none'

    data.map( () => {

              
        return data

    });

//=================logica para os controles============================



let perPage = 6

const state = {
    page: 1,
    perPage,
    totalPage: Math.ceil(data.length / perPage),
    maxBtnVisible: 5
}




const controls = {
    next() {
        
        state.page++

        const lastPage = state.page > state.totalPage
        if (lastPage) {
            state.page--
        }
    },
    prev() {
        state.page--

        const firstPage = state.page < 1
        if (firstPage) {
            state.page = 1
        }
    },
    goto(page) {
        state.page = +page

        if (page < 1) {
            state.page = 1
        } 
        
        if (page > state.totalPage) {
            state.page = state.totalPage
        };
    },    
    
        

    

    createListeners() {
        html.get('.first').addEventListener('click', () => {
            controls.goto(1)
            Help()
        } )

        
        html.get('.last').addEventListener('click', () => {
            controls.goto(state.totalPage)
            Help()
        } )

        

        html.get('.prev').addEventListener('click', () => {
            controls.prev()
            Help()
        } )

        html.get('.next').addEventListener('click', () => {
            
            controls.next()
            Help()
        } )
        
        
            
       
        
    }

  
}


const html = {
    get(element) {
        return document.querySelector(element)
    }
}

const list = {
    
    create(item) {
            
        
            const div = document.createElement('div');
            const title = document.createElement('h2');
            const body = document.createElement('p');
            const link = document.createElement('a');

            

            div.setAttribute('id', 'post-box');
            title.setAttribute('id', 'post-title');
            body.setAttribute('id', 'post-text');
            link.setAttribute('id', 'post-btn');
    
            title.innerText = item.title;
            body.innerText = item.body;
            link.innerText = 'Leia este post';
            link.setAttribute('href', `./post.html?id=${item.id}`);
    
            div.appendChild(title);
            div.appendChild(body);
            div.appendChild(link);
    
            postContainer.appendChild(div);
    
    },
    update() {
        list.clear()
        
        console.log('doink')
        
        let page = state.page - 1
        let start = page * state.perPage
        let end = start + state.perPage

        const paginatedItems = data.slice(start, end)

        console.log(data.slice(start, end))
        
                
        paginatedItems.forEach(list.create);
    },
    clear() {
        console.log('limpo')
        html.get('#posts-container').innerHTML = ""
        //let cleanPage = document.querySelector('#posts-container')
          //  cleanPage.parentNode.removeChild(cleanPage);
    }
    
}

const buttons = {
    element: html.get('.pagination .numbers'),

    create(number) {
        const button = document.createElement('div')

        button.innerHTML = number;
        button.id = 'btnVisible'

        if(state.page == number) {
            button.id = 'ativo'
        }

        button.addEventListener('click', (event) => {
            const page = event.target.innerText

            controls.goto(page)
            Help()
        })

        buttons.element.appendChild(button)
    },
    updade() {
        buttons.element.innerHTML = ""
        const {maxL, maxR} = buttons.calculateBtn()

        for (let page = maxL; page <= maxR; page++) {
            buttons.create(page)
        }

        console.log(maxL, maxR)
    },
    calculateBtn() {
        let maxL = (state.page - Math.floor(state.maxBtnVisible / 2))
        let maxR = (state.page + Math.floor(state.maxBtnVisible / 2))
        
        if (maxL < 1) {
            maxL = 1
            maxR = state.maxBtnVisible
        }

        if (maxR > state.totalPage) {
            maxL = state.totalPage - (state.maxBtnVisible - 1)
            maxR = state.totalPage
        }
        return {maxL, maxR}

    }
}

function Help() {

   list.update()
   buttons.updade()
}  

function init() {
    console.log('init')
    
    Help()
    controls.createListeners()
}


  init()
    
}
//console.log(dataForControls)
//const data2 = getAllPosts();
//console.log(data2)
//===================================================

 





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

    title.id = 'comment-title'

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
    const line = document.createElement('hr')
    const space = document.createElement('br')

    email.innerText = comment.email
    commentBody.innerText = comment.body

    email.id = 'comments-email'
    div.id = 'comments-box'

    div.appendChild(email)
    div.appendChild(commentBody)
    div.appendChild(space)
    div.appendChild(line)

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

