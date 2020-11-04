

  firebase.auth().onAuthStateChanged(function(user) {
    if(user)
    {
      
      window.location.href = 'todo.html';
    }
    else
    {
      //no user is signed on
      
      document.getElementById("logForm").reset();
      document.getElementById("email").focus(); 
    }
 
    

  });
function sub(){
    var userEmail = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
        document.getElementById("logForm").reset();
        window.alert(errorMessage+" bye");
        firebase.auth().signOut();
        // ...
      });
    }

  

function createNewAccount(){
    var userEmail = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
        document.getElementById("logForm").reset();
        window.alert(errorMessage+" bye");
        
        // ...
      });

}

