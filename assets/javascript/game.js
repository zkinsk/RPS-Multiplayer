
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
  var playerStatsDB = database.ref("/playerstats");
  var statID;
  var wins = 0;
  var loss = 0;
  var ties = 0;

//   var ref = firebase.database().ref("rps/playerChoice/" + playerChar);
//     ref.onDisconnect().set(false);


  

  var playerName = "nobody";
  var playerChar;
//   var otherPlayer;
  var playerPicked = false;
  var attackChoose = false;

//   choose name - 
function buttonClick (){
    //   pick payer number
    $(".charBtn").on("click", function () {
        if (!playerPicked) {
            playerPicked = true;
            $(this).css({"background-color": "blue", "opacity": "1.0"})
            playerChar = $(this).attr("value");
            if (playerChar === "player1") {
                player1Chosen.set(true);
                player1DB.set({
                    name: playerName,
                    attackDB: "x"
                })
                // otherPlayer = "player2"
            } else { 
                player2Chosen.set(true)
                player2DB.set({
                    name: playerName,
                    attackDB: "x"
                })
                // otherPlayer = "player1" 
            }
            var pC = firebase.database().ref("rps/playerChoice/" + playerChar);
            pC.onDisconnect().set(false);
            var playeratt = database.ref("/rps/" + playerChar);
            playeratt.onDisconnect().set({name: "nobody", attackDB: "x"})
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
            localStorage.setItem("userWins", wins);
            localStorage.setItem("userTies", ties);
            localStorage.setItem("userLoss", loss);
            $("#winCount").text(wins);
            $("#tieCount").text(ties);
            $("#lossCount").text(loss);
            setStats();
        }else{}

    })

    $("#clearPlayer").click(function(){
        database.ref("/rps/playerChoice/" + playerChar).set(false);
        if (playerChar === "player1") {
            player1Chosen.set(false);
            player1DB.set({
                name: "nobody",
                attackDB: "x"
            })
            // otherPlayer = "player2"
        } else { 
            player2Chosen.set(false)
            player2DB.set({
                name: "nobody",
                attackDB: "x"
            })
        }
        playerChar;
        playerPicked = false;
        attackChoose = false;
        $('.gameBtn').prop('disabled', true).css("background-color", "");
        $("#gameResults").empty().hide();
        $(".gameBtn").off("click");
    });

    // change user name - clears user stats and everything from local storage
    $("#changeUser").click(function(){
        localStorage.clear();
        nameCheck();
        playerStats.child(statID).remove();
        wins = 0;
        ties = 0;
        loss = 0;           
        $("#winCount").text(wins);
        $("#tieCount").text(ties);
        $("#lossCount").text(loss);
    });
};

// choose attack and send it to the database
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
};


/* function charButtonHide(){
    playerChoice.on("value", function(choice){
        let oP = "#" + choice.val().otherPlayer;
        $(oP).fadeOut(100);
    })
} */

function connectionCounter(){
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
};

/* this is here as a reminder to how big and messy my first try at game mechanics was
function getAttacks(){
    player1DB.on("value", function(attack1){
        let player1Attack = attack1.val().attackDB;
        let player1Name = attack1.val().name;
        player2DB.once("value", function(attack2){

        })
        let player 
        if(player1Attack !== "x" ){
        player1HasAttacked = true;
        $("#gameResults").empty();
        $("#gameResults").html("<h1>Waiting</h1>").fadeIn(400)
        }
        if(player2HasAttacked && player1HasAttacked){
            $("#gameResults").empty();
            player2DB.off();
            player1DB.off();
            gameLogic(player1Attack, player1Name, player2Attack, player2Name)
        }

    });

    player2DB.on("value", function(attack2){
        player2Attack = attack2.val().attackDB;
        player2Name = attack2.val().name;
        if(player2Attack !== "x" ){
            player2HasAttacked = true;
            $("#gameResults").empty();
        $("#gameResults").html("<h1>Waiting</h1>").fadeIn(400)
        }
        if(player1HasAttacked && player2HasAttacked){
            $("#gameResults").empty();
            player2DB.off("value");
            player1DB.off("value");
            gameLogic(player1Attack, player1Name , player2Attack, player2Name)
        }

    });

} */


// pick player 1 or player 2
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
};

// get attack values from database and if both are attacks - call game logic function
function getAttacks(){
    rpsDB.on("value",function(fred){
        let player1Attack = fred.val().player1.attackDB;
        let player1Name = fred.val().player1.name;
        let player2Attack = fred.val().player2.attackDB;
        let player2Name = fred.val().player2.name;
        if((player1Attack !== "x" && player2Attack == "x") || (player1Attack == "x" && player2Attack !== "x")  ) {
            $("#gameResults").empty();
            if (player1Attack == "x"){
                $("#gameResults").html("<h1>Waiting on " + player1Name + "</h1>").fadeIn(400)
            }else($("#gameResults").html("<h1>Waiting on " + player2Name + "</h1>").fadeIn(400))
        }
        if(player1Attack !== "x" && player2Attack !== "x"){
        rpsDB.off("value");
        $("#gameResults").empty();
        gameLogic(player1Attack, player1Name , player2Attack, player2Name)
        }
    });
};

// review attack data and determin a winner of the game
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
    player1DB.set({name: player1Name, attackDB: "x"});
    player2DB.set({name: player2Name, attackDB: "x"});
    attackChoose = false;
    setTimeout(function(){
        $(".gameBtn").css("background-color", "")
        getAttacks();
    }, 1000);
};

// update scores and write to page and local storage
function scoreKeeper(winner){
    if (winner === playerChar){
        wins++
        localStorage.setItem("userWins", wins);
        $("#winCount").text(wins);
    }
    else if(winner === "tie"){
        ties++
        localStorage.setItem("userTies", ties);
        $("#tieCount").text(ties);
        
    }else{
        loss++
        localStorage.setItem("userLoss", loss);
        $("#lossCount").text(loss);
    }
};


// chat functions
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
};

// updae chat box
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
};

function nameCheck(){
    if (localStorage.getItem("userDB") !== null ){
        playerName = localStorage.getItem("userDB")
        wins = localStorage.getItem("userWins")
        ties = localStorage.getItem("userTies")
        loss = localStorage.getItem("userLoss")
        $("#winCount").text(wins);
        $("#tieCount").text(ties);
        $("#lossCount").text(loss);
        $("#playerNameBox").hide();
        $(".container").fadeIn(200)
        $("#userName").text(playerName);
        setStats();
    }else{
        $(".container").hide();
        $("#playerNameBox").fadeIn(200);
    };


};

function setStats(){
    if (statID){
        playerStatsDB.child(statID).set({
            name: playerName,
            wins: wins,
            ties: ties,
            losses: loss,
        });
    }else{
        statID = playerStatsDB.push().getKey();
        playerStatsDB.child(statID).set({
            name: playerName,
            wins: wins,
            ties: ties,
            losses: loss,
        });
    } 
    var refresh = playerStatsDB.child(statID)
    refresh.onDisconnect().remove()
    // statID.onDisconnect().remove();
    
    // trainDB.child(tK).remove();
};

function playerStats(){
    playerStatsDB.on("value", function(upDate){
        $("tbody").empty();
        upDate.forEach(function(pstats){
            tData = $("<td>" + pstats.val().name + "</td> <td>" + pstats.val().wins + "</td><td>" + pstats.val().losses + "</td> <td>" + pstats.val().ties + "</td>" )
            tRow = $("<tr>");
            tRow.append(tData);
            $("tbody").append(tRow);
        })
    })
}


$(document).ready(function(){
    nameCheck();
    chat();
    chatUpdate();
    buttonClick();
    getAttacks();
    player();
    playerStats();
    connectionCounter();
   
// end of doc ready
})