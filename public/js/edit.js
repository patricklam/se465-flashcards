/* globals SimpleTableCellEditor */

const editor = new SimpleTableCellEditor("grid");
editor.SetEditableClass("editable");
editor.SetEditableClass("editableNum", { validation: $.isNumeric });

const columnNames = { 1:"fname", 2:"location", 3:"correct", 4:"total" };

function recalc() {
  $('#grid tbody tr').each(function() {
    var total = $(this).children()[3].textContent;
    var correct = $(this).children()[2].textContent;
    $(this).children()[4].innerHTML = total > 0 ? Math.floor(correct/total*100) : '--';
  });
  // when we have an imgdata, then we add a real img instead.
  $('.imgdata').each(function(index) {
    var data = this.innerText;
    if (data) {
      var row = '#row-'+index;
      var img = $(row).children()[0];
      var newImage = document.createElement('img');
      newImage.src = 'data:image/jpg;base64,'+this.innerText;
      newImage.width = 200;
      newImage.classList.add("front");
      img.innerHTML = newImage.outerHTML;
    }
  });
}

function trash(row) {
  console.log("trash "+row);
  var _id = $("#row-"+row).attr("_id");
  $.ajax({
      url: '/api/delete',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify( {"_id": _id}),
      processData: false,
      success: function(data, textStatus, jQxhr) {
        location.reload(true);
      },
      error: function(jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
  });
}

// courtesy MDN
function sendFile(file) {
  const uri = "/api/upload";
  const xhr = new XMLHttpRequest();
  const fd = new FormData();

  xhr.open("POST", uri, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // reloading will force the new image to be there
      location.reload(true);
    }
  };
  fd.append('image', file);
  // Initiate a multipart/form-data upload
  xhr.send(fd);
}

$('#grid').on("cell:edited", function (event) {
  const _id = $(event.element).closest('tr').attr('_id');
  const col = $(event.element).attr('index');
  const colRe = /ind-(\d+)-(\d+)/;
  const res = colRe.exec(col);

  $.ajax({
      url: '/api/update',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify( {"_id": _id, "col": columnNames[res[2]], "val": event.newValue}),
      processData: false,
      success: function(data, textStatus, jQxhr) {
        recalc();
      },
      error: function(jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
  });
});

$(document).on('change', ':file', function() {
  const input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
  recalc();
  
  $(':file').on('fileselect', function(event, numFiles, label) {
      if (numFiles > 0) {
        sendFile(this.files[0]);
      }
  });
});