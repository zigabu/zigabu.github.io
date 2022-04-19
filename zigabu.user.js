// ==UserScript==
// @name         Zigabu
// @version      0.2
// @description  Anti-Z-bot on pikabu.ru
// @author       Aleksandr Ryazansky
// @icon         https://avatars.githubusercontent.com/u/103862835?s=200&v=4
// @run-at       document-end
// @match        *://pikabu.ru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    var time = GM_getValue("time");
    if (!time || time < (new Date() / 1000) + 3600) {
        GM_setValue("time", new Date() / 1000);
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://zigabu.github.io/zots.json',
            timeout: 5000,
            onload: function(response) {
                if (response.readyState === 4 && response.status === 200) {
                    try {
                        if (response && response.responseText) {
                            var array = JSON.parse(response.responseText);
                            array.forEach(function(id) {
                                GM_setValue(id, "down");
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        });
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://zigabu.github.io/humans.json',
            timeout: 5000,
            onload: function(response) {
                if (response.readyState === 4 && response.status === 200) {
                    try {
                        if (response && response.responseText) {
                            var array = JSON.parse(response.responseText);
                            array.forEach(function(id) {
                                GM_setValue(id, "up");
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        });
    }

    Zot(); setInterval(function(){Zot();}, 5000);

    function Zot() {
        document.querySelectorAll("article.story:not(.read)").forEach(function(e, i){
            if (!e) return;

            e.classList.add("read");

            var active = e.querySelector(".story__rating-up_active, .story__rating-down_active");
            if (active) return;

            var link = e.querySelector("a.story__title-link");
            if (!link) return;

            var id = e.dataset.authorId;
            var name = e.dataset.authorName;
            if (!id) return;

            var zot = GM_getValue(id);

            if (zot) {
                e.style.opacity = "0.4";
                var rating = e.querySelector(".story__rating-" + zot);
                setTimeout(function(){
                    rating.click();
                    console.log("Zot", id, "(post)");
                }, 1000 * Math.floor(Math.random() * 2 + 1) * (i + 1));
            } else {
                var footer = document.createElement("div");
                var plus_title = document.createElement("div");
                var plus_description = document.createElement("div");

                plus_title.style.fontWeight = "bold";
                plus_title.innerText = "ZOT: " + name + " | ID " + id;

                var author_username1 = document.createElement("div");
                var author_username2 = document.createElement("span");
                var author_username3 = document.createElement("span");
                author_username1.style.color = "#7d7d7d";
                author_username2.innerText = "Имя пользователя: ";
                author_username3.style.fontWeight = "bold";
                author_username3.innerText = name;
                author_username1.appendChild(author_username2);
                author_username1.appendChild(author_username3);

                var author_id1 = document.createElement("div");
                var author_id2 = document.createElement("span");
                var author_id3 = document.createElement("span");
                author_id1.style.color = "#7d7d7d";
                author_id2.innerText = "ID пользователя: ";
                author_id3.style.fontWeight = "bold";
                author_id3.innerText = id;
                author_id1.appendChild(author_id2);
                author_id1.appendChild(author_id3);

                var author_proof1 = document.createElement("div");
                var author_proof3 = document.createElement("span");
                author_proof1.style.color = "#7d7d7d";
                author_proof3.style.fontWeight = "bold";
                author_proof3.innerText = link.getAttribute("href");
                author_proof1.appendChild(author_proof3);

                plus_description.appendChild(author_username1);
                plus_description.appendChild(author_id1);
                plus_description.appendChild(author_proof1);

                footer.style.margin = "16px 32px 16px 24px";
                footer.appendChild(plus_title);
                footer.appendChild(plus_description);

                e.querySelector(".story__main").appendChild(footer);
            }
        });
        document.querySelectorAll("div.comment>.comment__body:not(.read)").forEach(function(e, i){
            if (!e) return;

            e.classList.add("read");

            var active = e.querySelector(".comment__rating-up_active, .comment__rating-down_active");
            if (active) return;

            var id;
            var meta = e.parentElement.dataset.meta;
            if (!meta) return;

            var meta_arr = meta.split(";");
            meta_arr.forEach(function(m){
                var key_val = m.split('=');
                if (!id && key_val[0] === "aid") {
                    id = key_val[1];
                }
            });
            if (!id) return;

            var zot = GM_getValue(id);

            if (zot) {
                e.style.opacity = "0.4";
                var down = e.querySelector(".comment__rating-" + zot);
                setTimeout(function(){
                    down.click();
                    console.log("Zot", id, "(comment)");
                }, 1000 * Math.floor(Math.random() * 2 + 1) * (i + 1));
            }
        });
    }

})();
