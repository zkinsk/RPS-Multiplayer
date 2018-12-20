
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAILO5uegbLorc-pC2z5IXE-W7IvcvazXM",
    authDomain: "rock-paper-sissors-f108c.firebaseapp.com",
    databaseURL: "https://rock-paper-sissors-f108c.firebaseio.com",
    projectId: "rock-paper-sissors-f108c",
    storageBucket: "rock-paper-sissors-f108c.appspot.com",
    messagingSenderId: "922262136321"
  };
  firebase.initializeApp(config);
  var database =firebase.database();
  var chatDB = database.ref("/chat");
  var rpsDB = database.ref("/rps");
  var player1DB = database.ref("/rps/player1");
  var player2DB = database.ref("/rps/player2");
  var playerChoice = database.ref("rps/playerChoice");
  var player1Chosen = database.ref("rps/playerChoice/player1");
  var player2Chosen = database.ref("rps/playerChoice/player2");
  var recentPostsRef = firebase.database().ref('/chat').limitToLast(10)
  var wins = 0;
  var loss = 0;
  var ties = 0;

//   var ref = firebase.database().ref("rps/playerChoice/" + playerChar);
//     ref.onDisconnect().set(false);


  

  var playerName = "nobody";
  var playerChar;
  var otherPlayer;
  var playerPicked = false;
  var attackChoose = false;

function buttonClick (){
    //   charButtonHide();
    $(".charBtn").on("click", function () {
        if (!playerPicked) {
            playerPicked = true;
            $(this).css({"background-color": "blue", "opacity": "1.0"})
            playerChar = $(this).attr("value");
            if (playerChar === "player1") {
                player1Chosen.set(true);
                otherPlayer = "player2"
            } else { 
                player2Chosen.set(true)
                otherPlayer = "player1" 
            }
            var pC = firebase.database().ref("rps/playerChoice/" + playerChar);
            pC.onDisconnect().set(false);
            var playeratt = database.ref("/rps/" + playerChar);
            playeratt.onDisconnect().set({attackDB: "x"})
            $('.gameBtn').prop('disabled', false);
            gameBtn();
        }
    })

    // Choose your name
    $("#playerNamebtn").click(function(event){
        event.preventDefault();
        playerName = $("#playerName").val();
        $("#playerName").val("");
        console.log("PayerName: " + playerName)
        if (playerName != ""){
            $("#playerNameBox").hide();
            $(".container").slideDown(200)
            $("#userName").text(playerName);
            localStorage.setItem("userDB", playerName);
        }else{}

    })

    $("#clearPlayer").click(function(){
        database.ref("/rps/playerChoice/" + playerChar).set(false);
        playerChar;
        playerPicked = false;
        attackChoose = false;
        $('.gameBtn').prop('disabled', true).css("background-color", "");
        $("#gameResults").empty().hide();
        $(".gameBtn").off("click");
    })

    $("#changeUser").click(function(){
        localStorage.clear();
        nameCheck();
    })
}


function gameBtn(){
    $(".gameBtn").on("click", function(){
        if (!attackChoose){
            attackChoose = true;
            let attack = $(this).attr("value");
            $(this).css({"background-color": "red"})
            if(playerChar == "player1"){
                player1DB.set({
                    name: playerName,
                    attackDB: attack
                })
            }else {player2DB.set({
                name: playerName,
                attackDB: attack
            })
        }
        }
    })
}


function charButtonHide(){
    playerChoice.on("value", function(choice){
        let oP = "#" + choice.val().otherPlayer;
        $(oP).fadeOut(100);
    })
}

var connectionsRef = database.ref("/connections");
// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snapshot) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#watchers").text(snapshot.numChildren());
});


// this is here as a reminder to how big my first try at game mechanics was
// function getAttacks(){
//     player1DB.on("value", function(attack1){
//         let player1Attack = attack1.val().attackDB;
//         let player1Name = attack1.val().name;
//         player2DB.once("value", function(attack2){

//         })
//         let player 
//         if(player1Attack !== "x" ){
//         player1HasAttacked = true;
//         $("#gameResults").empty();
//         $("#gameResults").html("<h1>Waiting</h1>").fadeIn(400)
//         }
//         if(player2HasAttacked && player1HasAttacked){
//             $("#gameResults").empty();
//             player2DB.off();
//             player1DB.off();
//             gameLogic(player1Attack, player1Name, player2Attack, player2Name)
//         }

//     });

//     player2DB.on("value", function(attack2){
//         player2Attack = attack2.val().attackDB;
//         player2Name = attack2.val().name;
//         if(player2Attack !== "x" ){
//             player2HasAttacked = true;
//             $("#gameResults").empty();
//         $("#gameResults").html("<h1>Waiting</h1>").fadeIn(400)
//         }
//         if(player1HasAttacked && player2HasAttacked){
//             $("#gameResults").empty();
//             player2DB.off("value");
//             player1DB.off("value");
//             gameLogic(player1Attack, player1Name , player2Attack, player2Name)
//         }

//     });

// }

function player(){
    playerChoice.on("value",function(miles){
        let play1 = miles.val().player1;
        let play2 = miles.val().player2;

        if (play1){
            $("#player1").prop("disabled", true)
        }else{
            $("#player1").prop("disabled", false)
            $("#player1").css({"background-color": "", "opacity": ""})
        }
        if(play2){
            $("#player2").prop("disabled", true)
        }else{
            $("#player2").prop("disabled", false)
            $("#player2").css({"background-color": "", "opacity": ""})
        }
    })
}

function getAttacks(){
    rpsDB.on("value",function(fred){
        let player1Attack = fred.val().player1.attackDB;
        let player1Name = fred.val().player1.name;
        let player2Attack = fred.val().player2.attackDB;
        let player2Name = fred.val().player2.name;
        if((player1Attack !== "x" && player2Attack == "x") || (player1Attack == "x" && player2Attack !== "x")  ) {
            $("#gameResults").empty();
            $("#gameResults").html("<h1>Waiting</h1>").fadeIn(400)
        }
        if(player1Attack !== "x" && player2Attack !== "x"){
        rpsDB.off("value");
        $("#gameResults").empty();
        gameLogic(player1Attack, player1Name , player2Attack, player2Name)
        }
    });
}


function gameLogic(player1Guess, player1Name, player2Guess, player2Name){
    $("#gameResults").empty().hide();
    if (player1Guess === "rock" && player2Guess === "sissors" || player1Guess === "sissors" && 
        player2Guess === "paper" || player1Guess === "paper" && player2Guess === "rock") {
        console.log ("player 1 Wins"); 
        var win1 = $("<h1>").text(player1Name + " Wins!")
        scoreKeeper("player1");
    }
    else if (player1Guess === player2Guess){
        console.log ("you tie");
        var win1 = $("<h1>").text("Its a Tie!");
        scoreKeeper("tie");
    }
    else  {
        console.log ("player 2 Wins");
        var win1 = $("<h1>").text(player2Name + " Wins!");
        scoreKeeper("player2");
    }
    $("#gameResults").append(win1)
    $("#gameResults").show().delay(2000).fadeOut(500)
    
    // player1Attack;
    // player2Attack;
    player1DB.set({attackDB: "x"});
    player2DB.set({attackDB: "x"});
    attackChoose = false;
    setTimeout(function(){
        $(".gameBtn").css("background-color", "")
        getAttacks();
    }, 1000);
}

function scoreKeeper(winner){
    if (winner === playerChar){
        wins++
        $("#winCount").text(wins);
    }
    else if(winner === "tie"){
        ties++
        $("#tieCount").text(ties);
        
    }else{
        loss++
        $("#lossCount").text(loss);
    }
}


function chat(){
  $("#chatButton").click(function(event){
      event.preventDefault();
      console.log("click");
      let chatText = $("#chatInput").val()
      console.log(chatText);
      chatDB.push({
          user: playerName,
          chatTextDB: chatText
        });
      $("#chatInput").val("");
    })
}



function chatUpdate(){
    chatDB.on("value", function(chatText){
        chatText.forEach(function(chat){
        let userName = chat.val().user;
        let chatT = chat.val().chatTextDB
        // console.log(userName);
        // console.log(chatT);
        let message = $("<p>").text(userName + ": " + chatT)
        $("#chatArea").prepend(message);
        });
    });
}

function nameCheck(){
    if (localStorage.getItem("userDB") !== null ){
        playerName = localStorage.getItem("userDB")
        $("#playerNameBox").hide();
        $(".container").fadeIn(200)
        $("#userName").text(playerName);
    }else{
        $(".container").hide();
        $("#playerNameBox").fadeIn(200);
    };


}


$(document).ready(function(){
    nameCheck();
    chat();
    chatUpdate();
    buttonClick();
    getAttacks();
    player();
   
// end of doc ready
})