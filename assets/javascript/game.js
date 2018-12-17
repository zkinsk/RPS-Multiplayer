
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

  var playerName = "testname";


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

chatDB.on("value", function(chatText){
    let userName = chatText.val().user;
    let chatT = chatText.val().chatTextDB
    // console.log(userName);
    // console.log(chatT);
    let message = $("<p>").text(userName + ": " + chatT)
    $("#chatArea").prepend(message);
});