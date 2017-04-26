$(function () {
  var oldVal = "";
  var seq = 0;
  var socket = io();
  var input = document.getElementById('textarea');
  $('#textarea').on("cut paste", function(e) {
    e.preventDefault();
    return false;
  });
  $("#textarea").on("input", function() {
      var currentVal = $(this).val();
      var start = input.selectionStart;
      if(currentVal == oldVal) {
          return; //check to prevent multiple simultaneous triggers
      }
      if (oldVal.length - currentVal.length >= 2) {
        input.value = oldVal;
        $('#changes').prepend("prevented multi-select\n");
        return;
      }
      var msg = {};
      if (currentVal.length < oldVal.length ) {
            msg = {'id':socket.id, 'seq':seq++, 'op':'delete', 'char':oldVal.charAt(start), 'pos':start, 'string': 'deleted ' + oldVal.charAt(start) + ' at pos ' + (start)};
      } else msg = {'id':socket.id, 'seq':seq++, 'op':'insert', 'char':currentVal.charAt(start-1), 'pos':(start-1), 'string': 'inserted '+currentVal.charAt(start-1)+' at pos '+ (start-1)};

      oldVal = currentVal;
      $('#changes').prepend(msg.id+'::'+msg.seq+': '+msg.string+'\n');
      socket.emit('change message', msg);
  });

  socket.on('change message', function(msg) {
    //var msg = JSON.parse(msgJSON)
    //alert(msg);
    if (socket.id == msg.id) return;
    var str = input.value;
    var textPos = input.selectionStart;
    if (msg.op == 'delete') {
      input.value = msg.pos == 0 ? str.substring(1) : str.substring(0,msg.pos) + str.substring(msg.pos+1);
      if (msg.pos < textPos) {
        input.setSelectionRange(textPos-1, textPos-1);
      } else input.setSelectionRange(textPos, textPos);
    } else { //msg.op == 'insert'
      input.value = msg.pos == 0 ? msg.char + str : str.substring(0,msg.pos) + msg.char + str.substring(msg.pos);
      if (msg.pos <= textPos) {
        input.setSelectionRange(textPos+1, textPos+1);
      } else input.setSelectionRange(textPos, textPos);
    }
    $('#changes').prepend(msg.id+'::'+msg.seq+': '+msg.string+'\n');

  });
});
//var socket = io();
