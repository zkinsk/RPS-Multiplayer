
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
  player1DB.set({attackDB: "x"});
  var player2DB = database.ref("/rps/player2");
  player2DB.set({attackDB: "x"});
  var playerChoice = database.ref("rps/playerChoice");

  var playerName = "testname";
  var playerChar;
  var otherPlayer;
  var playerPicked = false;
  var attackChoose = false;
  var player1HasAttacked = false;
  var player2HasAttacked = false;
  var player1Attack;
  var player2Attack;

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
                    attackDB: attack
                })
            }else {player2DB.set({
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

function getAttacks(){
    player1DB.on("value", function(attack1){
        player1Attack = attack1.val().attackDB;
        if(player1Attack !== "x" ){
        player1HasAttacked = true;
        }
        if(player2HasAttacked && player1HasAttacked){
            player2DB.off();
            player1DB.off();
            gameLogic(player1Attack, player2Attack)
        }

    });

    player2DB.on("value", function(attack2){
        player2Attack = attack2.val().attackDB;
        if(player2Attack !== "x" ){
            player2HasAttacked = true;
        }
        if(player1HasAttacked && player2HasAttacked){
            player2DB.off("value");
            player1DB.off("value");
            gameLogic(player1Attack, player2Attack)
        }

    });

}


function gameLogic(player1Guess, player2Guess){
    $("#gameResults").empty();
    if (player1Guess === "rock" && player2Guess === "sissors" || player1Guess === "sissors" && 
        player2Guess === "paper" || player1Guess === "paper" && player2Guess === "rock") {
        console.log ("player 1 Wins"); 
        var win1 = $("<h1>").text("Player 1 Wins!")
    }
    else if (player1Guess === player2Guess){
        console.log ("you tie");
        var win1 = $("<h1>").text("Its a Tie!")
    }
    else  {
        console.log ("player 2 Wins");
        var win1 = $("<h1>").text("Player 2 Wins!")
    }
    $("#gameResults").append(win1)
    $("#gameResults").show().delay(2000).fadeOut(500)
    player1Attack;
    player2Attack;
    player1DB.set({attackDB: "x"});
    player2DB.set({attackDB: "x"});
    player1HasAttacked = false;
    player2HasAttacked = false;
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