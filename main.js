// Course: DT084G Introduktion till JavaScript - Projekt",
// Assignment: Projekt",
// Author: Joel Lindberg - joli0939",
// Date: 2017-10-25",
// Filename: main.js"

"use strict";

// Declares global variables with the elements from the html file
var onlyitEl = document.getElementById("onlyit");
var mainnavlistEl = document.getElementById("mainnavlist");
var searchlanEl = document.getElementById("searchlan");
var searchTextEl = document.getElementById("searchText");
var searchbuttonEl = document.getElementById("searchbutton");
var infoEl = document.getElementById("info");
var numrowsEl = document.getElementById("numrows");
var logoEl = document.getElementById("logo");

// Resets values for elements if the site is reloaded
searchTextEl.value = "";
numrowsEl.value = 20;
onlyitEl.checked = false;

// Global variables
var antalJobb = numrowsEl.value;
var i;

// Creates Event listeners
onlyitEl.addEventListener("click", rensaLista, false);
window.addEventListener("load", skrivUtLan, false);
mainnavlist.addEventListener("click", annonserForLan, false);
searchbuttonEl.addEventListener("click", friSok, true);

// Event listener for the numrow element that change how many job ads will be shown
numrowsEl.addEventListener("change", function() {

    antalJobb = numrowsEl.value;

}, false);

// Event listener for the logo with an anonymous function that reloads the page
logoEl.addEventListener("click", function() {

    location.reload();

}, false);

// Event listener for the search field that makes it possible to press enter to search
searchTextEl.addEventListener("keyup", function(e) {  

    if (e.keyCode === 13) {

        friSok();

    }

}, false)





// Function that clears the info element of all job ads
function rensaLista() {

    // Checks if there is jobs written in the "info" div and clears them when the onlyit checkbox is clicked
    if (infoEl.firstChild) {
        
        while (infoEl.firstChild) {
        
            infoEl.removeChild(infoEl.firstChild);

        }
    }
}





// Function to add the list of countys to the html page
function skrivUtLan() {

    // Creates a property that becomes an instance of the XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // When the browser gets a response from the server, onload fires and an anonymous function runs
    xhr.onload = function() {

        // Checks if the server status is ok
        if (xhr.status === 200) {

            // Parse the JSON file that is returned from the server into property jsonTxt
            var jsonTxt = JSON.parse(xhr.responseText);

            // Creates a property with an array from the JSON file
            var lan = jsonTxt.soklista.sokdata;

            // Creates an option with all countys in the searchlan element
            searchlanEl.innerHTML += '<option id="alla">Alla län</option>';

            // For loop that goes through the array, gets the name of the countys and uses .innerHTML to add them to the mainnavlist and searchlan elements
            for (i=0; i < lan.length; i++) {

                // Creates propertys with values from the JSON file
                var tempLan = lan[i].namn;
                var tempAntal = lan[i].antal_platsannonser;
                var tempID = lan[i].id;

                // Turn numbers into strings
                tempAntal = tempAntal.toString();
                tempID = tempID.toString();

                // Creates list items and adds to the main navigation menu
                mainnavlistEl.innerHTML += '<li id="' + tempID + '">' + tempLan + ' (' + tempAntal + ') </li>';

                // Creates options and adds them to the select for the search
                searchlanEl.innerHTML += '<option id="' + tempID + '">' + tempLan + '</option>';

            }
        }
        // If the connection is not ok, the error code is written in the console
        else {

            console.log(xhr.status);

        }
    }
    
    // Prepares the call to the server, tells it that a file will be downloaded and then wich file
    xhr.open('GET', 'http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan', true);

    // No need to send anything to the server
    xhr.send(null);

}





// Function that contacts the server and gets a file with the job ads for a separate county, the file is then sent to the skrivUtAnnonser function that writes the ads to the info element
function annonserForLan(e) {

    // Declares properties for the id of the clicked county and the instance of the XMLHttpRequest object
    var lanID = e.target.id;
    var xhr = new XMLHttpRequest();

    // When the browser gets a response from the server, onload fires and an anonymous function runs 
    xhr.onload = function() {

        // Checks if the server status is ok
        if (xhr.status === 200) {

            // Calls the function skrivUtAnnonser that will write the job ads to the info div, the JSON file is sent with the call
            skrivUtAnnonser(xhr.responseText);
            
        }
        // If the connection is not ok, the error code is written in the console
        else {

            console.log(xhr.status);

        }
    }

    // Checks if the checkbox "onlyit" is checked, if it is not the server sends a JSON with all kind of jobs, if it is checked the server sends a JSON with only IT related jobs
    if (!onlyitEl.checked) {
        
        xhr.open('GET', 'http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=' + lanID + '&antalrader=' + antalJobb, true);

    }
    else {

        xhr.open('GET', 'http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=' + lanID + '&antalrader=' + antalJobb + '&yrkesomradeid=3', true);   

    }

    // No need to send anything to the server
    xhr.send(null);

}





// Function that writes the job ads to the info div
function skrivUtAnnonser(jsonVar) {

    // Calls function clearList to make sure the info element is empty
    rensaLista();

    // Creates a property of the JSON file sent to this function and creates an array with the job ads
    var jsonTxt = JSON.parse(jsonVar);
    var jobbArr = jsonTxt.matchningslista.matchningdata;
   
    // Checks if the jobbArr array is empty, if it is the user is told
    if (jobbArr !== undefined) {

        // For loop that goes through the array with job ads, takes the values that is gonna be written from the JSON file and ads them to separate properties and writes them to the info element using .innerHTML
        for (i=0; i < jobbArr.length; i++) {

            // Properties for the information from the JSON file
            var tempAnnonsrubrik = jobbArr[i].annonsrubrik;
            var tempYrkesbenamning = jobbArr[i].yrkesbenamning;
            var tempArbetsplatsnamn = jobbArr[i].arbetsplatsnamn;
            var tempKommunnamn = jobbArr[i].kommunnamn;
            var tempAnstallningstyp = jobbArr[i].anstallningstyp;
            var tempAntalPlatser = jobbArr[i].antalplatser;
            var tempPubliceringsDatum = jobbArr[i].publiceraddatum;       
            var tempSistaAnsokningsdag = jobbArr[i].sista_ansokningsdag;        
            var tempURL = jobbArr[i].annonsurl;

            // Removes the time from the dates and checks if there is an end date for the ad, if not the user is told to go to the actual ad
            tempPubliceringsDatum = tempPubliceringsDatum.slice(0, 10);

            if (tempSistaAnsokningsdag === undefined) {

                tempSistaAnsokningsdag = "Se 'Läs mer'";

            }
            else {

                tempSistaAnsokningsdag = tempSistaAnsokningsdag.slice(0, 10);

            }

            // Writes the ad to the info element
            infoEl.innerHTML += '<article><h3>' + tempAnnonsrubrik + '</h3>' 
            + '<h4>' + tempYrkesbenamning + ' på ' + tempArbetsplatsnamn + ' i ' + tempKommunnamn + '</h4>' 
            + '<p> <strong>Anställningstyp: </strong>' + tempAnstallningstyp 
            + '<br /> <strong>Antal platser: </strong>' + tempAntalPlatser 
            + '<br /> <strong>Publiceringsdatum: </strong>' + tempPubliceringsDatum 
            + '<br /> <strong>Sista ansökningsdag: </strong>' + tempSistaAnsokningsdag + '<br /> </p>' 
            + '<p> <a href=' + tempURL + ' target="_blank" class="btn">Läs mer</a></article> </p>';
        }
    }
    else {

        infoEl.innerHTML = '<h2>Ingen träff</h2>';

    }
}





// Function that contacts the server with a search string and gets a JSON file in return with the value, the file is sent to the skrivUtAnnonser function that writes the ads to the info element
function friSok () {

    // Creates properties with the value of the county from the list and the search string
    var searchLan = searchlanEl[searchlanEl.selectedIndex].id;
    var searchString = searchTextEl.value;

    // Checks if the search field is empty and tells the user if it is, it also checks if the string just contains whitespace by checking if the string gets emptpty by removing all whitespace
    if (searchString.replace(/\s/g, '') !== "") {

        // Creates a property that becomes an instance of the XMLHttpRequest object
        var xhr = new XMLHttpRequest();
        
        // When the browser gets a response from the server, onload fires and an anonymous function runs 
        xhr.onload = function() {
       
            // Checks if the server status is ok
            if (xhr.status === 200) {
    
                // Calls the function skrivUtAnnonser that will write the job ads to the info div, the JSON file is sent with the call
                skrivUtAnnonser(xhr.responseText);
                
            }
            // If the connection is not ok, the error code is written in the console
            else {
    
                console.log(xhr.status);

            }
        }

        // Prepares the call to the server and uses the properties with the county and the searchs string in the call
        if (searchLan !== "alla") {

            xhr.open('GET', 'http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=' + searchLan + '&nyckelord=' + searchString + '&antalrader=' + antalJobb, true);

        }
        else {

            xhr.open('GET', 'http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=' + searchString + '&antalrader=' + antalJobb, true);

        }

        // No need to send anything to the server
        xhr.send(null);

    }
    else {

        infoEl.innerHTML = '<h2>Sökfältet är tomt</h2>';

    }    
}