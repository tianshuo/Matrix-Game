Vue.config.debug = true;  // Enable Vue Debug mode
var console=console||({ //IE Proof
  log:function(){},
  assert:function(){}
});

var MatrixGame=function(options){
  this.board=options.board;
  this.pieces=options.pieces;
  if([4,9,16].indexOf(this.board.length)<0||this.pieces.length<this.board.length) throw TypeError("Wrong Arguments for game");
}

MatrixGame.prototype.legalMoves= function(){
  return this.board.reduce(function(accu,iter,i){
      if(iter==null){
        accu.push(i);
      }
      return accu;
  },[]);
};

MatrixGame.prototype.remaining=function(){
  var self=this;
  return self.pieces.filter(function(num){
      return self.board.indexOf(num)<0;
  });
};

MatrixGame.prototype.toString=function(){
  throw "error";
  console.log("%d %d %d",this.board[0],this.board[1],this.board[2]);
  console.log("%d %d %d",this.board[3],this.board[4],this.board[5]);
  console.log("%d %d %d",this.board[6],this.board[7],this.board[8]);
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
  // this.board=this.board.map(function(){
  //   return null;
  // });
  for(var i=0;i<this.board.length;i++){
    this.board.$set(i,null);
  }
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
  switch(this.board.length){
    case 4:return [
      _prod([0,1],this.board),
      _prod([2,3],this.board)
    ];break;
    case 9:return [
      _prod([0,1,2],this.board),
      _prod([3,4,5],this.board),
      _prod([6,7,8],this.board)
    ];break;
    case 16:return [
      _prod([0,1,2,3],this.board),
      _prod([4,5,6,7],this.board),
      _prod([8,9,10,11],this.board),
      _prod([12,13,14,15],this.board)
    ];break;
  }
  throw "error";
};

MatrixGame.prototype.playerOneScore=function(){
  var details=MatrixGame.prototype.playerOneScoreDetails.call(this);
  return details.reduce(function(accu,iter){
    return accu+iter;
  },0);
};

MatrixGame.prototype.playerTwoScoreDetails=function(){
  switch(this.board.length){
    case 4:return [
      _prod([0,2],this.board),
      _prod([1,3],this.board)
    ];break;
    case 9:return [
      _prod([0,3,6],this.board),
      _prod([1,4,7],this.board),
      _prod([2,5,8],this.board)
    ];break;
    case 16:return [
      _prod([0,4,8,12],this.board),
      _prod([1,5,9,13],this.board),
      _prod([2,6,10,14],this.board),
      _prod([3,7,11,15],this.board)
    ];break;
  }
};

MatrixGame.prototype.playerTwoScore=function(){
  var details=MatrixGame.prototype.playerTwoScoreDetails.call(this);
  return details.reduce(function(accu,iter){
    return accu+iter;
  },0);
};

MatrixGame.prototype.placeMove=function(num,pos,vue){
  if(this.pieces.indexOf(num)<0){
    throw TypeError("Wrong Number");
  }
  if(MatrixGame.prototype.legalMoves.call(this).indexOf(pos)<0){
    throw TypeError("Wrong Position");
  }
  if(vue){ // For Vue refresh
    this.board.$set(pos,num);
  }else{
    this.board[pos]=num;
  }
  return this;
};

// Creates New Game
var NewGame=new MatrixGame({
  pieces:[1,2,3,4,5,6,7,8,9],
  board:[null,null,null,null,null,null,null,null,null]
});

// var NewGame=new MatrixGame({
//   pieces:[1,2,3,4],
//   board:[null,null,null,null]
// });

var game=new Vue({
    el: ".container",
    data: {
        game:NewGame,
        pieces:NewGame.pieces,
        board:NewGame.board,
        selected:null
    },
    computed: {
        remaining:NewGame.remaining,
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
              this.game.placeMove(this.selected,pos,true);
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
        restartGame:NewGame.restartGame.bind(NewGame),
        getAI:function(){
            var v=AlphaBeta(this.game,10,-Infinity,Infinity,this.game.presentMove,true);
            console.log(v);
            this.game.placeMove(v[1][0],v[1][1],true);

        }
    }

});
