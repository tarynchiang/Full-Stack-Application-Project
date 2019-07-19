

document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');




// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

let buttons = document.getElementsByClassName('comments-btn')
for(let i=0;i<buttons.length;i++){
  buttons[i].onclick = (e)=>{

    let content = document.getElementsByClassName('comments')[i].value
    let postid = document.getElementsByClassName('comments')[i].id

    axios.post('/comments/create', {content:content, postid:postid})
    .then(()=>{
      location.reload();
    })
    .catch((err)=>{
      console.log(err);
    })
  }
}

// let commentBox = document.getElementsByClassName('comments')
// for(let i=0;i<commentBox.length;i++){
//   commentBox[i].onclick = (e)=>{

//   }
// }

let commentViews = document.getElementsByClassName('viewComments');
let sections = document.getElementsByClassName('comments-sec');
for(let i=0;i<commentViews.length;i++){
  commentViews[i].onclick = (e)=>{

    if(sections[i].classList.contains('hidden')){
      sections[i].classList.remove('hidden');
    }else{
      sections[i].classList.add('hidden');
    }
  }
}


let deleteBtn = document.getElementsByClassName('comment-delete');

for(let i=0;i<deleteBtn.length;i++){
  
  deleteBtn[i].onclick = (e)=>{
    let commentID = deleteBtn[i].id;
    let postID = deleteBtn[i].getAttribute("name");
    axios.post('/comments/delete',{commentID:commentID, postID:postID, index:i})
    .then(()=>{
      location.reload();
    })
    .catch((err)=>{
      console.log(err);
    })
  }

}

let likesBtn = document.getElementsByClassName('LikesBtn');

for(let i=0;i<likesBtn.length;i++){
  let postID = likesBtn[i].getAttribute("name");
  likesBtn[i].onclick = (e)=>{
    axios.post('/post/likes',{postID:postID})
    .then(()=>{
      location.reload();
    })
    .catch((err)=>{
      console.log(err);
    })
    
  }

}



function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}



$(document).ready(function() { // When page finished loading
  if ( $('.flash').length ) { // if there is an DOM that has class has-error
     $('#changePasswordModal').modal('show'); // Show Modal
  }
});

}, false);