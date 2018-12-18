
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
  player1DB.set({name: "nobody", attackDB: "x"});
  var player2DB = database.ref("/rps/player2");
  player2DB.set({name: "nobody", attackDB: "x"});
  var playerChoice = database.ref("rps/playerChoice");
  var player1Chosen = database.ref("rps/playerChoice/player1");
  var player2Chosen = database.ref("rps/playerChoice/player2");


  

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
        $(this).css("background-color", "blue")
        playerChar = $(this).attr("value");
        if (playerChar === "player1") {
            otherPlayer = "player2"
        } else { otherPlayer = "player1" }
        console.log("Player: " + playerChar)
        console.log("Other Player: " + otherPlayer)
        gameBtn();

        // playerChoice.set({
        //     otherPlayer: playerChar
        // })
    }
})
$("#playerNamebtn").click(function(event){
    event.preventDefault();
    playerName = $("#playerName").val();
    console.log("PayerName: " + playerName)
})
}


function gameBtn(){
    $(".gameBtn").on("click", function(){
        if (!attackChoose){
            attackChoose = true;
            let attack = $(this).attr("value");
            if(playerChar == "player1"){
                player1DB.set({
                    name: playerName,
                    attackDB: attack
                })
            }else {player2DB.set({
                name: playerName,
                attackDB: attack
            })}
        }
    })
}


function charButtonHide(){
    playerChoice.on("value", function(choice){
        let oP = "#" + choice.val().otherPlayer;
        $(oP).fadeOut(100);
    })
}

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
    }
    else if (player1Guess === player2Guess){
        console.log ("you tie");
        var win1 = $("<h1>").text("Its a Tie!")
    }
    else  {
        console.log ("player 2 Wins");
        var win1 = $("<h1>").text(player2Name + " Wins!")
    }
    $("#gameResults").append(win1)
    $("#gameResults").show().delay(2000).fadeOut(500)
    // player1Attack;
    // player2Attack;
    player1DB.set({attackDB: "x"});
    player2DB.set({attackDB: "x"});
    attackChoose = false;
    setTimeout(function(){
        getAttacks();
    }, 1000);
}


function chat(){
  $("#chatButton").click(function(event){
      event.preventDefault();
      console.log("click");
      let chatText = $("#chatInput").val()
      console.log(chatText);
      chatDB.set({
          user: playerName,
          chatTextDB: chatText
        });
      $("#chatInput").val("");
    })
}



function chatUpdate(){
    chatDB.on("value", function(chatText){
        let userName = chatText.val().user;
        let chatT = chatText.val().chatTextDB
        // console.log(userName);
        // console.log(chatT);
        let message = $("<p>").text(userName + ": " + chatT)
        $("#chatArea").prepend(message);
    });
}


$(document).ready(function(){
    chat();
    chatUpdate();
    buttonClick();
    getAttacks();



// end of doc ready
})