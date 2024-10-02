// hamburger functionality
function hamburger() {
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%"
  })
}
hamburger();

let currentsong = new Audio()
let songs;
let currentfolder;

// close functionality
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-105%"
})

console.log("Lets write javascript");

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currentfolder = folder
  let a = await fetch(`${folder}`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (i = 0; i < as.length; i++) {
    const element = as[i]
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }
  let songul = document.querySelector(".songlist")
  songul.getElementsByTagName("ul")[0]
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li title ="Play - ${song.replaceAll(".mp3","").replaceAll("%20", " ")}" class="songname-cont">
    <img class="music" src="imgs/music.svg" alt="">
    <div class="songinfo">
            <div>
              ${song.replaceAll("%20", " ")}
            </div>
        </div> 
        <img class="play"src="imgs/play.svg" alt=""></li>`;
  }
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".songinfo").firstElementChild.innerText)
      playmusic(e.querySelector(".songinfo").firstElementChild.innerText.trim())
    })

  })

}
getsongs();

const playmusic = (track, pause = false) => {
  currentsong.src = (`${currentfolder}/` + track)
  if (!pause) {
    currentsong.play();
    play.src = "imgs/pause.svg";
  }
  document.querySelector(".songname").innerHTML = decodeURI(track)
  document.querySelector(".time").innerHTML = "00:00 / 00:00"

}

async function main() {
  await getsongs("Songs");
  playmusic(songs[0], true);
  console.log(songs);

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play()
      play.src = "imgs/pause.svg"
    }
    else {
      currentsong.pause()
      play.src = "imgs/play.svg"
    }
  })

  currentsong.addEventListener("timeupdate", () => {
    /* console.log(currentsong.currentTime ,currentsong.duration); */
    document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    let circle = document.querySelector(".rounded-circle")
    circle.style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    let overlaybar = document.querySelector(".overlaybar")
    overlaybar.style.width =(currentsong.currentTime / currentsong.duration) * 100 + "%";
  })

  /*  document.querySelector(".bar").addEventListener("click",e=>{
         let percent =(e.offsetX/e.target.getBoundingClientRect().width)*100;
         document.querySelector(".rounded-circle").style.left = percent +"%";
         currentsong.currentTime =((currentsong.duration)*percent)/100            
     })  */
  document.querySelector(".bar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".rounded-circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
  })

  // event listener for next and previous
  next.addEventListener("click", () => {
    // console.log("Next clicked")
    // console.log(currentsong.src.split("/").slice(-1))
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if (index < songs.length - 1) {
      playmusic(songs[index + 1])

    }

  })

  // event listener for previous song 
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    // console.log(index)
    if (index > 0) {
      playmusic(songs[index - 1])
    }
  })

  if (currentsong.currentTime == currentsong.duration) {
    play.src = "imgs/pause.svg"
  }
  // event listener for volume 
  document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e.target.value)
    currentsong.volume = e.target.value / 100
    if (currentsong.volume == 0) {
      volume.src = "/imgs/volume-off-stroke-rounded (1).svg"
    }
    else {
      volume.src = "/imgs/volume-high-stroke-rounded.svg"
    }
  })
  volume.addEventListener("click", () => {
    volume.src = "/imgs/volume-off-stroke-rounded (1).svg"
    currentsong.volume = 0;
  })

}
main();