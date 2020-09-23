var stName = ''
var stId = ''
var playerNum = '2'
var action = ''
var boastAction = ''
//var placedStones = 0
var swapMvmt = 1
var swapValues = {'id':'','name':'','face':'','bi':''}
var peekAmnt = 0
var peekedId = ''
var onGoingChallenge = 0
var challengeStoneId = ''
var playerCanPeek3 = 0
var whichPlayerCanP3 = 0
var boastPoints = 0
var boastPointsNeeded = 0

var player1Points = 0
var player2Points = 0
//var bgImg = ''

/*----------First step, a random stone is put in the center of the line----------*/
window.onload = firstStone;

function firstStone () {
  stoneId = Math.floor(Math.random() * 7) + 1;
  moveStone('ps-'+stoneId, 'ls-4');
  placedStones = 1;
  openOverlayMenu('player-actions-container');
}

function moveStone(fromPos, toPos){
  fromStone = $('#'+fromPos);
  toStone = $('#'+toPos);

  fromName = fromStone.attr('name');

  toStone.css({'background':'center',
               'background-size':'cover',
               'background-image':'url("./source/ps-'+fromName+'.png")'});

  toStone.attr('name',fromName);
  toStone.attr('used','1');

  //if(fromStone.attr('facedown') == '1'){toStone.attr('facedown','1')}

  fromStone.attr('used','1');
  fromStone.css({'background-image':"url('')"});
}

function openOverlayMenu(targetMenu){
  if(targetMenu=='player-actions-container'){  
    if (playerNum=='2') {
      playerNum='1'; playerColor='blue';
    } else {
      playerNum='2'; playerColor='red';
    }
      
    $('#player-number').text('Player '+playerNum);
    $('#player-number').css('color',playerColor);
    $('.player-actions').append('<style>.player-actions:hover{background-color: '+playerColor+';}</style>');
  }
  else if(targetMenu=='boast-actions-container'){
    if (playerNum=='1') {
      oPlayerNum='2'; playerColor='blue'; oPlayerColor='red';
    } else {
      oPlayerNum='1'; playerColor='red'; oPlayerColor='blue';
    }
    $('#boast-player').css('color',playerColor);
    $('#opposite-boast-player').text('Player '+oPlayerNum);
    $('#opposite-boast-player').css('color',oPlayerColor);
    $('.boast-actions').append('<style>.boast-actions:hover{background-color: '+oPlayerColor+';}</style>');
  }

  $('#'+targetMenu).css('display','block');
  $('.overlay-menu').css('display','block');
}

function closeOverlayMenu(){
  $('#player-actions-container').css('display','none'); 
  $('#boast-actions-container').css('display','none'); 
  $('.overlay-menu').css('display','none'); 
}

function nextTurnBtn(status){
  button = $('#next-turn-button');
  if(status==0){
    button.attr('active','0');
    button.css({'color': 'gray', 'cursor': 'not-allowed', 'background-color':'white'});
  }
  else if(status==1){
    if (action!='Peek'){action = '';}
    if (playerNum == '1'){pColor='red'}else{pColor='blue'}
    button.attr('active','1');
    button.css({'color': 'white', 'cursor': 'pointer', 'background-color':pColor}); 
  }
}

function validateActions(){
  faceDownStonesAmt = 0;
  faceUpStonesAmt = 0;
  totalStonesAmt = 0;

  $('.line-stone').each(function(){
    if($(this).attr('facedown')==1){faceDownStonesAmt ++}
    if($(this).attr('facedown')==0 && $(this).attr('name')!=''){faceUpStonesAmt ++}
    if($(this).attr('name')!=''){totalStonesAmt ++}
  })

  //console.log('Total: '+totalStonesAmt+', FD: '+faceDownStonesAmt+', FU:'+faceUpStonesAmt);
  if(totalStonesAmt == 2){
    $('#pa-swap').removeClass('pa-disable');
    $('#pa-swap').attr('active','1');
  }
  else if(totalStonesAmt == 7){
    $('#pa-place').addClass('pa-disable');
    $('#pa-place').attr('active','0');
  }

  if(faceUpStonesAmt > 0){
    $('#pa-hide').removeClass('pa-disable');
    $('#pa-hide').attr('active','1');
  } else {
    $('#pa-hide').addClass('pa-disable');
    $('#pa-hide').attr('active','0');
  }

  if(faceDownStonesAmt > 0){
    $('#pa-peek').removeClass('pa-disable');
    $('#pa-peek').attr('active','1');  
    $('#pa-challenge').removeClass('pa-disable');
    $('#pa-challenge').attr('active','1');
    $('#pa-boast').removeClass('pa-disable');
    $('#pa-boast').attr('active','1');
  } else {
    $('#pa-peek').addClass('pa-disable');
    $('#pa-peek').attr('active','0');  
    $('#pa-challenge').addClass('pa-disable');
    $('#pa-challenge').attr('active','0');
    $('#pa-boast').addClass('pa-disable');
    $('#pa-boast').attr('active','0');
  }
}

$('#next-turn-button').click(function(e){
  if($(this).attr('active')==1){
    $('.shout-text').css({'display':'none'});
    validateActions();
    openOverlayMenu('player-actions-container');

    peekAmnt = 0; peekedId = '';
    if(playerCanPeek3 != 0){
      playerCanPeek3 --;
    } else {
      whichPlayerCanP3 = 0;
    }
  }
})

$('#end-game-button').click(function(e){
  location.reload();
})

function displayText(textID,status){
  text = $('#'+textID);

  if(textID=='challenge-text'){
    if (playerNum == '1'){pColor='blue';oColor='red'}else{pColor='red';oColor='blue'}
  
    if(status==1){
      text.css({'display':'block', 'background-color':pColor});  
      text.children('b').css('color',oColor);
    }
    else{
      text.css({'display':'none'});  
    }  
  }
  else{
    if(status==1){
      text.css({'display':'block'});
    }
    else{
      text.css({'display':'none'});
    }
  }

}
/*--------------------------------------------------------------------------------*/

/*----------SELECT PLAYER ACTIONS----------*/
$('.player-actions').click(function(e){
  if($(this).attr('active')=='1'){
    action = $(this).attr('value');
    console.log(action);
    nextTurnBtn(0);
    closeOverlayMenu();
  }
})

$('#pa-boast').click(function(e){
  openOverlayMenu('boast-actions-container');
})

$('.boast-actions').click(function(e){
  boastAction = $(this).attr('value');
  closeOverlayMenu();

  console.log('Turn of p'+playerNum+' with '+boastAction);

  if(boastAction=='believe'){
    getAPoint(playerNum);
    nextTurnBtn(1); 
  }
  else{ 
    $('.line-stone').each(function(){
      if($(this).attr('facedown')==1){boastPointsNeeded ++}
    })
    console.log('Poinst needed: '+boastPointsNeeded);
  }
})
/*-----------------------------------------*/

/*----------EXCECUTE ACTIONS----------*/
$('.pool-stone').click(function(e){
  if($(this).attr('used') == '0'){
    stName = $(this).attr('name');
    //bgImg = $(this).css('background-image');
    stId = $(this).attr('id');
  }
})

$('.line-stone').click(function(e){
  thisLinePos = parseInt($(this).attr('id').substr(-1));

  if(action=='Place'){
    if(stName!=''){
      if($(this).attr('used')=='0'){
        console.log(thisLinePos);
        leftLineId = '#ls-'+(thisLinePos-1);
        rightLineId = '#ls-'+(thisLinePos+1);

        if($(leftLineId).attr('used') == '1' || $(rightLineId).attr('used') == '1'){
          moveStone(stId, $(this).attr('id'));
          /*placedStones ++;
          if(placedStones==2){
            $('#pa-swap').removeClass('pa-disable');
            $('#pa-swap').attr('active','1');
          }
          if(placedStones==7){
            $('#pa-place').addClass('pa-disable');
            $('#pa-place').attr('active','0');
          }*/
          nextTurnBtn(1);
        }
        else(
          alert('You can only place a stone aside other stone')
        )

        stName = '';
        stId = '';  
      }
      else{
        alert('You can only place a stone onto an empty spot')
      } 
    }
    else {
      alert('First select an avalaible stone into the pool')
    }  
  }
  else if(action =='Hide'){
    if($(this).attr('facedown')=='0'){
      $(this).css({'background-image':'url("./source/ps-back.png")'});
      $(this).attr('facedown','1');
      nextTurnBtn(1);

      /*$('#pa-peek').removeClass('pa-disable');
      $('#pa-peek').attr('active','1');  
      $('#pa-challenge').removeClass('pa-disable');
      $('#pa-challenge').attr('active','1');
      $('#pa-boast').removeClass('pa-disable');
      $('#pa-boast').attr('active','1');*/
    }
    else{
      alert('You must select a face-up stone to hide');
    }
  }
  else if(action =='Swap'){
    if($(this).attr('used') == '1')
      if(swapMvmt==1){
        swapValues['id'] = $(this).attr('id');
        swapValues['name'] = $(this).attr('name');
        swapValues['face'] = $(this).attr('facedown');
        swapValues['bi'] = $(this).css('background-image');
        swapMvmt=2;
      }
      else{
        if($(this).attr('id')!=swapValues['id']){
          $('#'+ swapValues['id']).attr('name',$(this).attr('name'));
          $('#'+ swapValues['id']).attr('facedown',$(this).attr('facedown'));
          $('#'+ swapValues['id']).css('background-image',$(this).css('background-image'));

          $(this).attr('name',swapValues['name'])
          $(this).attr('facedown',swapValues['face'])
          $(this).css('background-image',swapValues['bi'])

          swapValues = {'id':'','name':'','face':'','bi':''} ;
          swapMvmt=1;
          nextTurnBtn(1);  
        }
        else{
          alert('You must select a different stone to swap')
        }
      }
    else {
      alert('You must select a stone to swap')
    }
  }
  else if(action =='Peek'){
    
    if($(this).attr('facedown')=='1' && $(this).attr('used')=='1'){

      if ($(this).attr('id') != peekedId){
        peekAmnt++;
        if((playerNum != whichPlayerCanP3 && peekAmnt <= 1) || (playerNum==whichPlayerCanP3 && peekAmnt <= 3)){
          $(this).css({'background-image':'url("./source/ps-'+$(this).attr('name')+'.png")'});
          $(this).attr('facedown','0'); 

          peekedId=$(this).attr('id');
          nextTurnBtn(1);  
        }
        else{
          if(playerNum!=whichPlayerCanP3){
            alert('You can peek just one stone')  
          }else{
            alert('You can peek just three stone')  
          }
          
        }
      }
      else{
        $(this).css({'background-image':'url("./source/ps-'+$(this).attr('name')+'.png")'});
        $(this).attr('facedown','0'); 
      }
    }
    else{
      alert('You must select a facedown stone to peek')
    }  
  }
  else if(action =='Challenge'){
    if(onGoingChallenge==0){
      if($(this).attr('facedown')=='1' && $(this).attr('used')=='1'){
        onGoingChallenge = 1;
        challengeStoneId = $(this).attr('id');
        $('#select-stone-menu').css({'display':'block','left':e.clientX-226,'top':e.clientY+25});
        displayText('challenge-text',1);
      }
      else{
        alert('You must select a facedown stone to challenge')
      }  
    }
    else{
      alert('You already choose a stone to challenge')
    }
  }
  else if(action=='Boast'){
    if(boastAction=='dontBelieve' || boastAction=='dontCare'){
      if(onGoingChallenge==0){
        if($(this).attr('facedown')=='1' && $(this).attr('used')=='1'){
          onGoingChallenge = 1;
          challengeStoneId = $(this).attr('id');
          $('#select-stone-menu').css({'display':'block','left':e.clientX-226,'top':e.clientY+25});
        }
        else{
          alert('You must select a facedown stone to boast')
        } 
      }
      else{
        alert('You already choose a stone to boast')
      }
    }
  }
})

$('.line-stone').mouseout(function(e){
  //console.log($(this).attr('id')+' - '+peekedId)
  if($(this).attr('facedown')=='0' && $(this).attr('used')=='1' && action=='Peek' && $(this).attr('id') == peekedId){
    $(this).css({'background-image':'url("./source/ps-back.png")'});
    $(this).attr('facedown','1');
  }
})

$('.select-menu-stones').click(function(e){
  if(action=='Challenge'){
    challengeStone = $('#'+challengeStoneId);

    //console.log(challengeStoneId+'='+$(this).attr('name'))
    challengeStone.css({'background-image':'url("./source/ps-'+challengeStone.attr('name')+'.png")'});
    challengeStone.attr('facedown','0');
    
    if($(this).attr('name') == challengeStone.attr('name')){
      if (playerNum == 1){winner=2}else{winner=1}
      displayText('challenge-text',0);
      displayText('player-'+winner+'-point',1);
      getAPoint(winner);
    }
    else{
      displayText('challenge-text',0);
      displayText('player-'+playerNum+'-point',1);
      getAPoint(playerNum);
    }

    challengeStoneId ='';
    onGoingChallenge =0;
    $('#select-stone-menu').css({'display':'none'});
    nextTurnBtn(1); 
  }
  else if(action=='Boast'){
    challengeStone = $('#'+challengeStoneId);

    //console.log(challengeStoneId+'='+$(this).attr('name'))
    challengeStone.css({'background-image':'url("./source/ps-'+challengeStone.attr('name')+'.png")'});
    challengeStone.attr('facedown','0');

    if($(this).attr('name') == challengeStone.attr('name')){
      boastPoints ++;

      if(boastPoints == boastPointsNeeded){
        if (boastAction=='dontBelieve'){
          winner=playerNum
        }else if(boastAction=='dontCare'){
          if (playerNum == 1){winner=2}else{winner=1}
        }

        getAPoint(winner);
        getAPoint(winner);
        getAPoint(winner);
      }
    }
    else{
      if (boastAction=='dontBelieve'){
        if (playerNum == 1){winner=2}else{winner=1}
      }else if(boastAction=='dontCare'){
        winner=playerNum
      }

      getAPoint(winner);
      getAPoint(winner);
      getAPoint(winner);
    }

    challengeStoneId ='';
    onGoingChallenge =0;
    $('#select-stone-menu').css({'display':'none'});
  }
})

function getAPoint(player){
  if(player==1){
    color='blue'; player1Points ++; points = player1Points; playerCanPeek3 = 2; whichPlayerCanP3 = 2;
  }
  else{
    color='red'; player2Points ++; points = player2Points; playerCanPeek3 = 2; whichPlayerCanP3 = 1;
  }

  if(points<3){
    //$('#py1-st-1').css({'background-image':'url("./source/st-blue.png")'})
    $('#py'+player+'-st-'+points).css({'background-image':'url("./source/st-'+color+'.png")'})
  }
  else{
    $('#py'+player+'-st-'+points).css({'background-image':'url("./source/st-'+color+'.png")'}) 
    displayText('player-'+player+'-won',1);
    $('#next-turn-button').css({'display':'none'});
    $('#end-game-button').css({'display':'block','background-color':color});
  }
}

/*--------------------------------*/

/*$('.line-stone').click(function(e){
  if($(this).attr('used') == '1'){
    $(this).css({'background-image':'url("./source/ps-'+$(this).attr('name')+'.png")'});
    $(this).attr('facedown','0');
  }

  if(stName!=''){
    //$(this).text(stName);
    
    $(this).css({'background':'center',
                 'background-size':'cover',
                 'background-image':'url("./source/ps-'+stName+'.png")'});
    
    $(this).attr('name',stName);
    $(this).attr('used','1');
    //$(this).attr('facedown','1');

    //$('#'+stId).text('usado');
    $('#'+stId).attr('used','1');
    $('#'+stId).css({'background-image':"url('')"});
    stName = '';
    stId = '';
  }
})

$('.line-stone').mouseout(function(e){
  if($(this).attr('facedown')=='0' && $(this).attr('used')=='1'){
    $(this).css({'background-image':'url("./source/ps-back.png")'});
    $(this).attr('facedown','1');
  }
})

$('.pool-stone').click(function(e){
  if($(this).attr('used') == '0'){
    stName = $(this).attr('name');
    //bgImg = $(this).css('background-image');
    stId = $(this).attr('id');
  }
})*/