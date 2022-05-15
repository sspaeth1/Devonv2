    // let url = window.location.host;
    // let path = window.location.html;
    // let pageNum = window.location.origin;

    let pathRaw = window.location.href.split('/');
    let path = pathRaw.filter(removeEmpty=>removeEmpty);
    let addOne = parseInt(pageNum)+1;
    let subOne = parseInt(pageNum)-1;
    let spacer;



    previousSlide = ()=>{
      if(pageNum > 1){
        let newPage = "portfolio_" + subOne + ".html";
        pathRaw.splice(pathRaw.length-1, 1, newPage);
        console.log("pathRaw" + pathRaw);
        return pathRaw.join('/');
      }
     }

    nextSlide = ()=>{
      if(grabNextBtn.css('visibility') == "visible"){
        if(pageNum <= 15){
          let newPage = "portfolio_" + addOne + ".html";
          pathRaw.splice(pathRaw.length-1, 1, newPage);
          console.log("pathRaw" + pathRaw);
          return pathRaw.join('/');
        }
      }

    }

document.addEventListener('swiped-left', function(e) {
  window.open(previousSlide(), '_parent');
    });

document.addEventListener('swiped-right', function(e){
   window.open(nextSlide(),'_parent');
})