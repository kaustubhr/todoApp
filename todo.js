let dateSelected = new Date();




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
   let taskNameToDel = document.createElement('input');
   taskNameToDel.innerText = childSnapshot.val().task;
   taskNameToDel.setAttribute("type","hidden");
   todoDiv.appendChild(taskNameToDel);

   
   
   let newTodo = document.createElement('li');
   newTodo.classList.add('todo-item');

   //if current millis is more than task millis, add red background indicating task is PAST the time.
   var d=new Date();
   if(d.getTime() > childSnapshot.val().millis){
        todoDiv.classList.add("pastTask");
   } 
   

   if(childSnapshot.val().pendingIntentNumber == 0){
    newTodo.innerHTML="<b><h4>"+childSnapshot.val().task+"</b></h4>";
   }
   else{
    newTodo.innerHTML="<b><h4>"+childSnapshot.val().task+"</b></h4>"+childSnapshot.val().day+","+childSnapshot.val().date+"<br>"+childSnapshot.val().time;
   }
  
   //TODO: DONE if pendingNumber is 0, then no date-time for reminder is set. just need to display the task in newTodo.innerHTML after checking the condition
   //newTodo.innerHTML="<pre>"+childSnapshot.val().task+"  "+childSnapshot.val().time+"<br>"+childSnapshot.val().day+"  "+childSnapshot.val().date+"</pre>";
   // this is taking in task, add functionality to read isComplete too 
   
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

   if(childSnapshot.val().isComplete == "yes"){
    //console.log("hello boys");
    todoDiv.classList.add("completed");
    completedButton.classList.add("green-background");
    completedButton.childNodes[0].className="fas fa-undo";
}


   
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
            
            //option if users wants to set reminder date time or not
            $("#reminderOption").dialog({
                title:"Reminder Settings",
                draggable:false,
                resizeable:false,
                height:188,
                width:250,
                modal:true, 
               
                
                           
                open:function(){
                    $("#reminderOptionText").text("Do you want to set date and time for this task?");
                },
                
                buttons:[
                    {
                        text:"Yes",
                        icon:"ui-icon-check",// (ui-icon-check)
                        style:"color:Green",
                        click: function(){                           
                           $("#reminderOptionText").text("");
                           
                           $("#datepick").show();                   
                           $("#datepick").datepicker({
                               showAnim:"fadeIn",
                               onSelect:function (selectedDate){
                                   dateSelected = new Date(selectedDate);
                                   console.log("dateSelected is "+dateSelected);
                                   $("#datepick").datepicker("refresh");
                                   $("#datepick").hide();

                                  var y = document.getElementById("timepick");
                                  y.type= "text";
                                  y.placeholder = "Enter time here";
                                    $("#timepick").dialog({
                                        title:"Choose Reminder Time Below",
                                        draggable:false,
                                        resizeable:false,
                                        height:200,
                                        width:350,
                                        modal:true,
                                        buttons:[{text:"Done",
                                        icon:"ui-icon-check",
                                        style:"color:Green",
                                        click:function(){
                                            $("#timepick").dialog("close");
                                            $("#timepick").timepicker("close");
                                            iqwerty.toast.toast('Task Added!');
                                            document.getElementById("todo-input").value="";
                                            let timeString = dateSelected.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                                            firebase.database().ref('users/'+userID).push(
                                                {date:dateSelected.toString().split(' ')[2]+" "+dateSelected.toString().split(' ')[1],
                                                day:dateSelected.toString().split(' ')[0],isAlarm:"no",isComplete:"no",
                                                millis:dateSelected.getTime(),pendingIntentNumber:1,
                                                task: todo,time:timeString});
                                            showAddedRow();  

                                            //push to database here
                                        }}]
                                    });
                                    $("#timepick").timepicker({
                                       timeFormat:'h:mm p',
                                       interval: 15,
                                       dropdown:true,
                                       dynamic:true,
                                       scrollbar:true,
                                       startTime: '10:00',
                                       
                                       change:function(time){
                                           
                                           dateSelected.setHours(time.getHours());
                                           dateSelected.setMinutes(time.getMinutes());
                                           dateSelected.setSeconds(time.getSeconds());


                                           console.log("date selected with timepicker time is "+dateSelected);
                                           console.log("\ntime in millis is "+dateSelected.getTime());                                   

                                    }
                                    


                                   });


                                  // $("#datepicker").timepicker();
                               }                      
                                                            
                           }

                           );
                           $("#reminderOption").dialog("close");                                             
                        }
                            
                    },           
                   
                    {
                        text:"No",
                        icon:"ui-icon-close",
                        style:"color:Red",
                        click:function(){
                            $("#datepickerText").text("");
                            
                            $("#reminderOption").dialog("close");

                            firebase.database().ref('users/'+userID).push(
                                {date:"",
                                day:"",isAlarm:"no",isComplete:"no",
                                millis:0,pendingIntentNumber:0,
                                task:todo,time:""}); 
                            
                            document.getElementById("todo-input").value="";
                            showAddedRow(); 

                            //TODO: DONE have to call pushtodatabase with default values for date and time
                            //TODO: DONE have to set task-textbox to "" empty
                            //TODO: DONE showaddedRow() here
                           
                        }
                    }
                ]
            });
            //datepicker code here

            //$("#datepicker").datepicker();


           


            //timepicker code here

            //push whole object here , including notification details
           // 
            //empty the addTask input type
            //document.getElementById("todo-input").value='';   
            //showAddedRow();  
            
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

    //if current millis is more than task millis, add red background indicating task is PAST the time.
   
  
   
   todoDiv.appendChild(newTodo);
   //checked button
   const completedButton = document.createElement('button');
   completedButton.innerHTML = '<i class="fas fa-check"></i>';
   completedButton.classList.add("complete-btn");
   todoDiv.appendChild(completedButton);
   /*completedButton.classList.add("green-background");*/
   

   firebase.database().ref('users/'+userID).once('child_added').then(function(snapshot){
       if(snapshot.val().pendingIntentNumber == 0){
           newTodo.innerHTML="<h4><b>"+snapshot.val().task+"</b></h4>";
       }
       else{
        newTodo.innerHTML="<b><h4>"+snapshot.val().task+"</b></h4>"+snapshot.val().day+","+snapshot.val().date+"<br>"+snapshot.val().time;
       }
       var d=new Date();
       if(d.getTime() > snapshot.val().millis + 60000){
           todoDiv.classList.add("pastTask");
       } 

    
    //TODO: DONE: if pendingNumber is 0, then no date-time for reminder is set. just need to display the task in newTodo.innerHTML after checking the condition
    
    //"<pre>"+snapshot.val().task+"  "+snapshot.val().time+"<br>"+snapshot.val().day+"  "+snapshot.val().date+"</pre>";  
    if(snapshot.val().isComplete == "yes"){
        //console.log("hello boys 2");
        todoDiv.classList.add("completed");
        completedButton.classList.add("green-background");
        completedButton.childNodes[0].className="fas fa-undo";
    }     
});

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
   
    // item is button class = complete-btn green-background
    //delete todo
    if(item.classList[0]=="trash-btn"){
        let rem = item.parentElement;
        
        let taskToDel = rem.firstChild.innerText;
        firebase.auth().onAuthStateChanged(function(user) {
            if(user)
            {
                
                var userID = firebase.auth().currentUser.uid;
                //console.log(taskToDel);
               firebase.database().ref('users/'+userID).orderByChild('task').equalTo(taskToDel).
                on('value',function(snapshot){
                    //console.log(snapshot.val());
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
        let itemToUpdate = rem.firstChild.innerText;
       //console.log(rem);
        
        firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                var userID = firebase.auth().currentUser.uid;
                
                firebase.database().ref('users/'+userID).orderByChild('task').equalTo(itemToUpdate).
                on('value',function(snapshot){
                    
                    snapshot.forEach(function(child){
                        //console.log(child.val());
                        
                        if(rem.classList.contains("completed")==true)
                        {
                            child.ref.update({isComplete:"yes"});
                            item.classList.add("green-background");  
                            item.childNodes[0].className = "fas fa-undo";                                    

                        }
                        else{
                            child.ref.update({isComplete:"no"});
                            item.classList.remove("green-background");
                            item.childNodes[0].className = "fas fa-check";  
                        }
                    });
                });
            }});
        rem.classList.toggle("completed");

    }        
}

