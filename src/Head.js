window.onload = dynamicallyLoadScript("utilities.js")
window.onload = dynamicallyLoadScript("sound.js")
window.onload = dynamicallyLoadScript("gameobject.js")
window.onload = dynamicallyLoadScript("gamestate.js")

function dynamicallyLoadScript(url) {
  var script = document.createElement("script");  // sake a script DOM node
  script.src = url;  // set its src to the provided URL

  document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}
