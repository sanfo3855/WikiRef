function randomize(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function defaultResult() {
    var urlString = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=categorymembers&cmtitle=Category:Emerging_technologies&cmlimit=max&cmtype=page";
    result = [];

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: urlString,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $.each(data.query.categorymembers, function (index, value) {
                if(index>=3) {
                    result.push(value.title);
                }
            });
            randomize(result);
            var defResultHtml = '<ul id="defaultList">';
            for(i=1; i<=20; i++) {
                defResultHtml +=
                    '<li><a href="page.php?page='+result[i].replace(/ /g,'%i20')+'" style=" width: 100%; color: rgba(255,237,79,0.58); text-align: left;" onclick=""><h7><div class="well well-sm" style=" background: rgba(0, 0, 0, 0.55); border-color: rgba(0, 0, 0, 0.55);">' + result[i] + '</div></h7></a></li>';
            }
            defResultHtml += '</ul>';
            document.getElementById("defaultResult").innerHTML = defResultHtml;
        },
        error: function (errorMessage) {
            console.log(errorMessage);
        }
    });
}


function searchResult(searchTerm) {
    var resultSearch = [];
    var htmlResult = '';
    console.log(searchTerm);
    $.ajax({
        type: "GET",
        url: "https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&format=json&srsearch="+searchTerm+"&srlimit=10",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $.each(data.query.search, function(index, value) {
                resultSearch.push([value.title,value.snippet]);
            });
            for(var i=0; i<resultSearch.length; i++) {
                htmlResult = htmlResult +
                    '<div class=row>' +
                    '<a style="color: rgba(255,237,79,0.58);" href="page.php?page='+resultSearch[i][0].replace(/ /g,'%20')+
                    '" onclick=""><h3>'+ resultSearch[i][0] + '</h3></a>' + resultSearch[i][1] + '</div>';
            }
            $(document.body).removeClass('logoBackground');
            $(document.body).addClass('normalBackground');
            document.getElementById('containerResultSearch').style.display = "";
            document.getElementById('containerResultSearch').innerHTML = htmlResult;
            document.getElementById('rowWiki').innerHTML = "";
            document.getElementById('navList').innerHTML=
                '<li><a href="#containerResultSearch">Search Term: '+searchTerm+'</a></li>';
        },
        error: function (errorMessage) {
            console.log(errorMessage);
        }
    });
}

function getWikiPage(pageName20) {
    var pageName = pageName20.replace(/%20/g,' ');

    $.ajax({
        type: "GET",
        url: "https://en.wikipedia.org/w/api.php?action=parse&origin=*&format=json&page="+pageName,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $.each(data.parse.text, function(index, value) {
                htmlResult = value;
            });

            document.getElementById('rowWiki').innerHtml = "";
            document.getElementById('rowWiki').innerHTML = '<h1>'+data.parse.title+'</h1>' + htmlResult;
            $(document).ready(editPage());

            $.each(data.parse.categories, function(index, valueCat){
                if(valueCat["*"]=="Emerging_technologies"){

                    searchResultCross(pageName);
                    searchYouTubeResult(pageName);
                    searchTwitterResult(pageName);
                    searchOpenStreetMaps(pageName);
                    document.getElementById("liTitle").style.display = "";
                    document.getElementById("barTitle").innerHTML  = data.parse.title;
                    document.getElementById("liGraph").style.display = "";
                } else {
                    document.getElementById("liTitle").style.display = "";
                    document.getElementById("barTitle").innerHTML  = data.parse.title;
                    document.getElementById("colCrossRef").style.display = "none";
                    searchOpenStreetMaps(pageName);
                };
            })
        },
        error: function (errorMessage) {
            console.log(errorMessage);
        }
    });
}

var numResultCross = 0;

function searchResultCross(searchTerm) {
    var refinedTerm = searchTerm.replace(/ /g,'+');
    var resultSearchCross = [];
    var htmlResult = '';

    $.ajax({
        type: "GET",
        url: "http://api.crossref.org/works?query.title="+refinedTerm+"&sort=relevance",
        dataType: "json",
        success: function (data) {
            $.each(data.message.items, function (index, value) {
                resultSearchCross.push([value.title[0], value.URL, value.publisher]);
            });
            numResultCross = data.message["total-results"];
            if(resultSearchCross.length>0) {
                document.getElementById("colCrossRef").style.display = "";

                for (var i = 0; i < resultSearchCross.length; i++) {
                    htmlResult = htmlResult +
                        '<div class=row>' +
                        '<a target="_blank" href="' + resultSearchCross[i][1] + '"><h5><b>' + resultSearchCross[i][0] + '</b></h5></a>' +
                        '<h6 id="label' + i + '"><i>Author: ' + resultSearchCross[i][2] + '</i></h6>' +
                        '</div><br>';
                }
                document.getElementById('containerCross').innerHTML = htmlResult;
            }
        },
        error: function (errorMessage) {
            console.log(errorMessage);
        }
    });
}

var numResultYouTube =0;
function searchYouTubeResult(searchTerm){
    var refinedTerm = searchTerm.replace(/ /g,'+');
    var resultSearchYouTube = [];
    var htmlResult = '';
    var key = "AIzaSyBmTFMK4SI3d2FYZV38B_cbhQFch8Lk9SU";

    $.ajax({
        type: "GET",
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&type=video&videoCategoryId=28&q="+refinedTerm+"&key="+key,
        dataType:"json",
        success: function (data) {
            $.each(data.items, function(index,value){
                resultSearchYouTube.push([value.snippet.title, value.id.videoId]);
            });

            numResultYouTube = data.pageInfo["totalResults"];

            if(resultSearchYouTube.length>0) {
                $('#h2Tube').append(searchTerm+' related Videos');

                for (var i = 0; i < resultSearchYouTube.length; i++) {
                    htmlResult +=
                        '<iframe class="mySlides" style=" width: 100%; height: 77vh; display: none;" src="https://www.youtube.com/embed/' + resultSearchYouTube[i][1] + '"' +
                        'frameborder="0" allowfullscreen></iframe>';
                }

                htmlResult +=
                    '<button class="w3-btn w3-transparent w3-display-left" style="font-size: 150px; border:0px; color: rgba(255,237,79,0.58);" onclick="plusDivs(-1)">&#10094;</button>' +
                    '<button class="w3-btn w3-transparent w3-display-right" style="font-size: 150px; border:0px; color: rgba(255,237,79,0.58);" onclick="plusDivs(1)">&#10095;</button>';

                document.getElementById('YouTube').innerHTML = htmlResult;
                document.getElementById('liTube').style.display= "";
                document.getElementsByClassName('mySlides')[0].style.display = "";
            } else {
                console.log("No result YouTUBE")
            }
        },
        error: function (errorMessage) {
            console.log(errorMessage);
        }
    });
}

function closeModalTube() {
    var x = document.getElementsByClassName("mySlides");
    for(i=0; i< x.length; i++){
        url = x[i].src;
        x[i].src = url;
    }
}

var numResultTwitter = 0;
function searchTwitterResult(searchTerm){
    var resultSearchTwitter = [];
    var htmlResult = '';
    var textToReplace = '';
    var officialText = '';
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var lengthResult = 0;

    $.ajax({
        url: "Script/searchTwitter.php",
        type: "GET",
        dataType: "json",
        data: {searchTermTwit: searchTerm},
        success: function(data){
            $.each(data.statuses, function(index,value){
                textToReplace = value.text;
                officialText = textToReplace.replace(urlRegex,'');
                resultSearchTwitter.push([value.user.name, officialText, value.favorite_count, value.retweet_count]);
            });

            numResultTwitter = resultSearchTwitter.length;
            if(resultSearchTwitter.length>0){
                document.getElementById('titleTwit').style.display = "";

                lengthResult = resultSearchTwitter.length;
                if (lengthResult>20){
                    lengthResult = 20;
                }

                for(var i = 0; i < lengthResult; i++){
                    htmlResult +=
                        '<div class=row>' +
                        '<div class="well well-sm" style=" background: rgba(0, 0, 0, 0.55); border-color: rgba(0, 0, 0, 0.55); margin-right: 100px; margin-left:0px;">'+
                        '<table>' +
                        '<tr>' +
                        '<td rowspan="3">' +
                        '<i class="fa fa-twitter" style="font-size:35px; margin: 12px; color: #1DA1F2"></i>'+
                        '</td>'+
                        '<td>' +
                        '<h4><span class="label label-default" style="padding: 8px; font-size: 15px;">'+ " "+ resultSearchTwitter[i][0]+'</span></h4>'+
                        '</td>'+
                        '</tr>'+

                        '<tr>' +
                        '<td><h6 style=" padding-left: 10px;"><i>' + resultSearchTwitter[i][1] + '</i></h6></td>' + '</tr>' +
                        '<tr>'+
                        '<td><span class="label label-default" style=" margin-top: 20px; font-size: 14px;"><i class="fa fa-retweet" aria-hidden="true"></i>'+ " " + resultSearchTwitter[i][3]+'</span> '+
                        '<span class="label label-default" style=" margin-top: 20px; margin-left: 8px; font-size: 14px; color:"><i style="color:#CC181E" class="fa fa-heart" aria-hidden="true"></i>'+ " " + resultSearchTwitter[i][2]+'</span></td> '+
                        '</tr>' +
                        '</table>' +
                        '</div>' +
                        '</div><br>';
                }
                document.getElementById('containerTwit').innerHTML = htmlResult;
                document.getElementById('liTwit').style.display = "";
            } else {
                document.getElementById('rowTwitter').style.display = "none"
            }
        },
        error: function (errorMessage) {
            console.log(errorMessage);
        }
    });
}

var map;
var numResultMaps = 0;
function searchOpenStreetMaps(searchTerm) {
    term=searchTerm;
    resultGM =[];
    refinedTerm = searchTerm.replace(/ /g,'+');
    refinedTerm = refinedTerm.replace(/_/g,'+');
    $.ajax({
        type: "GET",
        url: "http://nominatim.openstreetmap.org/search?format=json&q="+refinedTerm,
        datatype: "json",
        success: function(data) {
            $.each(data, function (index, value) {
                resultGM[index] = [value.lat, value.lon, value.display_name];
            });

            if(resultGM['length'] >0) {
                numResultMaps = resultGM['length'];
                map = L.map('map').setView([resultGM[0][0], resultGM[0][1]], 3);
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                }).addTo(map);

                for (i = 0; i < resultGM['length']; i++) {
                    L.marker([resultGM[i][0], resultGM[i][1]]).addTo(map)
                        .bindPopup(resultGM[i][2]);
                }

                document.getElementById('h2Maps').innerHTML = searchTerm +" in the World";
                document.getElementById('liMap').style.display = "";
            }
        },
        error: function (errorMessage) {
            console.log(errorMessage);
        }
    });
}



function createGraphic(){

        var bubbleChart = new d3.svg.BubbleChart({
            supportResponsive: true,
            size: 600,
            innerRadius: 600 / 3.5,
            radiusMin: 50,
            data: {
                items: [
                    {text: "YouTube", count: numResultYouTube},
                    {text: "CrossRef", count: numResultCross},
                    {text: "Twitter", count: numResultTwitter},
                    {text: "OpenStreetMap", count: numResultMaps}
                ],
                eval: function (item) {
                    return item.count;
                },
                classed: function (item) {
                    return item.text.split(" ").join("");
                }
            },
            plugins: [
                {
                    name: "lines",
                    options: {
                        format: [
                            {
                                textField: "count",
                                classed: {count: true},
                                style: {
                                    "font-size": "28px",
                                    "font-family": "Source Sans Pro, sans-serif",
                                    "text-anchor": "middle",
                                    fill: "white"
                                },
                                attr: {
                                    dy: "0px",
                                    x: function (d) {
                                        return d.cx;
                                    },
                                    y: function (d) {
                                        return d.cy;
                                    }
                                }
                            },
                            {
                                textField: "text",
                                classed: {text: true},
                                style: {
                                    "font-size": "14px",
                                    "font-family": "Source Sans Pro, sans-serif",
                                    "text-anchor": "middle",
                                    fill: "white"
                                },
                                attr: {
                                    dy: "20px",
                                    x: function (d) {
                                        return d.cx;
                                    },
                                    y: function (d) {
                                        return d.cy;
                                    }
                                }
                            }
                        ],
                        centralFormat: [
                            {
                                style: {"font-size": "60px", fill:"black"},
                                attr: {}
                            },
                            {
                                style: {"font-size": "40px", fill:"black"},
                                attr: {dy: "40px"}
                            }
                        ]
                    }
                }]
        });


}

function checkPass() {
    var pass1 = document.getElementById('password1');
    var pass2 = document.getElementById('password2');
    var message = document.getElementById('registerMessage');
    var goodColor = "#00cc44";
    var badColor = "#ff3333";

    if((pass1.value == pass2.value) && (pass1.value.length >0 && pass2.value.length>0)){
        pass2.style.backgroundColor = goodColor;
        message.innerHTML="Passwords match !";
        message.style.color= "green";
    }else if ((pass1.value != pass2.value) && (pass1.value.length >0 && pass2.value.length >0)){
        pass2.style.backgroundColor = badColor;
        message.innerHTML = "Password don't match !"
        message.style.color= "red";
    } else {
        pass2.style.background = "white";
        message.innerHTML = "";
    }
}

function closeSession() {
    var url = window.location.href;
    console.log(url);
    $.ajax ({
        url:  "Script/closeSession.php",
        type: "POST",
        dataType: "text",
        traditional: true,
        data: {url: url}
    }).done(window.location.reload());
}

function loginUser() {
    var username = document.getElementById('userLogin').value;
    var password = document.getElementById('passwordLogin').value;
    var message = document.getElementById('loginMessage');
    var dataUser = '';
    var name = '';
    var surname = '';

    if ((username !="")&&(password!="")) {
        $.ajax({
            url: "Script/login.php",
            type: "POST",
            dataType: "text",
            traditional: true,
            data: {username: username, password: password},
            success: function (data) {
                if (data != "NOTLOGIN") {
                    window.location.reload()
                } else if (data == "NOTLOGIN") {
                    message.innerHTML = "";
                    message.innerHTML = "User/Password are wrong or not registred";
                    message.style.color = "red";
                    message.style.fontSize = "15px";
                }

            },
            error: function (errorMessage) {
                console.log(errorMessage);
            }
        });
    }else{
        message.style.color = "red";
        $('#loginMessage').html("Fill all fields !");
    }
}

function registerUser() {
    var pass1 = document.getElementById('password1');
    var pass2 = document.getElementById('password2');
    var name = document.getElementById('name').value;
    var surname = document.getElementById('surname').value;
    var user = document.getElementById('userSignUp').value;
    var message = document.getElementById('registerMessage');

    if((pass1.value != "") && (pass2.value !="") && (name!="") && (surname!="") && (user!="") ) {
        if (pass1.value == pass2.value) {
            $.ajax({
                url: "Script/signUp.php",
                type: "POST",
                dataType: "text",
                traditional: true,
                data: {name: name, surname: surname, username: user, password: pass1.value},
                success: function (data) {
                    console.log(data);
                    if (data == "REGISTERED") {
                        window.location.reload()
                    } else if (data == "NOTREGISTERED") {
                        message.innerHTML = "";
                        message.innerHTML = "Existing user !";
                        message.style.color = "red";
                        message.style.fontSize = "18px";

                    }
                },
                error: function (errorMessage) {
                    console.log(errorMessage);
                }
            });
        } else {
            if (pass1.value.length > 0 && pass2.value.length > 0) {
                message.style.color = "red";
                $('#registerMessage').html("Password don't match !");
            }
        }
    }else {
        message.style.color = "red";
        $('#registerMessage').html("Fill all fields !");
    }
}
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    var showed = x[slideIndex-1];
    showed.style.display = "";
    for(i=0; i< x.length; i++){
        if(i!=slideIndex-1){
            url = x[i].src;
            x[i].src = url;
        }
    }
}

function onLoad() {
    $(document).ready(defaultResult());
}

function onClickSearch(searchTerm) {
    document.getElementById('containerLanding').style.display = "none";
    $(document).ready(searchResult(searchTerm));
}

function getSelectedTerm(pageName) {
    console.log("Clicked on: " +pageName);
    getWikiPage(pageName);
}

function reloadSearch(term) {
    window.location = "index.php?search="+term;
}

function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginRight = "220px";
    document.getElementById("main").style.paddingRight = "20px";
    document.getElementById("containerCross").style.maxWidth = "19%";
    document.getElementById("map").style.width = "90%";
    document.getElementById("iconMenu").setAttribute("onclick", "closeNav()");
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight= "0";
    document.getElementById("main").style.paddingRight = "0";
    document.getElementById("containerCross").style.maxWidth = "30%";
    document.getElementById("iconMenu").setAttribute("onclick", "openNav()");
}

function editPage(){
    var wikiLinks = document.getElementById("rowWiki").getElementsByTagName("a");
    for(i=0; i<wikiLinks.length; i++){
        var hrefArray = wikiLinks[i].href.split("/");
        if(hrefArray[hrefArray.length-2] === "wiki"){
            wikiLinks[i].setAttribute("href","page.php?page="+hrefArray[hrefArray.length-1].replace("/_/g","%20"));
        };
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByTagName("ul");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByTagName("ol");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByTagName("img");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByTagName("sup");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("vertical-navbox");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("thumb");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("img");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("ambox");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("tright");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("mbox-image");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("mbox-text");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("reference");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("hatnote");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("References");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("references");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("External_links");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("See_also");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("navbox-title");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("navbox-list");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("reflist");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("navbox");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("infobox");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("toc");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("boilerplate");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("stub");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("searchaux");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("wikitable");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }
    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("quotebox");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("metadata plainlinks plainlist mbox-small");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("image");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByClassName("mw-editsection");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("List_of_awards_and_honors");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }


    var classToBeHidden = document.getElementById("rowWiki").getElementsByTagName("table");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("Local_media");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("rowWiki").getElementsByTagName("dl");
    while (classToBeHidden.length>0) {
        classToBeHidden[0].parentNode.removeChild(classToBeHidden[0]);
    }

    var classToBeHidden = document.getElementById("Notable_people");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Further_reading");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("External_sources");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Notes");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Bibliography_and_further_reading");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Website_sources");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Potential_benefits");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Potential_downsides");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("cite_ref_4");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Academic_centers");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Conferences");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Organizations");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Websites");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Other");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Bibliography");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Other_examples");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Text");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Video");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("AI_textbooks");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("History_of_AI");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Other_sources");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Spaceplane_vehicles_and_projects");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Live_action_films");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Live_action_television_series");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Animation");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Literature");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Sequenced_genomes");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Footnotes");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Articles");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Common");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Operators");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Specifications");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Potential_candidates_for_de-extinction");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Notes_and_References");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Sources");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Popular_culture");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Fleet");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Airships");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Elevated_early_warning_systems");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Multi-payload_tethered_aerostats");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Tactical_towers");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Tactical_aerostat");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Alternative_cutters");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Usage");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Brands");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Additional_reading");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Publications");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Notes_and_references");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

    var classToBeHidden = document.getElementById("Similar_projects");
    if (classToBeHidden != null){
        classToBeHidden.parentNode.removeChild(classToBeHidden);
    }

}