// ==UserScript==
// @name         Zigabu
// @version      0.1
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
            url: 'https://zigabu.github.io/author-id.json',
            timeout: 5000,
            onload: function(response) {
                if (response.readyState === 4 && response.status === 200) {
                    try {
                        if (response && response.responseText) {
                            var array = JSON.parse(response.responseText);
                            array.forEach(function(id) {
                                GM_setValue(id, "+");
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        });
    }

    Z(); setInterval(function(){Z();}, 5000);

    function Z() {
        document.querySelectorAll("article.story:not(.read)").forEach(function(e, i){
            if (!e) return;

            e.classList.add("read");

            var active = e.querySelector(".story__rating-up_active, .story__rating-down_active");
            if (active) return;

            var id = e.dataset.authorId;
            if (!id) return;

            var zbot = GM_getValue(id);

            if (zbot) {
                e.style.opacity = '0.4';
                var down = e.querySelector(".story__rating-down");
                var collapse = e.querySelector(".collapse-button");
                setTimeout(function(){
                    var active2 = e.querySelector(".story__rating-up_active, .story__rating-down_active");
                    if (active2) return;

                    down.click();
                    console.log("Zbot", id, '(post)');
                }, 1000 * Math.floor(Math.random() * 2 + 1) * (i + 1));
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

            var meta_arr = meta.split(';');
            meta_arr.forEach(function(m){
                var key_val = m.split('=');
                if (!id && key_val[0] === 'aid') {
                    id = key_val[1];
                }
            });
            if (!id) return;

            var zbot = GM_getValue(id);

            if (zbot) {
                e.style.opacity = '0.4';
                var down = e.querySelector(".comment__rating-down");
                setTimeout(function(){
                    down.click();
                    console.log("Zbot", id, '(comment)');
                }, 1000 * Math.floor(Math.random() * 2 + 1) * (i + 1));
            }
        });
    }

})();
