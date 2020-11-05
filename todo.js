




function lOut(){
    
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          alert("signed in");
        } else {
          // No user is signed in.
          alert("signed out");
          window.location.href = 'index.html';
        }
      });
    
}

function showTodo(){   
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){

    var userID = firebase.auth().currentUser.uid;
    
    //document.getElementById("tasks-list").value = ''; 
    
    var table = document.getElementById("tasks-list");
    
    
    firebase.database().ref('users/'+userID).once('value').then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
    var row = table.insertRow(-1);
    var cell = row.insertCell(0);
    cell.innerHTML = childSnapshot.val().Task;                         
    
});
                      
    });
}
//end of if user signed in
    });
}


window.addEventListener('load',function(){
    showTodo();
let addTaskIcon = document.querySelector('.addTask');

    addTaskIcon.addEventListener("click",function(){
    
    firebase.auth().onAuthStateChanged(function(user) {
        if(user)
        {
            var todo = document.getElementById("todo-input").value;
            if(todo==''){return;}
            var userID = firebase.auth().currentUser.uid;
            firebase.database().ref('users/'+userID).push({Task: todo});  
            document.getElementById("todo-input").value='';   
            showAddedRow();  
            
            //alert("inside eventlistener");    
        }
        else{
            window.location.href = 'index.html';
        }
    });     
});




});
function showAddedRow(){
    
    var userID = firebase.auth().currentUser.uid;
    var table = document.getElementById("tasks-list");
    

    firebase.database().ref('users/'+userID).once('child_added').then(function(snapshot){
            
        var row = table.insertRow(-1);
        var cell = row.insertCell(0);
        cell.innerHTML = snapshot.val().Task;    
    });
}

