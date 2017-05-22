var weatherIcons = {
  clear: {
    day: 'http://cdn.quotesgram.com/small/16/83/1293318956-8d5da479eb6dc3eb194fb8cd4f3c66a2.jpg',
    night: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQx4LSlXfpE6-0Abkxk0i2yFJ2hYPxuog18bZgrJpTOKXp_MlR',
  },
  clouds: 'http://www.threepullpa.com/data/uploads/12/320830-bright-sun-in-blue-clouds.jpg',
  rain: {
    rain: 'http://www.thebetterindia.com/wp-content/uploads/2016/06/little_boat_and_summer_rain_by_arefin03-d7lytbe.jpg',
    drizzle: 'https://factismals.files.wordpress.com/2014/06/fog-20-1024x768.jpg',
  },
  fog: 'http://brightcove04.o.brightcove.com/4221396001/4221396001_5274740680001_5274739973001-vs.jpg?pubId=4221396001',
  snow: 'http://cdn.abclocal.go.com/content/wls/images/cms/polar-bears---1.jpg',
  extreme: 'https://www.mos.org/sites/dev-elvis.mos.org/files/images/main/uploads/slides/imax_extreme-weather_tornado.jpg'
};


var weatherApp = {
  init: function() {
    this.getCurrentWeather;
    this.parseWeatherData();
  },
  getCurrentWeather: function(cb) {
    var locationInput = $('#new-location');
    var weatherLocation;
    var weatherData = {};
    var newLocation;

    locationInput.on('keydown', function(e) {
      if (e.which === 13) {
        weatherData = null; // Clear the object 
        newLocation = $(this).val().toLowerCase();
        var weather = 'http://api.openweathermap.org/data/2.5/weather?q=' + newLocation + '&units=metric&APPID=5944eb6056d44d617a2cf5b737ef2e8b';
        $.get(weather, function(data) {
          weatherData = data;
          weatherData.iconReset = true;
          cb(weatherData);
          console.log(weatherData);
        });
        $(this).val(''); // Clear the input for the next location 
      }
    });

    var weather = 'http://api.openweathermap.org/data/2.5/weather?q=bradforddata&units=metric&APPID=5944eb6056d44d617a2cf5b737ef2e8b';
    $.get(weather, function(data) {
      weatherData = data;
      console.log(weatherData);
      cb(weatherData);
    });
  },
  _getCurrentConditions: function(time, condition) {
    //alert(condition)
    var icon = $('#weather-icon');
    var body = $('body');
    if (condition === 'Clear' && time > 06 && time < 20) {
      body.css({
        'background-image': 'url(' + weatherIcons.clear.day + ')',
        'background-size': 'cover',

        'background-position': 'center center'
      });
    } else if (condition === 'Clear' && time > 20) {
      body.css({
        'background-image': 'url(' + weatherIcons.clear.night + ')',
        'background-size': 'cover',
        'background-position': 'center center'
      });
    }
    if (condition === 'Clouds') {
      body.css({
        'background-image': 'url(' + weatherIcons.clouds + ')',
        'background-size': 'cover',
        'background-position': 'center center'
      });
    }
    if (condition === 'Rain' || condition === 'Drizzle') {
      body.css({
        'background-image': 'url(' + weatherIcons.rain.rain + ')',
        'background-size': 'cover',
        'background-position': 'center center'
      });
    }
    if (condition === 'Snow') {
      body.css({
        'background-image': 'url(' + weatherIcons.snow + ')',
        'background-size': 'cover',
        'background-position': 'center center'
      });
    }
    if (condition === 'Fog' || condition === 'Mist') {
      body.css({
        'background-image': 'url(' + weatherIcons.fog + ')',
        'background-size': 'cover',
        'background-position': 'center center'
      });
    }
    if (condition === 'Extreme') {
      body.css({
        'background-image': 'url(' + weatherIcons.extreme + ')',
        'background-size': 'cover',
        'background-position': 'center center'
      });
    }
  },
  _calcWindChill: function(airTemp, wSpeed) {
    var windSpeed = $('#wind-speed'); // Wind speed dom element
    var windChill = $('#wind-chill');
    wSpeed = 3.6 * wSpeed.toFixed()
      //var chillFactor = 35.74 + 0.6215*airTemp +(0.4275*airTemp - 35.75)*Math.pow(wSpeed,0.16);
    var chillFactor = 13.12 + (0.6215 * airTemp) - (11.37 * Math.pow(wSpeed, 0.16)) + (0.3965 * airTemp * Math.pow(wSpeed, 0.16));
    chillFactor = Math.round(chillFactor);
    windSpeed.html(wSpeed + ' km/h');
    windChill.html(chillFactor + '&#8451;');
  },
  parseWeatherData: function() {
    // ********************
    // * Local variables *
    // ********************
    var _self = this;
    var icon = $('#weather-icon');
    var city = $('#city-name');
    var today = $('#today');
    var weatherDesc = $('#w-descript');
    var humidity = $('#humid');
    var pressure = $('#pressure');
    var currentTemp = $('#cur-temp');
    var maxTemp = $('#max-temp');
    var minTemp = $('#min-temp');
    //add something new
      // ********************
    // * End Local variables *
    // ********************

    // Call the handler for the API call
    this.getCurrentWeather(function(data) {
      var date = new Date(data.dt * 1000);
      var hours = date.toString().split(':');
      hours = hours.shift().split(' ').pop();
      //alert(hours)
      //alert(date);
      date = date.toString().split(' ').slice(0, 4).toString().replace(/,/g, ' '); // Format the current date  

      // Call Conditions handler 
      _self._getCurrentConditions(hours, data.weather[0].main);
      // Call Wind chill handler 
      _self._calcWindChill(data.main.temp, data.wind.speed);
      // Convert date from UTC to current date

      //Temporary icon design
      var iconSrc = icon.attr('src');
      iconSrc += data.weather[0].icon + '.png';
      //alert(iconSrc);

      icon.attr('src', iconSrc);

      // Reset the icon src attr
      if (data.iconReset) {
        iconSrc = '';
        iconSrc += 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        icon.attr('src', iconSrc);
      }

      // Append data to the DOM
      city.html(data.name + ', ' + data.sys.country);
      today.html(date);
      weatherDesc.html(data.weather[0].description);
      humidity.html(data.main.humidity + '%');
      pressure.html(data.main.pressure + 'hPa');
      currentTemp.html(Math.round(data.main.temp) + '&#8451;');
      maxTemp.html(Math.round(data.main.temp_max) + '&#8451;');
      minTemp.html(Math.round(data.main.temp_min) + '&#8451;');
    });
  }
};

$(document).ready(function() {
  $('#new-location').hide();
  $('#change-location').click(function(){
    $('#new-location').slideToggle(200);
  });
  try {
    weatherApp.init();
  } catch (err) {
    alert(new Error('Something went wrong'));
    console.log(err);
  }
});
