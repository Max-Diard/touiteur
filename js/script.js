const userName = document.querySelector("#get-name");
const messageInput = document.querySelector("#get-message");
const formulaire = document.querySelector(".formulaire");
const emplacementTouit = document.querySelector(".bloc-message");
let teamSpeak = 0;

// Lancement de la function pour récupérer tous les touits et rafraîchir la page

recupTouit();

// Ecoute du lancement d'un touit

formulaire.addEventListener('submit', function(ev){
    ev.preventDefault();
    console.log("Toudoum!");
    addTouit(userName.value, messageInput.value);
    messageInput.value = "";
    userName.value = "";
});

// Requête AJAX pour récupérer les messages

function recupTouit(){

    const request = new XMLHttpRequest();
    request.open("GET", "http://touiteur.cefim-formation.org/list?ts=" + teamSpeak, true);
    request.addEventListener(
        'readystatechange', function(){
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    const recuperation = JSON.parse(request.response);
                    teamSpeak = recuperation.ts;
                    for (let i = 0; i < recuperation.messages.length; i++){
                        addListTouit(
                            recuperation.messages[i].name,
                            recuperation.messages[i].message,
                            recuperation.messages[i].likes,
                            recuperation.messages[i].comments_count,
                            recuperation.messages[i].id
                        );
                    }
                } else {
                    recuperation.textContent = "ERREUR : Pas de touit";
                }
            }
        }
    )
    request.send();
};

setInterval(recupTouit, 1000);

// Function pour créer des emplacements de touit 

function addListTouit(name, message, like, comment, id){

    // Ici c'est pour les commentaires

    const groupComments = document.createElement("div");
    groupComments.className = "group-comments";

    // Ici c'est pour regrouper les boutons

    const groupButton = document.createElement("div");
    groupButton.className = "btn-group";

    const newButton1 = document.createElement("button");
    newButton1.className = "btn-like";
    newButton1.textContent = like;

    const newButton2 = document.createElement("button");
    newButton2.className = "btn-comment";
    newButton2.textContent = comment;

    const newButton3 = document.createElement("button");
    newButton3.className = "btn-share";

    groupButton.appendChild(newButton1);
    groupButton.appendChild(newButton2);
    groupButton.appendChild(newButton3);

    // Ici on écoute quand est ce que l'on doit afficher les commentaires
    
    newButton2.addEventListener(
        'click', function(){
            newButton2.setAttribute("disabled", true);
            // Ici on créer un bouton pour fermer les commentaires
            const delButton = document.createElement("button");
            delButton.className = "del-btn";
            groupComments.appendChild(delButton);
            comments(id, groupComments, newButton2, delButton);
        }
    )


    //Ici on mets le formulaire pour ajouter un commentaire

    const newForm = document.createElement("form");
    newForm.className = "comments-form";

    const newFormTitle = document.createElement("input");
    newFormTitle.className = "comments-form-title";

    const newFormMessage = document.createElement("input");
    newFormMessage.className = "comments-form-message";

    const newFormButton = document.createElement("input");
    newFormButton.className = "comments-form-button";
    newFormButton.setAttribute("type", "submit");

    newForm.appendChild(newFormTitle);
    newForm.appendChild(newFormMessage);
    newForm.appendChild(newFormButton);

    //Ici c'est pour les parents
    
    const newTouit = document.createElement("div");
    newTouit.className = "message-group";

    //Ici c'est pour l'user et le message
    
    const newName = document.createElement("h2");
    newName.className = "message-title";
    newName.textContent = name;

    const newMessage = document.createElement("p");
    newMessage.className = "message-text";
    newMessage.textContent = message;

    //Ici c'est pour regrouper le tout

    newTouit.appendChild(newName);
    newTouit.appendChild(newMessage)
    newTouit.appendChild(groupButton);
    newTouit.appendChild(groupComments);
    newTouit.appendChild(newForm);
    emplacementTouit.appendChild(newTouit);
};

// Requête AJAX pour envoyer des messages 

function addTouit(name,message){
    const request = new XMLHttpRequest();
    request.open("POST", "http://touiteur.cefim-formation.org/send", true);
    request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    request.send("name=" + encodeURIComponent(name) + "&message=" + encodeURIComponent(message));
    recupTouit();
};

// Requête AJAX pour récupérer les commentaires

function comments(id, groupComments, newButton2, delButton){
    const request = new XMLHttpRequest();
    request.open("GET", "http://touiteur.cefim-formation.org/comments/list?message_id=" + id, true);
    request.addEventListener(
        'readystatechange', function(){
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    const recuperation = JSON.parse(request.response);
                    for (let i = 0; i < recuperation.comments.length; i++){
                        addComments(
                            recuperation.comments[i].name, 
                            recuperation.comments[i].comment, 
                            groupComments, 
                            newButton2,
                            delButton
                            );
                    }
                } else {
                    recuperation.textContent = "ERREUR : Pas de commentaire";
                }
            }
        }
    )
    request.send();
};

// Function pour voir les commentaires sous un touit

function addComments(name, comments, groupComments, newButton2, delButton){
    

    //Ici c'est pour les parents
    
    const newBlocComments = document.createElement("div");
    newBlocComments.className = "all-comments-group";

    //Ici c'est pour l'user et le message
    
    const newName = document.createElement("h3");
    newName.className = "comments-title";
    newName.textContent = name;

    const newComments = document.createElement("p");
    newComments.className = "comments-text";
    newComments.textContent = comments;

    //Ici c'est pour regrouper le tout

    newBlocComments.appendChild(newName);
    newBlocComments.appendChild(newComments);
    groupComments.appendChild(newBlocComments);

    //Ici on écoute le delButton pour savoir quand enlever les commentaires

    delButton.addEventListener(
        'click', function(){
            groupComments.removeChild(newBlocComments);
            groupComments.removeChild(delButton);
            newButton2.removeAttribute("disabled");
        }
    )
};

// Requête AJAX pour recevoir les influenceurs

function addInfluencers(){
    const request = new XMLHttpRequest();
    request.open("GET", "http://touiteur.cefim-formation.org/influencers?count=5", true);
    request.addEventListener(
        'readystatechange', function(){
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    const recuperation = JSON.parse(request.response);
                    for (let i = 0; i < 5; i++){
                        addListInfluencers(recuperation.influencers);
                    }
                } else {
                    recuperation.textContent = "ERREUR : Pas de touit";
                }
            }
        }
    )
    request.send();
};

addInfluencers();

function addListInfluencers(){
    console.log("ca marche ?") // peut être utiliser recuperation.infleuencers.value ou .textContent pour récup le nom
};

/* CODE POUR AJAX

const jokesContainer = document.querySelector("#jokes");
​
for (let i = 0; i < 1000; i++) {
    const joke = document.createElement("p");
    jokesContainer.appendChild(joke);
​
    const request = new XMLHttpRequest();
    request.open("GET", "https://api.chucknorris.io/jokes/random", true);
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
​
                joke.textContent = response.value;
            } else {
                joke.textContent = "ERREUR : Pas de blague :'(";
            }
        }
    });
    request.send();
*/