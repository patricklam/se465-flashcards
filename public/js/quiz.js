var shown = false;
window.history.replaceState({}, '', '/');

document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  if (keyName === ' ') {
    reveal();
  } else if (keyName.toUpperCase() === 'Y') {
    yup();
  } else if (keyName.toUpperCase() === 'N') {
    nope();
  }
}, false);

document.addEventListener('mouseup', (event) => {
  if (!shown) {
    reveal();
  }
}, false);

function reveal() {
  $(".back").css("display", "block");
  shown = true;
}

// AJAX would be the better way of doing this,
// but I've chosen to not use AJAX here...

function yup() {
  if (!shown) return;
  var n = $("#_id").text();
  location.replace('/?_id='+n+'&verdict=1');
}

function nope() {
  if (!shown) return;
  var n = $("#_id").text();
  location.replace('/?_id='+n+'&verdict=0');
}

$(document).ready( function() {
  $('#imgdata').each(function(index) {
    var data = this.innerText;
    if (data) {
      var img = $("#front");
      var newImage = document.createElement('img');
      newImage.src = 'data:image/jpg;base64,'+data;
      newImage.classList.add("front");
      img.append(newImage);
    }
  });
  
});