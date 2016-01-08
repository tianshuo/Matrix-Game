+function (w){
  var cloneArray=function(arr){
    return arr.map(function(num){
      return num;
    });
  };
  var count=0;
  var newNode=function(board){
    return new MatrixGame({
      board:cloneArray(board.board),
      pieces:cloneArray(board.pieces)
    });
  }

  var transTable=function(){
    this.hash={};
    var makeHash=function(){

    };
    this.check=function(){
      var hash=makeHash(board);
      if(this.hash[hash]){
        return true;
      }else{
        this.hash[hash]=true;
        return false;
      }
    };
  };

  var alphabeta=function(node,depth,alpha,beta,player,isMax){
    var v,best;
    var moves=node.legalMoves();
    var nums=node.remaining();
    // console.log(node.toString());
    // console.log(node.remaining(),depth);
    var stars=new Array(node.pieces.length-node.remaining().length).join(">");
    count++;
    // console.log(stars+node.lastMove+" "+isMax);

    if(node.gameOver()){
      v=(player==1)?node.playerOneScore()-node.playerTwoScore():
        node.playerTwoScore()-node.playerOneScore();
      node.v=v;
      // console.log("v=%d",v);
      return [v,node.lastMove];
    }
    if(depth==0){
      throw "No Heuristic Algorithm yet!";
    }

    // Let's use some symmetry to cut down time
    if(moves==node.board.length){
      moves=[Math.round(node.board.length/2)];
    }else if(moves==node.board.length-1&&!node.board[4]){
      //FIXME UGLYHACK
      moves=[0,1,3];
    }

    if(isMax){
      v=-Infinity;
      outerloop:
      for(var i=0;i<moves.length;i++){
        for(var j=0;j<nums.length;j++){
          var child=newNode(node);
          child.placeMove(nums[j],moves[i]);
          child.lastMove=[nums[j],moves[i]];
          var childv=alphabeta(child,depth-1,alpha,beta,player,false);
          if(childv[0]>v){ //MAX
            v=childv[0];
            best=[nums[j],moves[i]];
          }
          alpha=Math.max(alpha,v);
          if(beta<=alpha){ //Beta Cut-off
            break outerloop;
          }
        }
      }
      // console.assert(best,"No best");
      node.best=best;
      node.v=v;
      // console.log( [v,node.best,count,"max"]);
      return [v,node.best];
    }else{
      v=Infinity;
      outerloop:
      for(var i=0;i<moves.length;i++){
        for(var j=0;j<nums.length;j++){
          var child=newNode(node);
          child.placeMove(nums[j],moves[i]);
          child.lastMove=[nums[j],moves[i]];
          var childv=alphabeta(child,depth-1,alpha,beta,player,true);
          if(childv[0]<v){ //MIN
            v=childv[0];
            best=[nums[j],moves[i]];
          }
          beta=Math.min(beta,v);
          if(beta<=alpha){ //Alpha Cut-off
            break outerloop;
          }
        }
      }
      node.best=best;
      node.v=v;
      // console.log( [v,node.best,count,"min"]);
      return [v,node.best];
    }
  };
  w.AlphaBeta= alphabeta;
}(window)
