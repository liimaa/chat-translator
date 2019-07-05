# chat-translator
Chat translator is Javascript translation addon for chats.

## Supported sites
- twitch
- youtube
- mixer
- afreecatv
- huya
- instagib
- bilibili
- nicovideo
- pixiv
- periscope

# Faq

  ### Adding new site
      name : site name
      match : url | site url that chat is in
      chat : .element | chat
      chatnode : .element | chat textline
      obsconfig : 'optional'  | MutationObserver config default is, childList : true
      button : 'optional' .element | prepend's to element'
    
      example below >
  
      name: "twitch.tv",
      match: "twitch.tv/",
      chat: ".chat-list [role='log']",
      chatline: "span[data-a-target='chat-message-text']",
      button: ".top-nav__menu > div:nth-child(3)"
      
  ### Supported languages
  [language list](https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#api-overview__languages).
  ### Api Key
  Get your apikey by registering to yandex [in here](https://translate.yandex.com/developers/keys)
  ### Max characters
  Maxinium volume of translated characters, 1,000,000/day, 10,000,000/month [info](https://yandex.com/legal/translate_api/)
       
