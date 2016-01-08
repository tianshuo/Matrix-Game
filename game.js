Vue.config.debug = true;  // Enable Vue Debug mode
var console=console||({ //IE Proof
  log:function(){}
});

var MatrixGame=function(options){
  this.board=options.board;
  this.pieces=options.pieces;
  if(this.board.length!=9||this.pieces.length<9) throw TypeError("Wrong Arguments for game");
}

MatrixGame.prototype.legalMoves= function(){
  return this.board.reduce(function(accu,iter,i){
      if(iter==null){
        accu.push(i);
      }
      return accu;
  },[]);
};

MatrixGame.prototype.gameOver=function(){
  return this.board.indexOf(null)<0;
};

MatrixGame.prototype.presentMove=function(){
  return this.board.reduce(function(accu,iter,i){
      if(iter!=null){
        accu=3-accu;
      }
      return accu;
  },1);
};

MatrixGame.prototype.restartGame=function(){
  this.board=this.board.map(function(){
    return null;
  });
};

// Function to calculate products on array
var _prod=function(posArr,mainArray){
  return posArr.reduce(function(accu,iter){
    var num=mainArray[iter];
    if(num){
        return accu?accu*num:num;
    }else{
        return accu;
    }
  },0);
};

MatrixGame.prototype.playerOneScoreDetails=function(){
  return [
    _prod([0,1,2],this.board),
    _prod([3,4,5],this.board),
    _prod([6,7,8],this.board)
  ];
};

MatrixGame.prototype.playerOneScore=function(){
  var details=MatrixGame.prototype.playerOneScoreDetails.call(this);
  return details.reduce(function(accu,iter){
    return accu+iter;
  },0);
};

MatrixGame.prototype.playerTwoScoreDetails=function(){
  return [
    _prod([0,3,6],this.board),
    _prod([1,4,7],this.board),
    _prod([2,5,8],this.board)
  ];
};

MatrixGame.prototype.playerTwoScore=function(){
  var details=MatrixGame.prototype.playerTwoScoreDetails.call(this);
  return details.reduce(function(accu,iter){
    return accu+iter;
  },0);
};

MatrixGame.prototype.placeMove=function(num,pos){
  if(this.pieces.indexOf(num)<0){
    throw TypeError("Wrong Number");
  }
  if(MatrixGame.prototype.legalMoves.call(this).indexOf(pos)<0){
    throw TypeError("Wrong Position");
  }
  if(this.board.$set){ // For Vue refresh
    this.board.$set(pos,num);
  }else{
    this.board[pos]=num;
  }
};

// Creates New Game
var NewGame=new MatrixGame({
  pieces:[1,2,3,4,5,6,7,8,9],
  board:[null,null,null,null,null,null,null,null,null]
});

var game=new Vue({
    el: ".container",
    data: {
        game:NewGame,
        pieces:NewGame.pieces,
        board:NewGame.board,
        selected:null
    },
    computed: {
        remaining: function () {
            var self=this;
            return self.pieces.filter(function(num){
                return self.board.indexOf(num)<0;
            });
        },
        gameOver:NewGame.gameOver,
        presentMove:NewGame.presentMove,
        playerOneScore:NewGame.playerOneScore,
        playerOneScoreDetails:NewGame.playerOneScoreDetails,
        playerTwoScore:NewGame.playerTwoScore,
        playerTwoScoreDetails:NewGame.playerTwoScoreDetails
    },
    methods: {
        put:function(pos){
            try{
              this.game.placeMove(this.selected,pos);
              this.selected=null;
            }catch(e){
              console.log(e);
            }
        },
        select:function(num){
            if(this.remaining.indexOf(num)>=0){
                this.selected=num;
            }
        },
        restartGame:NewGame.restartGame
    }

});
