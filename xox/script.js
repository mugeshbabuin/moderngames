$(document).ready(function(){
  doOnClick();
  });//end of doc.ready func

 //Variables
  var reset = true;
  var choice = "1 player";
  var player1 = "X";
  var player2 = "O";
  var turn = player1;
  var player1Name = "You";
  var player2Name = "Computer";
  var player1Color;
  var player2Color;
  var player1Score = 0;
  var player2Score = 0;
  var lastScore; 
  var turnMessage;
  var winingMessage; 
  var playerBoard = ["1a", "2a", "3a", 
                  "1b", "2b", "3b", 
                  "1c", "2c", "3c"];
  var emptyFields = ["1a", "2a", "3a", 
                  "1b", "2b", "3b", 
                  "1c", "2c", "3c"];
  var fieldName;
  var winingCombinations = [["1a","1b","1c"], ["2a","2b","2c"], ["3a","3b","3c"], ["1a","2b","3c"], ["1c","2b","3a"]];

  
  var $field = $("td").text();
  var $showWiningInfo = $(".message");
  var $showTurnInfo = $(".turn-info");
  var $audioWin = $("audio")[0]; 
  var $audioTie = $("audio")[1]; 
  var $audioSign = $("audio")[2]; 


 //On.click func
  function doOnClick(){
    $("#reset").on("click", function(){
      resetGame();
    });

    $(".choose-1").on("click", function(){
      $(".choose-game").css("display", "none");
      $(".choose-level").css("display", "block"); 
      choice = "1 player";
    });

    $(".choose-2").on("click", function(){
      $(".choose-game").css("display", "none");
      $(".players-names").css("display", "block"); 
      choice = "2 player";
    });

    $(".start-game").on("click", function(){
       startGame();
       $(".players-names").css("display", "none");
       $(".choose-level").css("display", "none");    
    });

    $(".choose-x").on("click", function(){
      player1 = "X";
      console.log("You picked 'X'!")
      $(".choose").css("display", "none");
      chooseSign();
      playAgain();
    });

    $(".choose-o").on("click", function(){
      player1 = "O";
      console.log("You picked 'O'!")
      $(".choose").css("display", "none");
      chooseSign();
      playAgain();
      if(player2Name === "Computer"){
         setTimeout(computerTurn, 500); 
      }
    });

    $("td").on("click", function(e){
      fieldName = $(this).attr("id");
      $audioSign.play();
      if($(this).hasClass("td-clicked")){
        $(this).preventDefault();
      }
      reset = false;

      if(player2Name !== "Computer"){
        if(turn === player1){
            if(playerTurn(player1)){
             return;
            }
         }else{
            if(playerTurn(player2)){
             return;
            }
        }
      }else{
         if(turn === player1){
           if(playerTurn(player1) || emptyFields.length === 0){    
            return;
           }else{
            setTimeout(computerTurn, 700); 
           }
         }
      }
    });
  }//end of doOnClick func
  
 //Set players names and call x/o question
  function startGame(){
    if(choice ==="2 player"){
     player1Name = $("input#player1name").val();
     player2Name = $("input#player2name").val();
     if(!player1Name){
       player1Name = "Player 1";
     }
     if(!player2Name){
       player2Name = "Player 2";
     }     
    } //play with other player
  
    else{
      player1Name = "You";
      player2Name = "Computer";      
    } //play with computer 
    return chooseSign();
  } //end of startGame

 //Display and set signs and whose turn is first (always player with 'X' sign)
  function chooseSign(){
  $(".choose-sign").css("display", "block");
    if(player1Name === "You"){
      $(".choose-sign p").html(player1Name + " " + "pick first");
    }else{
      $(".choose-sign p").html(player1Name + " " + "picks first");
    }
     
    if(player1 === "X"){
       player2 = "O";  
       turn = player1;
    }else{
       player2 = "X";
       turn = player2;
    }  
  }//end of chooseSign func
  
 //Display playerBoard, score and whose turn is at the begining of the game
  function playAgain(){  
    $(".fields, .scores").css("display", "block")
    $("td").html("");
    $(".message").css("display", "none").html("");
    emptyFields = ["1a", "2a", "3a", 
                 "1b", "2b", "3b", 
                 "1c", "2c", "3c"];
    playerBoard = ["1a", "2a", "3a", 
                  "1b", "2b", "3b", 
                  "1c", "2c", "3c"];
    
    $("td").css("color", "#333333");
    $("td").removeClass("td-clicked");
    $("td").removeClass("td-winning-color").removeClass("animated pulse");
    scoreInfo();
        
    // player who won score in last game goes first in next game, or
    //If after game is drawn, player who won score in previous game goes first again, or
    //If after first game is drawn, player who went first at the begining goes first again 
    if(lastScore === player2 || 
       winingMessage === "It's Tie!" && lastScore === player2 ||
       !lastScore && winingMessage == "It's Tie!" && turn === player2){
      
       if(player2Name === "Computer"){
         updateTurn(player1);
         return setTimeout(computerTurn, 500);
       }else{
         return updateTurn(player1);
       }
    }else if(lastScore === player1 || 
             winingMessage === "It's Tie!" && lastScore === player1 || 
             !lastScore && winingMessage == "It's Tie!" && turn === player1){
        return updateTurn(player2);
    }else{
        return updateTurn(turn);
      }
  } //end of playAgain func
  
 //Define players (players 1 and players2!=computer) moves, check if there is wining combination and update whose turn is, return new playerboard
  function playerTurn(player){
     if(emptyFields.includes(fieldName)){
        emptyFields.splice(emptyFields.indexOf(fieldName),1); 
        playerBoard[playerBoard.indexOf(fieldName)] = player;
       
       $("#" + fieldName).addClass("td-clicked").html(player);

       if(player === "X"){
         $("#" + fieldName).css("color", "red");
       }

       if(checkResult(player)){
          winInfo();
          setTimeout(playAgain, 1500);
          return true;
        }
        if(emptyFields.length === 0 && !checkResult(player)){
          winInfo();
          setTimeout(playAgain, 1500);
          return;
        }
       
       updateTurn(player);
     }  
  } //end of playerTurn func
  
 //Define computer moves, check if there is wining combination and update whose turn is, return new playerboard
  function computerTurn(){
     reset = false;
     
     if($('input[id=easy]:checked').val()){
       fieldName = aiMove();
     }   
     if($('input[id=hard]:checked').val()){
       fieldName = aiPredictBestMove();
     } 
    $audioSign.play();
    
     emptyFields.splice(emptyFields.indexOf(fieldName),1);
     playerBoard[playerBoard.indexOf(fieldName)] = player2;
     $("#" + fieldName).addClass("td-clicked").html(player2);
     if(player2 === "X"){
       $("#" + fieldName).css("color", "red");
     }

     if(checkResult(player2) || emptyFields.length === 0 && !checkResult(player2)){
          winInfo();
          setTimeout(playAgain, 1500);
          return;
      }
    
      updateTurn(player2);        
    } // end of computerTurn

 //Checking for wining combination and update winingMessage 
  function checkResult(player){
   
   if($("#1a").text() === player && $("#2a").text() === player && $("#3a").text() === player){
     $("#1a, #2a, #3a").addClass('td-winning-color').addClass("animated pulse");
     return winnerUpdate(player);
   }
   else if($("#1b").text() === player && $("#2b").text() === player && $("#3b").text() === player){
     $("#1b, #2b, #3b").addClass('td-winning-color').addClass("animated pulse");
      return winnerUpdate(player);
   }
   else if($("#1c").text() === player && $("#2c").text() === player && $("#3c").text() === player){
     $("#1c, #2c, #3c").addClass('td-winning-color').addClass("animated pulse");
     return winnerUpdate(player);
   }
   else if($("#1a").text() === player && $("#2b").text() === player && $("#3c").text() === player){
     $("#1a, #2b, #3c").addClass('td-winning-color').addClass("animated pulse");
     return winnerUpdate(player);
   }
   else if($("#3a").text() === player && $("#2b").text() === player && $("#1c").text() === player){
     $("#3a, #2b, #1c").addClass('td-winning-color').addClass("animated pulse");
     return winnerUpdate(player);
   }
   else if($("#1a").text() === player && $("#1b").text() === player && $("#1c").text() === player){
     $("#1a, #1b, #1c").addClass('td-winning-color').addClass("animated pulse");
     return winnerUpdate(player);
   }
   else if($("#2a").text() === player && $("#2b").text() === player && $("#2c").text() === player){
     $("#2a, #2b, #2c").addClass('td-winning-color').addClass("animated pulse");
     return winnerUpdate(player);
   }
   else if($("#3a").text() === player && $("#3b").text() === player && $("#3c").text() === player){
     $("#3a, #3b, #3c").addClass('td-winning-color').addClass("animated pulse");
     return winnerUpdate(player);
   }else{
      winingMessage = "It's Tie!";
      return false;
      }
     
  }//end of checkResult
  
 //Update and display/show turn message  
  function updateTurn(player){

    //at the very begining of the game or after reset show who goes first func playAgain() call it
     if(reset){
     if(player === player2){
          turnMessage = player2Name + " goes first !";
       turnInfo();
       return;
       }

     if(player === player1){
        if(player1Name === "You"){
          turnMessage = player1Name + " go first !";
        }else{
          turnMessage = player1Name + " goes first !"
        }   
       }
       turnInfo();
       return;
     }
     
    //Set next player turn alternately and show whose turn is
     if(player === player1){
          turn = player2;
          turnMessage = "It's " + player2Name + "'s turn !";
       }
     
     if(player === player2){
          turn = player1;
        if(player1Name === "You"){
          turnMessage = "It's " + player1Name + "r turn !";
        }else{
          turnMessage = "It's " + player1Name + "'s turn !";
        }   
       }
     return turnInfo();
   } //end of updateTurn func
  
 //Define wining message and update scores
  function winnerUpdate(player){
     lastScore = player;
     
    if(player === player1){
      winingMessage = player1Name + " " + "Won!";
      player1Score++;
    }
      if(player === player2){
      winingMessage = player2Name + " " + "Won!";
      player2Score++;
    }     
      scoreInfo();
     
      return winingMessage; 
}// end of winnerUpdate func
   
 //Show updated current scores
  function scoreInfo(){
      $( ".scores p" ).html(player1Score + " : " + player2Score);
      $(".player2-score").html(player2Name + "'s score: " + player2Score);
      $(".player1-score").html(player1Name + "'s score: " + player1Score);
    
    if(player1Name === "You"){
      $(".player1-score").html(player1Name + "r score: " + player1Score);
    }
  } //end of scoreInfo func
  
 //Show updated winner message
  function winInfo(){
      $showWiningInfo.css("display", "block").html("<p>" + winingMessage + "</p>");
    if(winingMessage === "It's Tie!"){
       $audioTie.play();
       }else{
       $audioWin.play();
       }
      $showTurnInfo.css("display", "none");   
  } //end of winInfo func
  
 //Show updated turn message
  function turnInfo(){
    $showTurnInfo.css("display", "block").html(turnMessage);
  } //end of turnInfo func
  
 //Reset all value and retur on very begining
  function resetGame(){

    reset = true;
    player1Score = 0;
    player2Score = 0;
    lastScore= "";
    emptyFields = ["1a", "2a", "3a", 
                 "1b", "2b", "3b", 
                 "1c", "2c", "3c"];
    playerBoard = ["1a", "2a", "3a", 
                  "1b", "2b", "3b", 
                  "1c", "2c", "3c"];
    winingMessage = "";
    turnMessage = "";
    player1Name = "You";
    player2Name = "Computer";
    $("input#player1name").val("");
    $("input#player2name").val("");
    
    $('.btn-group :radio').prop('checked', false);

    $("td").removeClass("td-winning-color");
    $("td").removeClass("td-clicked");  
    $(".choose,  .choose-game").css("display", "block");
    $(".fields, .scores, .turn-info, .message, .choose-sign, .choose-level, .players-names ").css("display", "none");
  } //end of resetGame func
  
 //AI Predict and define computer moves

 //AI checking for wining combination
  function aiCheckWinner(player, board){  
       if ((board[0] == player && board[1] == player && board[2] == player) ||
           (board[3] == player && board[4] == player && board[5] == player) ||
           (board[6] == player && board[7] == player && board[8] == player) ||
           (board[0] == player && board[3] == player && board[6] == player) ||
           (board[1] == player && board[4] == player && board[7] == player) ||
           (board[2] == player && board[5] == player && board[8] == player) ||
           (board[0] == player && board[4] == player && board[8] == player) ||
           (board[2] == player && board[4] == player && board[6] == player)){
              return true;   
           }  
    } //end of aiCheckScor func

 //1. AI Predict and define computer;s moves - level Easy
  function aiMove(){
     var fakeEmptyFields = emptyFields.slice();
     var fakeBoard = playerBoard.slice();
     var possibleMoveAI;
      
    //Check if AI can win the game
     function aiWin(){
        for(var i = 0;  i < emptyFields.length; i++){
          possibleMoveAI = emptyFields[i];
          fakeBoard = playerBoard.slice();
          fakeBoard[playerBoard.indexOf(possibleMoveAI)] = player2;
          if(aiCheckWinner(player2, fakeBoard)){
             return possibleMoveAI;
          }else{
             possibleMoveAI = false;
            }
          }//end of for loop
        }//end of aiWin func
      
    //Check if AI can block the player
     function aiBlock(){
        for(var i = 0;  i < emptyFields.length; i++){
         var  possibleMoveHuman = emptyFields[i];
          fakeBoard = playerBoard.slice();
          fakeBoard[playerBoard.indexOf(possibleMoveHuman)] = player1;
          if(aiCheckWinner(player1, fakeBoard)){
             possibleMoveAI = possibleMoveHuman;
             return possibleMoveHuman;
          }else{
             possibleMoveAI = false;
            }
          }//end of for loop
        }//end of aiBlock func

    if(aiWin()){
      return possibleMoveAI;
    }else if(aiBlock()){
      return possibleMoveAI;
    }else{
      possibleMoveAI = emptyFields[Math.floor(Math.random()*emptyFields.length)];
      return possibleMoveAI;
     }     
  } //end of aiMove func

 //2. AI Predict and define computer's moves - level Hard 
  function aiPredictBestMove(){
    var fc = 0;
     //create board for manipulating and replace empty spaces with index numbers
    var fakeBoard = playerBoard.slice(); 
      for(var i = 0; i < fakeBoard.length; i++){
        if(fakeBoard[i] !== "X" && fakeBoard[i] !== "O"){
          fakeBoard[i] = i;
        }
      }
    var aiPlayer = player2;
    var huPlayer = player1;
    
    //Define empty spaces/indexes in New board arr
    function getEmptyIndexies(board){
      return board.filter(s => s!=="X" && s!=="O");
    }//end of getEmptyIndexie func


    // The main minimax function
    function minimax(newBoard, player){
      //add one to function calls
      fc++;
      //available spots
      var availSpots = getEmptyIndexies(newBoard);

      // checks for the terminal states such as win, lose, and tie 
      //and returning a value accordingly

       if(aiCheckWinner(huPlayer, newBoard)){
          return {score: -10};
        }else if(aiCheckWinner(aiPlayer, newBoard)){
          return {score: 10};
        }else if(availSpots.length === 0){
          return {score: 0};
        }

      // an array to collect all the objects
      var moves = [];

      // loop through available spots
      for (var i = 0; i < availSpots.length; i++){
        //create an object for each and store the index of that spot 
        var move = {};
        move.index = newBoard[availSpots[i]];

        // set the empty spot to the current player
        newBoard[availSpots[i]] = player;

        /*collect the score resulted from calling minimax 
          on the opponent of the current player*/
        if (player == aiPlayer){
          var result = minimax(newBoard, huPlayer);
          move.score = result.score;
        }else{
          var result = minimax(newBoard, aiPlayer);
          move.score = result.score;
        }

        // reset the spot to empty
        newBoard[availSpots[i]] = move.index;

        // push the object to the array
        moves.push(move);
      }

      // if it is the computer's turn loop over the moves and choose the move with the highest score
      var bestMove;
      if(player === aiPlayer){
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++){
          if(moves[i].score > bestScore){
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }else{

     // else loop over the moves and choose the move with the lowest score
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++){
          if(moves[i].score < bestScore){
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }

    // return the chosen move (object) from the moves array
      return moves[bestMove];
    }//end of minimax func

      var bestSpot = minimax(fakeBoard, aiPlayer)
      return playerBoard[bestSpot.index];
  }//end of aiPredictBestMove func;