var addHeart = document.getElementsByClassName('fa-heart');
var trash = document.getElementsByClassName('fa-trash');


Array.from(addHeart).forEach(function(element) {
      element.addEventListener('click', function(){
        const email = this.parentNode.parentNode.childNodes[1].innerHTML
        const msg = this.parentNode.parentNode.childNodes[3].innerHTML
        // const addHeart = parseFloat(this.parentNode.parentNode.childNodes[5].innerHTML)
        fetch('zeldaMessages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'email': email,
            'msg': msg,
            // 'addHeart' : addHeart
            // 'addHeart':addHeart
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const email = this.parentNode.parentNode.childNodes[1].innerHTML
        const msg = this.parentNode.parentNode.childNodes[3].innerHTML
        fetch('zeldaMessages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'email': email,
            'msg': msg,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});