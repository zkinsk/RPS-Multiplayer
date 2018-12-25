
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

  var playerName = "nobody";
  var playerChar;
  var playerPicked = false;
  var attackChoose = false;
  var loaded = false;

//   sets a bunch of butten even listeners - Name entry - player 1 or 2  choser - clear player button - delete name button
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
        // console.log("PayerName: " + playerName)
        if (playerName != ""){
            $("#playerNameBox").hide();
            $("#overallGameBox").slideDown(200)
            $("#userName").text(playerName);
            localStorage.setItem("userDB", playerName);
            localStorage.setItem("userWins", wins);
            localStorage.setItem("userTies", ties);
            localStorage.setItem("userLoss", loss);
            $("#winCount").text(wins);
            $("#tieCount").text(ties);
            $("#lossCount").text(loss);
            location.reload();
            setStats();
        }else{}

    })
// clear player button
    $("#clearPlayer").click(function(){
        if (playerChar === "player1") {
            database.ref("/rps/playerChoice/" + playerChar).set(false);
            playerChar;
            playerPicked = false;
            attackChoose = false;
            player1Chosen.set(false);
            player1DB.set({
                name: "nobody",
                attackDB: "x"
            })
            // otherPlayer = "player2"
        } else if (playerChar === "player2") { 
            database.ref("/rps/playerChoice/" + playerChar).set(false);
            playerChar;
            playerPicked = false;
            attackChoose = false;
            player2Chosen.set(false)
            player2DB.set({
                name: "nobody",
                attackDB: "x"
            })
        }
   
        $(".charBtn").css({"background-color": ""})
        $('.gameBtn').prop('disabled', true).css("background-color", "");
        $("#gameResults").empty();
        // $(".gameBtn").off("click");
    });

    // change user name - clears user stats and everything from local storage
    $("#changeUser").click(function(){
        localStorage.clear();
        nameCheck();
        playerStatsDB.child(statID).remove();
        wins = 0;
        ties = 0;
        loss = 0;           
        $("#winCount").text(wins);
        $("#tieCount").text(ties);
        $("#lossCount").text(loss);
    });
    $("#watcherBox button").click(function(){
        $(this).toggleClass("btn-danger btn-dark")
        $('body,html').animate({scrollTop: "210px"},1000)    })
};

// choose attack and send it to the database
function gameBtn() {
    $(".gameBtn").on("click", function () {
        console.log("gmBtn Click: " + playerChar);
        if (playerChar == "player1") {
            player1DB.once("value", function (p1) {
                var a = p1.val().attackDB
                if (a == "x") {
                    attackChoose = false
                }

            });
        } else if (playerChar == "player2") {
            player2DB.once("value", function (p2) {
                var a = p2.val().attackDB
                if (a == "x") {
                    attackChoose = false
                }

            });
        }
        if (!attackChoose) {
            attackChoose = true;
            let attack = $(this).attr("value");
            $(this).css({ "background-color": "blue" })
            if (playerChar == "player1") {
                player1DB.set({
                    name: playerName,
                    attackDB: attack
                })
            } else {
                player2DB.set({
                    name: playerName,
                    attackDB: attack
                })
            }
        }
    })
};


// Connection counter shown at class - It's kind of redundent now as I have player stats and could just count those children
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


// monitors database for when someone chooses player 1 or player 2
function player(){
    rpsDB.on("value",function(miles){
        let play1 = miles.val().playerChoice.player1;
        let play2 = miles.val().playerChoice.player2;
        let play1Name = miles.val().player1.name;
        let play2Name = miles.val().player2.name;

        if (play1Name != "nobody"){
            $("#player1Name").text(play1Name);
        }else{$("#player1Name").empty()}

        if (play2Name != "nobody"){
            $("#player2Name").text(play2Name);
        }else{$("#player2Name").empty()}

        if (play1 && play2 && !playerPicked){
            $("#clearPlayer").prop("disabled", true)
        }else{
            $("#clearPlayer").prop("disabled", false)
        }

        if (play1){
            $("#player1").prop("disabled", true)
            if(playerChar == "player2" && playerPicked){
                $("#player1").css({"background-color": "red"})
            }
        }else{
            $("#player1").prop("disabled", false)
            $("#player1").css({"background-color": "", "opacity": ""})
        }
        if(play2){
            $("#player2").prop("disabled", true)
            if(playerChar == "player1" && playerPicked){
                $("#player2").css({"background-color": "red"})
            }
        }else{
            $("#player2").prop("disabled", false)
            $("#player2").css({"background-color": "", "opacity": ""})
        }
    });
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
                $("#gameResults").html("<h4>Waiting on " + player1Name + "</h4>").fadeIn(400)
            }else($("#gameResults").html("<h4>Waiting on " + player2Name + "</h4>").fadeIn(400))
        }
        if(player1Attack !== "x" && player2Attack !== "x"){
        rpsDB.off("value");
        player();
        $("#gameResults h4").empty();
        $('.gameBtn').prop('disabled', true);
        gameLogic(player1Attack, player1Name , player2Attack, player2Name)
        }
    });
};

// review attack data and determin a winner of the game
function gameLogic(player1Guess, player1Name, player2Guess, player2Name){
    $("#gameResults h4").empty();
    if(playerChar === "player1"){
        var pG = player2Guess;
        var oP = player1Guess
    }else{
        var pG = player1Guess
        var oP = player2Guess
    };

    if (player1Guess === "rock" && player2Guess === "sissors" || player1Guess === "sissors" &&
        player2Guess === "paper" || player1Guess === "paper" && player2Guess === "rock") {
        // console.log("player 1 Wins");
        // var win1 = $("<h1>").text(player1Name + " Wins!")
        gameResultsDisplay(player1Name, pG, player2Name, oP)
        scoreKeeper("player1");


    }
    else if (player1Guess === player2Guess){
        // console.log ("you tie");
        // var win1 = $("<h1>").text("Its a Tie!");
        scoreKeeper("tie");

        gameResultsDisplay(player1Name, player1Guess, player2Name, player2Guess, "tie" )
    }
    else  {
        // console.log ("player 2 Wins");
        gameResultsDisplay(player2Name, pG, player1Name, oP)
        // var win1 = $("<h4>").text(player2Name + " Wins!");
        scoreKeeper("player2");

    }
    // $("#gameResults h4").hide().append(win1)
    // $("#gameResults h4").show().delay(2000).fadeOut(500)

    // player1Attack;
    // player2Attack;
    player1DB.set({name: player1Name, attackDB: "x"});
    player2DB.set({name: player2Name, attackDB: "x"});
    attackChoose = false;
    setTimeout(function(){
        $(".gameBtn").css("background-color", "")
        getAttacks();
    }, 3000);
};

// update the DOM with results of the attacks - shows both results for people logged in but not player
function gameResultsDisplay(winnerName, pAttack, loserName, oAttack, tie){
    // let otherAttack = $("<div class = 'otherAttack'>")
    // otherAttack.append('<img class="attackImage" src="assets/images/' + pAttack + '-hand.jpg">')
    $("#gameResults").empty();
    // var resultDiv = $("<div class='resultDiv'>");
    var winDiv = $("<div class='col-4 col-md-3'>")
    var winButton = $('<button type="button" class="btn btn-secondary btn-sm otherAttack"><img class="attackImage" src="assets/images/' + pAttack + '-hand.jpg"> </button><br>')
    winDiv.append(winButton);
    winDiv.append(winnerName);
    $("#gameResults").append(winDiv);
    // resultDiv.append(winDiv);

    // var winButton = ('<button type="button" class="btn btn-secondary btn-sm otherAttack"><img class="attackImage" src="assets/images/' + pAttack + '-hand.jpg"> </button>')
    // $("#gameResults").html('<button type="button" class="btn btn-secondary btn-sm otherAttack"><img class="attackImage" src="assets/images/' + pAttack + '-hand.jpg"> </button>')

    if (!playerPicked){
        var loseDiv = $("<div class='col-4 col-md-3'>")
        var loseButton = $('<button type="button" class="btn btn-secondary btn-sm otherAttack"><img class="attackImage" src="assets/images/' + oAttack + '-hand.jpg"> </button><br>')
        loseDiv.append(loseButton)
        loseDiv.append(loserName)
        // resultDiv.append(loseDiv);
        $("#gameResults").append(loseDiv);
    }

    let resultText = $("<div class='col-4 align-self-center'>");
    if (tie == "tie"){
        var win1 = $("<h4>").text("Its a Tie!");
    }else{
        var win1 = $("<h4>").text(winnerName + " Wins!")
    }
    resultText.append(win1)

    // resultDiv.append(resultText)

    $("#gameResults").append(resultText);
    $("#gameResults div").show().delay(3000).fadeOut(500);
    setTimeout(function(){
        $('.gameBtn').prop('disabled', false)
    }, 3550);
    // $("#gameResults div").show();
}

// update scores and write to page and local storage
function scoreKeeper(winner) {
    if (playerPicked) {
        if (winner === playerChar) {
            wins++
            localStorage.setItem("userWins", wins);
            $("#winCount").text(wins);
        }
        else if (winner === "tie") {
            ties++
            localStorage.setItem("userTies", ties);
            $("#tieCount").text(ties);

        } else {
            loss++
            localStorage.setItem("userLoss", loss);
            $("#lossCount").text(loss);
        }
        setStats();
    }
};


// chat functions
function chat(){
  $("#chatButton").click(function(event){
      event.preventDefault();
    //   console.log("click");
      let chatText = $("#chatInput").val()
    //   console.log(chatText);
      if (chatText != ""){
        chatDB.push({
            user: playerName,
            chatTextDB: chatText
          });
      }
      $("#chatInput").val("");
    })
};

// update chat box with chat text as it is send to the database
function chatUpdate(){
    chatDB.on("child_added", function(chat){
        // console.log(chat)
        let userName = chat.val().user;
        let chatT = chat.val().chatTextDB
        if (userName === playerName){
            var text = $("<p>").text(chatT);
            var message = $("<div>").append(text);
            message.addClass("myChat");
        }else{
            var text = $("<p>").html('<span class="chatName">' + userName + ': </span>' + chatT)
            var message = $("<div>").append(text);
            message.addClass("otherChat");
        }

        $("#chatArea").prepend(message);
    });
};

// on page load checks to see if you have a name and stats stored in local storage - if not it hides the game and asks for you to enter a name
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
        $("#overallGameBox").fadeIn(200)
        $("#userName").text(playerName);
        setStats();
    }else{
        $("#overallGameBox").hide();
        $("#playerNameBox").fadeIn(200);
    };


};

// writes you stats to the database so they can be displayed inthe watcher list
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
};

// updates player stats shown in the watchers drop down list
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


// document on ready - launches all these functions when page is done loading
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