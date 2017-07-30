<!DOCTYPE html>
<?php
error_reporting(0);
session_start();
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />

    <title>WikiRef</title>

    <!-- BOOTSTRAP LINK/SCRIPT--><!-- JQuery code-->
    <!--<script src="https://code.jquery.com/jquery-3.1.0.min.js"></script>-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <!-- DS3 -->
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <!-- Link to w3school -->
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <!-- Font link icon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- CUSTOM LINK/SCRIPT-->
    <!-- Custom JS location -->
    <script src="Script/indexJS.min.js"></script>
    <!-- Custom CSS location -->
    <link rel="stylesheet" href="CSS/indexCSS.min.css">
    <link rel="stylesheet" href="CSS/Hover-master/css/hover-min.css">

    <script>
        /*$(document).ajaxSend(function(event, request, settings) {
         $('.se-pre-con').show();
         });
         $(document).ajaxComplete(function(event, request, settings) {
         $('.se-pre-con').fadeOut();
         });*/


    </script>
</head>

<div id="mySidenav" class="sidenav">
    <a style="font-size: 50px;">Profile</a>
    <h5 id="sidenavName"><?php if(isset($_SESSION['name']))   {print_r($_SESSION['name']);} ?></h5>
    <h5 id="sidenavSurname"><?php   if(isset($_SESSION['surname'])) {print_r($_SESSION['surname']);  } ?></h5>
    <a  href="#" onclick="closeSession()"><i class="fa fa-sign-out" aria-hidden="true" style="font-size: 25px;">Log out</i></a>
</div>

<body onload="onLoad()" class="logoBackground" data-spy="scroll" data-target=".navbar" data-offset="50">
<!-- fixed-top navbar -->
<!--<div class="se-pre-con"></div>-->
<nav id="navbar-complete"class="navbar navbar-default navbar-fixed-top">
    <div  class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"></button>
            <a id="navbar-brand" class="navbar-brand hvr-grow" href="index.php">WikiRef</a>
        </div>

        <div id="navbar" class="navbar-collapse collapse">
            <?php
            if(isset($_SESSION['username'])){
                ?>
                <a href="#" class="fa fa-sign-in hvr-grow" id="iconLogin" data-toggle="modal" data-target="#modalLogin" style=" display: none"></a>
                <a href="#" class="fa fa-bars hvr-grow" id="iconMenu" onclick="openNav()" aria-hidden="true" style=" display: "></a>
                <?php
            } else {
                ?>
                <a href="#" class="fa fa-sign-in hvr-grow" id="iconLogin" data-toggle="modal" data-target="#modalLogin" style=" display: "></a>
                <a href="#" class="fa fa-bars hvr-grow" id="iconMenu" onclick="openNav()" aria-hidden="true" style=" display: none"></a>
                <?php
            }
            ?>
            <ul id="navList" class="nav navbar-nav">
                <i style="font-size: 37px; color: black" >:-)</i>
            </ul>

            <div class="col-sm-3 col-md-3 pull-right">
                <div id="searchNavForm" class="form">
                    <div id="inputNav" class="input-group" style="padding-top: 2px; padding-bottom: 4px;">
                        <input type="text" class="form-control" placeholder="Search" name="searchNav" id="searchNav">
                        <script>
                            $(document).ready(function(){
                                $('#searchNav').keypress(function(e){
                                    if(e.keyCode==13){
                                        $('#navSearchButton').click();
                                    }
                                });
                            });
                        </script>
                        <div class="input-group-btn">
                            <button id="navSearchButton" onclick="reloadSearch(document.getElementById('searchNav').value)" class="btn btn-default" type="submit"><i class="glyphicon glyphicon-search"></i></button>
                        </div>
                    </div>
                </div>
            </div>

        </div><!--/.nav-collapse -->
    </div>
</nav>
<div id="main">
    <p id="topPage"></p>
    <!-- modal -->
    <div class="container">
        <div class="modal fade bs-modal-sm" id="modalLogin">
            <div class="modal-dialog modal-sm">
                <div class="modal-content" id="modalDialog">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" id="buttonCloseModal">&times;</button>
                        <br>
                        <ul id="myTab" class="nav nav-tabs fluid">
                            <li class="active" style="width: 50%;">
                                <a href="#signin" data-toggle="tab">Sign In</a>
                            </li>
                            <li class="" style="width: 50%;">
                                <a href="#signup" data-toggle="tab">Register</a>
                            </li>
                        </ul>
                        <div class="modal-body">
                            <div id="myTabContent" class="tab-content">
                                <!-- LOGIN -->
                                <div class="tab-pane fade active in" id="signin">
                                    <form action="javascript:0">
                                        <!-- Text input-->
                                        <label class="control-label">User:</label>
                                        <input id="userLogin" type="text" class="form-control" placeholder="Username" required="">
                                        <!-- Password input-->
                                        <label class="control-label">Password:</label>
                                        <input required="" id="passwordLogin" class="form-control" type="password" placeholder="********" class="input-medium">

                                        <!-- Button -->
                                        <label class="control-label" id="loginMessage"></label>
                                        <button id="buttonLogin" class="btn btn-success" onclick="loginUser()">Sign In</button>
                                    </form>
                                </div>

                                <!-- SIGN UP -->
                                <div class="tab-pane fade" id="signup">
                                    <form action="javascript:0">
                                        <!-- Text input-->
                                        <label class="control-label">Name:</label>
                                        <input id="name" class="form-control" type="text" placeholder="Name" class="input-large" required="">

                                        <!-- Text input-->
                                        <label class="control-label">Surname:</label>
                                        <input id="surname" class="form-control" type="text" placeholder="Surname" class="input-large" required="">

                                        <!-- Text input-->
                                        <label class="control-label">User:</label>
                                        <input id="userSignUp" class="form-control" type="text" placeholder="User"  required="">

                                        <!-- Password input-->
                                        <label class="control-label">Password:</label>
                                        <input id="password1" class="form-control" type="password" placeholder="********" class="input-large" required="" onkeyup="checkPass()">

                                        <!-- Reenter Password-->
                                        <label class="control-label" for="reenterpassword">Re-Enter Password:</label>
                                        <input id="password2" class="form-control" type="password" placeholder="********" class="input-large" required="" onkeyup="checkPass()">
                                        <!-- Button -->
                                        <label class="control-label" id="registerMessage"></label>
                                        <button id="buttonSignUp" class="btn btn-success" onclick="registerUser()">Sign Up</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- content -->
    <div id="containerLanding" class="container-fluid">
        <div id="resultDefault" class="row scroll-pane">
            <div id="landingImg" class="container col-md-9" style="text-align: center">
            </div>
            <div id="defaultResult" class="container col-md-3"></div>
        </div>
    </div>
    <?php
    if(isset($_GET['search'])) {
        if ($_GET['search'] != "") {
            ?>
            <script>
                var searchName = "<?php echo $_GET['search'];?>";
                console.log(searchName);
                onClickSearch(searchName.replace(/%i20/g, ' '));
            </script>
            <?php
        }
    }
    ?>
    <div id="containerResultSearch" class="container-fluid scroll-pane" style="display:none;"></div>

    <div id="containerAll" class="container-fluid" style="display:none">
        <div id="colAll" class="col-md-9">
            <div id="rowWiki" class="row"></div>
            <div id="rowYouTube" class="row">
                <div class="w3-content w3-display-container" id="YouTube"></div>
            </div>
            <div id="rowTwitter" class="row">
                <h1 id="titleTwit"></h1>
                <div class="container-fluid well pre-scrollable text-left " id="containerTwit"></div>
            </div>
            <div id="rowMap" class="row">
                <div id="map"></div>
            </div>

        </div>

        <div id="colCrossRef" class="col-md-3 scroll-pane">
            <div class="container-fluid well pre-scrollable text-left " id="containerCross"></div>
        </div>

    </div>

</div>
</body>

</html>