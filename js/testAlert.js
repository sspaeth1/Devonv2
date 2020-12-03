alert("test insert");
checkSmallScreen = () => {
  return window.innerWidth;
};

if (checkSmallScreen() > 600) {
  console.log("small screen");
  if (!document.getElementById("scrollScript")) {
    let script = document.createElement("script");
    script.id = "scrollScript";
    script.src = "js/ScrollTrigger.min.js";
    document.head.appendChild(script);
  }
}
