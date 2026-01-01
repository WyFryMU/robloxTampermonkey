// ==UserScript==
// @name         RobloxSort
// @namespace    http://tampermonkey.net/
// @version      2025-05-03
// @description  try to take over the world!
// @author       Wylie Frydrychowicz
// @match        https://www.roblox.com/discover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("loading");
    var hideSponsor = false;
    var contentDiv = document.getElementById('content');
    const sortButton = document.createElement('button');
    sortButton.textContent = 'Sort Me!';
    const hideSponsorBtn = document.createElement('button');
    hideSponsorBtn.textContent = 'Show/Hide Sponsors!';

    var searchPage;
    var gameList;
    var allGamesList;

    function checkForSponsor(game){
        var dataTestId = game.firstChild.lastChild.getAttribute("data-testid");
        if(dataTestId == "game-tile-sponsored-footer"){
            if(hideSponsor == true) {
                game.style.display = "none";
                game.setAttribute("count","0");
            }else{
                game.style.display = "flex";
                game.setAttribute("count","1000000000");
            }
        }else{
            addCountToDiv(game);
        }
    }

    function removeIfZero(game){
        var count = game.getAttribute("count");
        if(count == 0){
            gameList.removeChild(game);
        }
    }

    function addCountToDiv(game){
        var count = game.firstChild.children[2].children[3].innerText;
        if(count.includes("K") && count.includes(".")){
            count = count.replace(".","").replace("K", "00");
        }if(count.includes("M") && count.includes(".")){
            count = count.replace(".","").replace("M", "000000");
        }if(count.includes("K")){
            count = count.replace("K", "000");
        }if(count.includes("M")){
            count = count.replace("M", "000000");
        }
        game.setAttribute("count",count);
    }

    function sortChildren(container) {
        Array.from(container.children)
            .sort((a, b) => parseInt(b.getAttribute("count")) - parseInt(a.getAttribute("count")))
            .forEach(element => container.appendChild(element));
    }

    function main(){
        searchPage = document.getElementById('games-search-page');
        gameList = searchPage.firstChild.firstChild.firstChild;
        allGamesList = gameList.children;
        for (var i = 0; i < allGamesList.length-1; i++) {
            var game = allGamesList[i];
            checkForSponsor(game);
            if(game.style.display == "flex"){
                removeIfZero(game);
            }
        }
        sortChildren(gameList,true);
    }

    sortButton.addEventListener('click', function() {
        main();
    });

    hideSponsorBtn.addEventListener('click', function() {
        hideSponsor = !hideSponsor;
        main();
    });
    contentDiv.insertBefore(sortButton, contentDiv.children[0]);
    contentDiv.insertBefore(hideSponsorBtn, contentDiv.children[1]);

})();
