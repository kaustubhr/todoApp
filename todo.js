




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
    firebase.database().ref('users/'+userID).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
     
    
    //var table = document.getElementById("tasks-list");
    
    
   
    /*var row = table.insertRow(-1);
    var cell = row.insertCell(0);
    cell.innerHTML = childSnapshot.val().Task;  
    */
   //todo DIV

   let todoList = document.querySelector(".todo-list");
   todoList.addEventListener('click',deleteCheck);
   let todoDiv = document.createElement('div');
   todoDiv.classList.add("todo");
   
   let newTodo = document.createElement('li');
   newTodo.classList.add('todo-item');
   
   newTodo.innerHTML=childSnapshot.val().Task;// this is taking in task, add functionality to read isComplete too 
   if(childSnapshot.val().isComplete == "yes"){
       console.log("hello boys");
       todoDiv.classList.add("completed");
   }
   //check if just adding class in JS is enough to trigger css class property


   

   todoDiv.appendChild(newTodo);
   //checked button
   let completedButton = document.createElement('button');
   completedButton.innerHTML = '<i class="fas fa-check"></i>';
   completedButton.classList.add("complete-btn");
   todoDiv.appendChild(completedButton);

   //trash button
   let trashButton = document.createElement('button');
   trashButton.innerHTML = '<i class="fas fa-trash"></i>';
   trashButton.classList.add("trash-btn");
   todoDiv.appendChild(trashButton);

   //append this todoDiv to ul todo-list
   todoList.appendChild(todoDiv);


   
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
            firebase.database().ref('users/'+userID).push({Task: todo,isComplete: "no"});  
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
    //var table = document.getElementById("tasks-list");
    

   
    //todo DIV
   const todoList = document.querySelector(".todo-list");
   todoList.addEventListener('click',deleteCheck);
   const todoDiv = document.createElement('div');
   todoDiv.classList.add("todo");
   
   
   const newTodo = document.createElement('li');
   newTodo.classList.add('todo-item');
   firebase.database().ref('users/'+userID).once('child_added').then(function(snapshot){
    newTodo.innerHTML=snapshot.val().Task;  
    if(snapshot.val().isComplete == "yes"){
        console.log("hello boys 2");
        todoDiv.classList.add("completed");
    }     
});
   
   todoDiv.appendChild(newTodo);
   //checked button
   const completedButton = document.createElement('button');
   completedButton.innerHTML = '<i class="fas fa-check"></i>';
   completedButton.classList.add("complete-btn");
   todoDiv.appendChild(completedButton);

   //trash button
   const trashButton = document.createElement('button');
   trashButton.innerHTML = '<i class="fas fa-trash"></i>';
   trashButton.classList.add("trash-btn");
   todoDiv.appendChild(trashButton);

   //append this todoDiv to ul todo-list
   todoList.appendChild(todoDiv);
}

function deleteCheck(e){
    let item = e.target;
    
    //delete todo
    if(item.classList[0]=="trash-btn"){
        let rem = item.parentElement;
        let taskToDel = rem.innerText;
        firebase.auth().onAuthStateChanged(function(user) {
            if(user)
            {
                
                var userID = firebase.auth().currentUser.uid;
                console.log(taskToDel);
               firebase.database().ref('users/'+userID).orderByChild('Task').equalTo(taskToDel).
                on('value',function(snapshot){
                    console.log(snapshot.val());
                    snapshot.forEach(function(child){
                        child.ref.remove();
                        
                    });
                  
                });  
                   
            }
            
        }); 
        rem.remove();

    }
    if(item.classList[0]=="complete-btn"){
        let rem = item.parentElement;
        let itemToUpdate = rem.innerText;
        console.log(rem);
        firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                var userID = firebase.auth().currentUser.uid;
                
                firebase.database().ref('users/'+userID).orderByChild('Task').equalTo(itemToUpdate).
                on('value',function(snapshot){
                    
                    snapshot.forEach(function(child){
                        console.log(child.val());
                        
                        if(rem.classList.contains("completed")==true)
                        {
                            child.ref.update({isComplete:"yes"});
                        }
                        else{
                            child.ref.update({isComplete:"no"});
                        }
                    });
                });
            }});
        rem.classList.toggle("completed");

    }        
}

