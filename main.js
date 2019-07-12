// ==UserScript==
// @name         liima's chat translate
// @namespace    none
// @version      1.0.0
// @description  try to take over the world!
// @author       liima
// @match        https://www.twitch.tv/*
// @match        https://www.youtube.com/watch?*
// @match        https://www.smashcast.tv/*
// @match        https://mixer.com/*
// @match        http://www.bigo.tv/*
// @match        play.afreecatv.com/*
// @match        https://www.huya.com/*
// @match        https://instagib.tv/*
// @match        https://live.bilibili.com/*
// @match        https://*.nicovideo.jp/*
// @match        https://sketch.pixiv.net/@*
//// @match        https://livestream.com/accounts/6395980/live
// @match        https://www.periscope.tv/w/*
// @match        http://localhost:8000/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {

    'use strict';

    var Conf = {};

    var $ = (() => {

        //var docbody = !document.body ? parent.document.body : document.body;
        //var doc = !document.body ? parent.document.documentElement : document.documentElement;
        var doc = document.documentElement;

        var $ = function(selector, root) {
            var el = (root || document).querySelector(selector);
            // if(el === null) {
            //     el = parent.document.querySelector(selector);
            //     el ? console.log("parent", el) : 1;
            //     console.log(el, selector);
            // }
            return el;
        };
        $.$ = function(selector, root){
            return (root || document).querySelectorAll(selector);
        }
        $.el = function(tag, class_name, text) {
            var el = document.createElement(tag);
			if (class_name !== undefined) {
                el.className = class_name;
            }
			if (text !== undefined) {
				el.textContent = text;
            }
            return el;
        };
        $.add = function(parent, el) {
            return parent.appendChild(el);
        };
        $.on = function(el, events, handler) {
            //console.log(el, events, handler);
            var event, j, len, ref;
            ref = events.split(' ');
            for (j = 0, len = ref.length; j < len; j++) {
              event = ref[j];
              el.addEventListener(event, handler, false);
            }
        };
        $.tgl = function(el, class_name) {
            for (let i = 0; i < arguments.length; i++) {
                if(typeof arguments[i] === "string") {
                    //console.log(el, arguments[i]);
                    el.classList.toggle(arguments[i]);
                }
            }
            // el.classList.toggle(class_name);
        };
        $.drag = function(el, container) {
            var isDragReady = false,
                dragoffset = {
                    x: 0,
                    y: 0
                };
            $.on(el, 'mousedown', function (e) {
                isDragReady = true;
                var a = e.pageX || e.clientX + (doc.scrollLeft ? doc.scrollLeft : docbody.scrollLeft);
                var b = e.pageY || e.clientY + (doc.scrollTop ? doc.scrollTop : docbody.scrollTop);

                if(container) {
                    dragoffset.x = e.pageX - container.offsetLeft;
                    dragoffset.y = e.pageY - container.offsetTop;
                } else {
                    dragoffset.x = e.pageX - el.offsetLeft;
                    dragoffset.y = e.pageY - el.offsetTop;
                }
            });
            $.on(document, 'mouseup', function () {
                isDragReady = false;
            });
            $.on(document, 'mousemove', function (e) {
                //console.log("e", e);
                if (isDragReady) {
                    e.pageX || e.clientX + (doc.scrollLeft ? doc.scrollLeft : docbody.scrollLeft);
                    e.pageY || e.clientY + (doc.scrollTop ? doc.scrollTop : docbody.scrollTop);
                    if(container) {
                        container.style.top = (e.pageY - dragoffset.y) + "px";
                        container.style.left = (e.pageX - dragoffset.x) + "px";
                    } else {
                        el.style.top = (e.pageY - dragoffset.y) + "px";
                        el.style.left = (e.pageX - dragoffset.x) + "px";
                    }
                }
            });
        };
        $.save = {

            tgl: function() {
                Conf[this.name] = this.toggle = !this.toggle;
                $.save.save();
            },

            input: function() {
                //console.log("this", this.name, this.value, Conf);
                if(!this.value) return;
                for (let i = 0; i < Conf[this.name].length; i++) {
                    Conf[this.name][0] = this.value;
                }
                this.placeholder = this.value;
                this.value = null;
                $.save.save();
            },
            checkbox: function() {
                //console.log(this, this.name, this.checked, Conf);
                for (let i = 0; i < Conf[this.name].length; i++) {
                    Conf[this.name][0] = this.checked;
                }
                $.save.save();
            },
            save: function() {
                localStorage.setItem("ct-config-test", JSON.stringify(Conf));
            }
        };
        $.wait = function(selector, callback) {
            setTimeout(() => {
                var el = $(selector);
                if(el) {
                    callback(el);
                } else {
                    $.wait(selector, callback);
                }
            },1000);
        };
        $.link = function(link, class_name, text) {
            var a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            if (class_name !== undefined) {
                a.className = class_name;
            }
            if(text !== undefined) {
                a.textContent = text;
            }
            return a
        }

        return $;
    })();

    /*
     *   how to add site;
     *
     *   name : site name
     *   match : url | site url that chat is in
     *   chat : .element | chat
     *   chatnode : .element | chat textline
     *   obsconfig : 'optional'  | MutationObserver config default is, childList : true
     *   button : 'optional' .element | prepend's to element
     *   iframe : 'optional' .element | if chat is located inside iframe this is needed
    */ 

    var Site = {
        Languages: [ 
            { lang: "Azerbaijan", value: "az" },
            { lang: "Albanian", value: "sq" },
            { lang: "Amharic", value: "am" },
            { lang: "English", value: "en" },
            { lang: "Arabic", value: "ar" },
            { lang: "Armenian", value: "hy" },
            { lang: "Afrikaans", value: "af" },
            { lang: "Basque", value: "eu" },
            { lang: "Bashkir", value: "ba" },
            { lang: "Belarusian", value: "be" },
            { lang: "Bengali", value: "bn" },
            { lang: "Burmese", value: "my" },
            { lang: "Bulgarian", value: "bg" },
            { lang: "Bosnian", value: "bs" },
            { lang: "Welsh", value: "cy" },
            { lang: "Hungarian", value: "hu" },
            { lang: "Vietnamese", value: "vi" },
            { lang: "Haitian (Creole)", value: "ht" },
            { lang: "Galician", value: "gl" },
            { lang: "Dutch", value: "nl" },
            { lang: "Hill Mari", value: "mrj" },
            { lang: "Greek", value: "el" },
            { lang: "Georgian", value: "ka" },
            { lang: "Gujarati", value: "gu" },
            { lang: "Danish", value: "da" },
            { lang: "Hebrew", value: "he" },
            { lang: "Yiddish", value: "yi" },
            { lang: "Indonesian", value: "id" },
            { lang: "Irish", value: "ga" },
            { lang: "Italian", value: "it" },
            { lang: "Icelandic", value: "is" },
            { lang: "Spanish", value: "es" },
            { lang: "Kazakh", value: "kk" },
            { lang: "Kannada", value: "kn" },
            { lang: "Catalan", value: "ca" },
            { lang: "Kyrgyz", value: "ky" },
            { lang: "Chinese", value: "zh" },
            { lang: "Korean", value: "ko" },
            { lang: "Xhosa", value: "xh" },
            { lang: "Khmer", value: "km" },
            { lang: "Laotian", value: "lo" },
            { lang: "Latin", value: "la" },
            { lang: "Latvian", value: "lv" },
            { lang: "Lithuanian", value: "lt" },
            { lang: "Luxembourgish", value: "lb" },
            { lang: "Malagasy", value: "mg" },
            { lang: "Malay", value: "ms" },
            { lang: "Malayalam", value: "ml" },
            { lang: "Maltese", value: "mt" },
            { lang: "Macedonian", value: "mk" },
            { lang: "Maori", value: "mi" },
            { lang: "Marathi", value: "mr" },
            { lang: "Mari", value: "mhr" },
            { lang: "Mongolian", value: "mn" },
            { lang: "German", value: "de" },
            { lang: "Nepali", value: "ne" },
            { lang: "Norwegian", value: "no" },
            { lang: "Punjabi", value: "pa" },
            { lang: "Papiamento", value: "pap" },
            { lang: "Persian", value: "fa" },
            { lang: "Polish", value: "pl" },
            { lang: "Portuguese", value: "pt" },
            { lang: "Romanian", value: "ro" },
            { lang: "Russian", value: "ru" },
            { lang: "Cebuano", value: "ceb" },
            { lang: "Serbian", value: "sr" },
            { lang: "Sinhala", value: "si" },
            { lang: "Slovakian", value: "sk" },
            { lang: "Slovenian", value: "sl" },
            { lang: "Swahili", value: "sw" },
            { lang: "Sundanese", value: "su" },
            { lang: "Tajik", value: "tg" },
            { lang: "Thai", value: "th" },
            { lang: "Tagalog", value: "tl" },
            { lang: "Tamil", value: "ta" },
            { lang: "Tatar", value: "tt" },
            { lang: "Telugu", value: "te" },
            { lang: "Turkish", value: "tr" },
            { lang: "Udmurt", value: "udm" },
            { lang: "Uzbek", value: "uz" },
            { lang: "Ukrainian", value: "uk" },
            { lang: "Urdu", value: "ur" },
            { lang: "Finnish", value: "fi" },
            { lang: "French", value: "fr" },
            { lang: "Hindi", value: "hi" },
            { lang: "Croatian", value: "hr" },
            { lang: "Czech", value: "cs" },
            { lang: "Swedish", value: "sv" },
            { lang: "Scottish", value: "gd" },
            { lang: "Estonian", value: "et" },
            { lang: "Esperanto", value: "eo" },
            { lang: "Javanese", value: "jv" },
            { lang: "Japanese", value: "ja" }
            ],
        Sites: [{
            name: "localhost",
            match: "localhost",
            chat: ".chat",
            chatline: ".chatline",
        },{
            name: "twitch.tv",
            match: "twitch.tv/",
            chat: ".chat-list [role='log']",
            chatline: "span[data-a-target='chat-message-text']",
            button: ".top-nav__menu > div:nth-child(3)"
        }, {
            name: "youtube.com",
            match: "youtube.com/watch?", //live_chat?
            chat: "#item-offset #items",
            chatline: "#message",
            button: "#buttons .ytd-masthead",
            //obsconfig: { childList: true, subtree: true },
            iframe: "#chatframe"
        }, {
            name: "smashcast",
            match: "smashcast.tv/",
            chat: ".tse-scroll-content",
            chatline: "" //literally no chatters
        }, {
            name: "mixer.com",
            match: "mixer.com/",
            chat: "div[class^='ChatMessages__'] > div",
            chatline: 'span[class^="textComponent__"]'
        },{
            name: "bigo.tv",
            match: "bigo.tv/",
            chat: "#chat_content_list_e",
            chatline: ".user_text_content"
        }, {
            name: "afreecatv.com",
            match: "play.afreecatv.com/",
            chat : "#chat_area",
            chatline : "dd"
        }, {
            name: "huya.com",
            match: "huya.com/",
            chat: "#chat-room__list",
            chatline: ".msg"
        }, {
            name: "instagib.tv",
            match: "instagib.tv/*",
            chat: "#vn_list_box",
            chatline: "span.chatline",
        }, {
            name: "bilibili",
            match: "live.bilibili.com/",
            chat: "#chat-history-list",
            chatline: ".danmaku-content"
        },{
            name: "nicovideo",
            match: "nicovideo.jp/",
            chat: "div[class^='___table___']",
            chatline: "span[class^='___comment-text___']"
        },{
            name: "pixiv.net",
            match: "sketch.pixiv.net/",
            chat: "#LiveSidebarLog",
            chatline: ".TextFragment > span"
        },{
            name: "livestream.com",
            match: "",
            chat: ".comments_list_wrapper",
            chatline: ".commenter_content"
        },{
            name: "periscope.tv", //needs cors policy fix or someting
            match: "periscope.tv/w/",
            chat: ".Chat > div > div",
            chatline: ".SystemMessage-message > span"
        }],
    };

    var Config = {
        details: {
            version: "1.0.0"
        },
        ui: {
            "settings": false,
            "keybinds": false,
            "stats": false,
            "info": false
            //"changelog": false,
        },
        settings: {
            "translate text": [false, "translates chat"],
            "Replace text": [false, "Replaces translated text with whitespace"],
            "Ignore spam": [true, "Ignore's spamlike messages"]
        },
        inputSettings: {
            "apikey": ["trnsl.1.1.20190123T075015Z.16e7f20b61b0463d.7a0405224ebdc152dbe31bcb3c34262a74e2b170", "Yandex api key"],
        },
        apivalues: {
            "language1": ["fi"],
            "language2": ["ko, ja, zh"]
        },
        keybinds: {
            "toggle": ["Shift Q", "toggles panel visibility"],
            "translate": ["Shift T", "translates chat"]
        },
        stats: {
            "characters": 0,
            "words": 0
            //"api requests": 0,
            //"filtered messages": 0
        },
        info: {
            "Supported sites": ["list", "https://example.com"],
            "Supported languages": ["language list", "https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#api-overview__languages"],
            "Api Key": ["Get your apikey by registering to yandex in here", "https://translate.yandex.com/developers/keys"],
            "Max characters": ["Maxinium volume of translated characters, 1,000,000/day, 10,000,000/month.", "https://yandex.com/legal/translate_api/"]
        }
    };
    
    const Chat = (() => {

        const init = () => {

            Site.Sites.some((site) => {
                //console.log(site.match && (new RegExp(site.match, 'i')).test(window.location.href));
                if (site.match && (new RegExp(site.match, 'i')).test(window.location.href)) {
                                 
                    if(site.iframe) {
                        $.wait(site.iframe, (e) => 
                            $.on(e, "load", () => {
                                site.doc = e.contentDocument || e.contentWindow.document
                                console.log(site, site.doc.body);
                                translator(site)
                            })
                        )
                    } else {
                        console.log("normal load", site.chat);
                        $.wait(site.chat, (e) => {
                            console.log(site);
                            translator(site);
                        });
                    }
                    if(site.button) {
                        $.wait(site.button, (e) => { 
                            console.log("button", e);
                            var ct = $.el("div", "ct-button", "CT");
                            ct.style.cursor = 'pointer'; 
                            ct.style.fontSize = "14px";
                            ct.style.margin = "auto 10px";
                            e.insertBefore(ct, e.childNodes[0])
                            $.on(ct, "click", () => $.tgl($(".ct-ct"), "ct-hidden"))
                        });
                    }
                }
            });
        };

        const translator = (site) => {    

            var a = $(".ct-language1")
            console.log("parent", a);
            
            $.on($(".ct-language2"), "change", language().save);
            $.on($(".ct-language1"), "change", language().save);

            language().load();

            //setInterval(() => $.save.save(), 20000);

            console.log("shit");

            observe(site, (node) => {
                const detect = fetcher("https://translate.yandex.net/api/v1.5/tr.json/detect",
                "key=" + Conf["apikey"][0] + "&text=");
    
                const translate = fetcher("https://translate.yandex.net/api/v1.5/tr.json/translate",
                    "key=" + Conf["apikey"][0] + "&lang=" + Conf["language1"] + "&text=");   

                // console.log(`
                //     ${node}
                //     ${Conf["translate text"][0]}
                // `)
                /*
                ${Conf["apikey"][0]}
                */

                console.log(node, node.textContent);
                if(!Conf["translate text"][0]) return


                // translate(node.textContent).then(json => {
                //     console.log(json);
                // });

                if(Conf["Ignore spam"][0]) {
                    if(spamFilter(node)) {
                        console.log(`filtered ${node.innerText}`)
                        return;
                    }
                }

                stats(node);

                if($(".ct-language2").selectedOptions < 93) {

                    console.log("wtf");

                    detect(node.textContent).then(json => {
                        console.log(json, json.lang);
                        
                        if(json.lang === Conf["language2"]) {

                            translate(node.textContent).then(json => {

                                if(Conf["replace text"][0]) node.innerHTML = json.text;
                                else node.innerHTML = node.innerHTML + " | " + json.text;

                            });
                        }
                    });

                } else {

                    //console.log("wtf", node.textContent);

                    translate(node.textContent).then(json => {
                        console.log(json, json.text);

                        if(Conf["Replace text"][0]) node.innerHTML = json.text;
                        else node.innerHTML = node.innerHTML + " | " + json.text;

                    });
                }
                
            });
        };

        const stats = (node) => {
            var text = node.textContent;

            // "api requests": "0",
            // "filtered messages": "0",

            //console.log(
            //    text,
                Conf["characters"] += text.length
                Conf["words"] += text.split(" ").length
            //);

            //do..
        }

        const spamFilter = (node) => {
            node = node.textContent;
            
            //Max lenght of one character spam like > text here haha spam > wwwwwwwwwww < hahaha
            let maxLenght = 6; //ㅋㅋㅋㅋㅋㅋ
            let maxCharacter = `(.)\\1{${maxLenght},}`;
            let oneCharacter = "^(.)\\1*$";
            let numbers = "^[0-9]*$";
            let whitespace = "^[\\S]:$";
            let randomAcii = "^[\\u2800-\\u28FF]*$";

            const filter = new RegExp(oneCharacter || maxCharacter || numbers || whitespace || randomAcii, "gim");
            //console.log(filter.test(node));
            return filter.test(node);
        };
    
        const language = () => {

            const language1 = $(".ct-language1"),
                  language2 = $(".ct-language2");

            const load = () => {
                for (var i = 0; i < language2.options.length; i++) {
                    language2.options[i].selected = Conf["language2"].indexOf(language2.options[i].value) >= 0;
                }
                language1.value = Conf["language1"];
                $(".ct-output").innerHTML = Conf["language2"];
            };

            const save = () => {
                let arr = [];
                Array.from(language2.selectedOptions).forEach(el => arr.push(el.value));
                Conf["language2"] = arr; 
                Conf["language1"] = [language1.selectedOptions[0].value];
                $.save.save();
                $(".ct-output").innerHTML = Conf["language2"];
            }; 

            return { load, save };
        };

        const observe = (site, callback) => {

            let node;
            const doc = site.iframe ? site.doc : document;
            const obsconfig = site.obsconfig ? site.obsconfig : { childList: true};

            console.log("check frame", doc, $(site.chat, doc));

            new MutationObserver((mutations) => {

                mutations.forEach((mutation) => {

                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        //console.log(mutation.addedNodes);
                        const nodes = mutation.addedNodes[i];


                        let chatline = $(site.chatline, nodes);


                        try {
                            //if(chatline.innerText === "" || !chatline.innerText) return 

                            node = chatline.innerText ? chatline : nodes

                        } catch (error) {
                            //console.log("chatline error", error);
                        }

                       // console.log(node);
                        //node = $(site.chatline, nodes) ? $(site.chatline, nodes) : nodes
                        //console.log($(site.chatline, nodes).innerText);
                        //console.log($(site.chatline, nodes));
                        //console.log($(site.chatline, nodes).textContent);
                        //node = nodes > 1 ? $(site.chatline, nodes) : nodes;
                        //console.log("nodes", nodes);
                        //console.log("line", $(site.chatline, nodes));
                        //console.log("node", node);
                    }

                });

                //console.log(node);
                return callback(node);

            }).observe($(site.chat, doc), obsconfig);

            //chat testing
            // setInterval(() => {
            //     $.add($(site.chat), $.el("div", "chatline", "oispa kaljaa"));
            // }, 3000);
        };

        const fetcher = (url, data) => {
            return (text) => {
                console.log(data + text, "fuck off");
                return fetch(url, {
                    method: "post",
                    mode: "cors",
                    body: data + text,
                    
                    headers : {
                        // "Content-Security-Policy": null,
                        // "Access-Control-Allow-Origin": "*",
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                })
                .then((response) => {
                    return response.json();
                }).catch(err => console.log("fetch err", err));
            };
        };

        return { init };

    })();

    const Ui = (() => {

        const init = () => {
            theme();
            container();
            
            //temp
            Array.from($.$(".ct-click")).map(el =>
                $.on(el, "click", (e) =>
                    $.tgl(e.target, "ct-active")));

        };

        const theme = () => {
            var asdf = `
                .ct-ct{
                    top: 35vh;
                    right: 80vh;
                    z-index: 9998;
                    position: absolute;
                    width: 500px;
                    background-color: #1f1f1f;
                    border: 1px solid #383a3b;

                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-areas: 
                        "header header"
                        "nav main";
                }

                .ct-header {
                    display: grid;
                    grid-area: header;
                }

                .ct-end {
                    justify-self: end;
                }

                .ct-nav {
                    grid-area: nav;
                }

                .ct-main {
                    grid-area: main;
                }

                .ct-colum {
                    display: grid;
                }

                .ct-colum3 > *{
                    display: grid;
                    grid-template-columns: 25% auto 30%;
                }

                .ct-colum2 > *{
                    display: grid;
                    grid-template-columns: 25% auto;
                }

                .ct-text {
                    color: #fff;
                    margin: 0 0 0 0;
                    padding: 0 5px 0 5px;
                    /*
                    padding: 0 0px 0 0px;
                    margin: 0 0 3px 0;
                    */
                }
                .ct-text::first-letter {
                    text-transform: uppercase;
                }

                .ct-hr {
                    border-bottom: 2px solid #383a3b;
                    margin-block-start: 0.5em;
                    margin-block-end: 0.5em;
                }

                .ct-click {
                    cursor: pointer;
                }

                .ct-move {
                    cursor: move;
                }

                .ct-active {
                    color: gray;
                }

                .ct-hidden {
                    display:none; 
                }

                .ct-ct * {
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: -moz-none;
                    -o-user-select: none;
                    user-select: none;
                }

                .ct-ct option,
                .ct-ct select,
                .ct-ct input {
                    color: #000;
                }
                .ct-ct input[type="checkbox"] {
                    -webkit-appearance: checkbox;
                }
                .ct-output {
                    overflow-wrap: break-word;
                    width: 380px;
                    height: 28px;
                    overflow-y: scroll;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .ct-output::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }

            `;

            if($(".ct-css")) $(".ct-css").remove();
            var w;
            $.wait("head", function(e) {
                $.add(e, w = $.el('style', "ct-css", asdf));
                console.log(e, w);
            })


        };

        const container = () => {

            var el1, el2, el3, el4, move;

            var container = $.el("div", "ct-ct");

            //header
            $.add(container, move = $.el("div", "ct-header ct-move"));
                $.add(move, el2 = $.el("p", "ct-text ct-click ct-end", "X"));
                $.on(el2, "click", () => $.tgl(container, "ct-hidden"));

            //nav
            $.add(container, el1 = $.el("div", "ct-nav"));
            $.add(el1, el2 = $.el("p", "ct-text", "chat translator"));
            $.add(el1, el2 = $.el("p", "ct-text ct-hr", "version: " + Conf["version"]));
            for (var key in Config.ui) {
                $.add(el1, el2 = $.el("div", "ct-text ct-click", key));
                el2.name = key;
                el2.toggle = Config.ui[key];

                //...
                if(Config.ui[key] === false) {
                    $.wait(".ct-" + el2.name, (el) => {
                        $.tgl(el, "ct-hidden")
                    });
                } else {
                    $.tgl(el2, "ct-active")
                }
                $.on(el2, "click", function() {
                    $.save.tgl.call(this);
                    $.tgl($(".ct-" + this.name), "ct-hidden");
                })

            }

            $.add(el1, el2 = $.el("div", "ct-colum2 ct-reload"));
            $.add(el2, el3 = $.el("div", "ct-text", "reset"));
            $.on(el3, "click", () => { 
                localStorage.removeItem("ct-config-test");
                window.location.reload();
            })


            //body
            $.add(container, el1 = $.el("div", "ct-main"));

                $.add(el1, el2 = $.el("div", "ct-colum ct-language"));
                    $.add(el2, el3 = $.el("select", "ct-language1"));
                    for (let i = 0; i < Site.Languages.length; i++) {
                        el4 = $.el("option", "ct", Site.Languages[i].lang);
                        el4.value = Site.Languages[i].value;
                        el3.append(el4);
                    }

                    $.add(el2, el3 = $.el("select", "ct-language2"));
                    el3.multiple = true;
                    for (let i = 0; i < Site.Languages.length; i++) {
                        el4 = $.el("option", "ct", Site.Languages[i].lang);
                        el4.value = Site.Languages[i].value;
                        el3.append(el4);
                    }
                    $.add(el2, el3 = $.el("p", "ct-text ct-output"));

                $.add(el1, el2 = $.el("div", "ct-colum3 ct-settings"));
                    $.add(el2, $.el("div", "ct-title ct-hr ct-text", "Settings"));
                    for (var key in Config.settings) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.el("span", "ct-text", Config.settings[key][1]));
                        $.add(el3, el4 = $.el("input"));
                        el4.type = "checkbox";
                        el4.checked = Config.settings[key][0];
                        el4.name = key;
                        $.on(el4, "change", $.save.checkbox);
                    }

                    for (var key in Config.inputSettings) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.el("span", "ct-text", Config.inputSettings[key][1]));
                        $.add(el3, el4 = $.el("input"));
                        el4.placeholder = Config.inputSettings[key][0]
                        el4.name = key;
                        $.on(el4, "blur", $.save.input);
                    }

                $.add(el1, el2 = $.el("div", "ct-colum3 ct-keybinds"));
                $.add(el2, $.el("div", "ct-text ct-hr ct-title", "Keybinds"));
                    for (var key in Config.keybinds) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.el("span", "ct-text", Config.keybinds[key][1]));
                        $.add(el3, el4 = $.el("input"));
                        el4.placeholder = Config.keybinds[key][0];
                        el4.name = key;
                        $.on(el4, "keyup keydown", function() {
                            this.value = Keybind.modifier();
                            $.save.input.call(this);
                        });
                    }

                $.add(el1, el2 = $.el("div", "ct-colum2 ct-stats"));
                $.add(el2, $.el("div", "ct-text ct-hr ct-title", "Stats"));
                for (var key in Config.stats) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.el("span", "ct-text", Config.stats[key]));
                    }  

                $.add(el1, el2 = $.el("div", "ct-colum2 ct-info"));
                $.add(el2, $.el("div", "ct-text ct-hr ct-title", "Info"));
                for (var key in Config.info) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.link(Config.info[key][1], "ct-text", Config.info[key][0])  );
                    }

                // $.add(el1, el2 = $.el("div", "ct-colum2 ct-changelog"));
                // $.add(el2, $.el("div", "ct-text ct-hr ct-title", "Changelog"));
                // for (var key in Config.changelog) {
                //         $.add(el2, el3 = $.el("div", "ct-text", key));
                //         $.add(el3, $.link(Config.info[key][1], "ct-text", Config.info[key][0])  );
                //     }
                
            $.drag(move, container)
            $.add($("body"), container);
            console.log(container);
        };

        return { init };

    })();

    const Keybind = (() => {
        
        const init = () => {
            $.on(document, 'keydown', keybinds);
        };

        const modifier = () => {
            event.stopPropagation();
            //event.preventDefault();

            const keyStr = ["Control", "Shift", "Alt", "Meta"].includes(event.key) ? "" : event.key + " ";

            const key =
                ( event.ctrlKey  ? "Control " : "" ) +
                ( event.shiftKey ? "Shift "   : "" ) +
                ( event.altKey   ? "Alt "     : "" ) +
                ( event.metaKey  ? "Meta "    : "" ) +
                keyStr
            ;
            
            return key.trim();
        };


        const modal = (conf) => {

            console.log(conf);

            const [key, info] = conf;

            var el1, el2;
            var container = $.el("div", "ct-modal")
            $.add(container, el2 = $.el("div", "ct-text", key))
            $.add( $("body"), container);



            setTimeout(() => {
                console.log(info);
                //container.remove();
            }, 500);

        }
       
        const keybinds = () => {

            try {
                
                var mod = modifier();

                switch (mod) {
                    case Conf["toggle"][0]:
                        $.tgl($(".ct-ct"), "ct-hidden")
                       //modal(Conf["toggle"])
                    break;
                    case Conf["translate"][0]:
                        Conf["translate text"][0] = Conf["translate text"][0] = !Conf["translate text"][0] 
                        //console.log(Conf["translate text"][0]);
                    break;
                }
            } catch (error) {
                console.log("Keybind:", error);
            }
        };

        return { init, modifier };
        
    })();

    const Main = (() => {

        const loadConfig = () => {
            var ctct = JSON.parse(localStorage.getItem("ct-config-test"));
            if(!ctct) {

                for (const obj in Config) {

                    const configObj = Config[obj];

                    for (const key in configObj) {

                        Conf[key] = configObj[key][0]

                        if(typeof configObj[key][1] === "object") {

                            const configObj2 = configObj[key][1];

                            for (const key in configObj2) {
                                //console.log(key, configObj2[key]);
                                Conf[key] = configObj2[key];
                            }

                        } else {
                            Conf[key] = configObj[key]
                        }
                    }
                }

            } else {

                for (const obj in Config) {

                    const configObj = Config[obj];

                    for (const key in configObj) {

                        if(typeof configObj[key][1] === "object") {

                            const configObj2 = configObj[key][1];

                            for (const key in configObj2) {
                                //console.log(key, configObj2[key]);
                                Conf[key] = ctct[key];
                                configObj2[key] = ctct[key];
                            }

                        } else {
                            Conf[key] = ctct[key]
                            configObj[key] = ctct[key];
                        }                      
                    }
                }
                Conf = ctct;
            }
            
            //$.save.save()
            // console.log(Config);
            // console.log(Conf);
            // console.log(ctct);
        }

        const init = () => {

            loadConfig()
            Keybind.init();

            $.on(document, "DOMContentLoaded", () => {
                Ui.init();
                Chat.init();
            })
        };

        return { init };

    })();

    Main.init();

})();