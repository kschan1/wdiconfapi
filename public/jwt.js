console.log("hello world");

$('form').submit(function(event) {
  event.preventDefault();
  $.ajax({
    url: "/authenticate",
    method: "post",
    data: {
      email: $('form input:eq(0)').val(),
      password: $('form input:eq(1)').val()
    }
  }).done( function(result) {
    console.log(result);
    console.log(result.token);
    if (result.success) {
      sessionStorage.token = result.token;
    }
    
  });
});

$('.check').on('click', function(event) {
  event.preventDefault();
  var auth = "";
  if ("token" in sessionStorage) {
    auth = 'Bearer ' + sessionStorage.token;
  }
  $.ajax({
    url: "/getinfo",
    method: "get",
    headers: {
        authorization: auth
    },
    data: {}
  }).done( function(result) {
    console.log(result);
  });
});

$('.delete').on('click', function(event) {
  event.preventDefault();
  var auth = "";
  if ("token" in sessionStorage) {
    auth = 'Bearer ' + sessionStorage.token;
  }
  $.ajax({
    url: "/api/venues",
    method: "post",
    headers: {
        authorization: auth
    },
    data: {
      name: "asdf",
      address: "earth"
    }
  }).done( function(result) {
    console.log(result);
  });
});