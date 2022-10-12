var util = {};

//post error 처리
util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } 
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  } 
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

util.time = function(time){
  hour = time.slice(0,2)
  minute = time.slice(3,5)
  month = time.slice(6,8)
  date = time.slice(9,11)
  year = time.slice(12,17)

  AllDate = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":00"
  return AllDate
}

module.exports = util;