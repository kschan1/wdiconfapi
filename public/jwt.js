console.log("hello world");

$('form.login').submit(function(event) {
  event.preventDefault();
  $.ajax({
    url: "/authenticate",
    method: "post",
    data: {
      email: $('form.login input:eq(0)').val(),
      password: $('form.login input:eq(1)').val()
    }
  }).done( function(result) {
    console.log(result);
    console.log(result.token);
    if (result.success) {
      sessionStorage.token = result.token;
    }
    
  });
});

$('.signout').on('click', function(event) {
  if ("token" in sessionStorage) {
    delete sessionStorage.token;
    console.log({success: true, msg: "Logged out"});
  }
  else {
    console.log({success: false, msg: "Not logged in"});
  }
});

$('.check').on('click', function(event) {
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

$('form.signup').submit(function(event) {
  event.preventDefault();
  $.ajax({
    url: "/signup",
    method: "post",
    data: {
      first_name: $('form.signup input:eq(0)').val(),
      last_name: $('form.signup input:eq(1)').val(),
      email: $('form.signup input:eq(2)').val(),
      password: $('form.signup input:eq(3)').val()
    }
  }).done( function(result) {
    console.log(result);
    if (result.success) {
      sessionStorage.token = result.token;
    }
    
  });
});