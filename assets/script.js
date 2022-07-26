//Creating variables
var cityname=$("#city-name");
var temperature=$("#temperature");
var humidity=$("#humidity");
var windspeed=$("#windspeed");
var uvdisplay=$("#uvdisplay");
var citysearch=$("#city");
var searchbutton=$("#search-button");
var savedlist=$("#cities-stored");


function displayweather(city) {
    $("#5-dayforecast").empty();

    var apiKey="990158dd5916b02b8f7d177b0822ad5d";

    var queryapi=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryapi,
        method:"GET",
    }).then(function(response) {
        var date = new Date(response.dt * 1000);
        var forecastdate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
        $("current-date").text(`(${forecastdate})`);

        var icondata = response.weather[0].icon;
        var iconurl = `https://openweathermap.org/img/wn/${icondata}@2x.png`;
       
        cityname.text(response.name);
        $("#weather-icon").attr("src", iconurl);

        temperature.text("Temp: " + response.main.temp + " \xB0" + "F");

        humidity.text("Humidity: " + response.main.humidity + " %");

        windspeed.text("Wind Speed: " + response.wind.speed + " MPH");

        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var onecallapi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

        $.ajax({
            url:onecallapi,
            method:"GET",
        }).then(function (response) {

            var UVvalue = response.current.uvi;
            uvdisplay.text(UVvalue);

            if (UVvalue >= 0 && UVvalue < 3) {
                uvdisplay.addClass("green");
            } else if (UVvalue >= 3 && UVvalue < 6) {
                uvdisplay.addClass("yellow");
            } else if (UVvalue >= 6 && UVvalue < 8) {
                uvdisplay.addClass("orange");
            } else {
                uvdisplay.addClass("red");
            }

            for (var i = 1; i < 6; i++) {
                var date = new Date(response.daily[i].dt *1000);
                var forecastdate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
                var forecasticon = response.daily[i].weather[0].icon;
                var forecasturl = `http://openweathermap.org/img/wn/${forecasticon}@2x.png`;
                var forecasttemp = response.daily[i].temp.day;
                var forecasthumidity = response.daily[i].humidity;

                $("#5-dayforecast").append(
                    `<div id="forecast-section" class="card text-white bg-info mb-3" style="max-width:10rem;"> 
                        <p class="section-text">${forecastdate}</p>
                        <img src="${forecasturl}"/>
                        <p>${forecasttemp} \xB0F</p>
                        <p>Humidity: ${forecasthumidity} %</p>
                        </div>`
                );
            }
        });
    });
}

searchbutton.on("click", function (event) {
    event.preventDefault();

    var citylookup = citysearch.val();
    var storage = JSON.parse(localStorage.getItem("city-weather"));
    storage.push(citylookup);
    localStorage.setItem("city-weather", JSON.stringify(storage));

    uvdisplay.removeClass("green yellow orange red");
    displayweather(citylookup);
    rendercities();
});

function rendercities() {
    $("#cities-stored").empty();

    var storage = JSON.parse(localStorage.getItem("city-weather"));

    for(var i = 0; i < storage.length; i++) {

         var citylist = $("<li>");
         citylist.addClass("list-group-item saved-city");
         citylist.attr("id", i);
         savedlist.append(citylist);
         $("#" + i).text(storage[i]);
    }
}

savedlist.click(function(event) {
    var element = event.target;
    var index = element.id;
    console.log(index);
    var idvar = $("#" + index);
    var city = idvar.text();
    console.log(city);
    uvdisplay.removeClass("green yellow orange red");
    displayweather(city);
});

if(localStorage.getItem("city-weather") === null) {
    localStorage.setItem("city-weather", JSON.stringify([]));
}

function deleteitems() {
    localStorage.clear();
}

rendercities();
displayweather("San Diego");