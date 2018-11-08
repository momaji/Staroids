window.onload = dynamicallyLoadScript("utilities.js")
window.onload = dynamicallyLoadScript("sound.js")
window.onload = dynamicallyLoadScript("gameobject.js")
window.onload = dynamicallyLoadScript("gamestate.js")

/** Loads multiple JavaScript files into a large virtual JavaScript file. Allows for the modules to exist within seperate files and then get put together. */
function dynamicallyLoadScript(url) {
  // Taken from the following link
  //https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
  var script = document.createElement("script");  // sake a script DOM node
  script.src = url;  // set its src to the provided URL

  document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}
