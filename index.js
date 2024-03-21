// playlistRows[i] = rows of the ith sheet
  // playlistRows[i][0] = first row of the ith sheet
  var playlistRows = [];
  var currPlaylist = 0;

  // put each of the names into an array
  var names = [];

  // store each found name and speaker for branch
  var branchNames = [];
  var branchSpeakers = [];
  var branchNum = 0;

    // inner variables
  var tracker = $('.tracker');
  var volume = $('.volume');


  // function to initialize the audio tracker
  function trackAudio(node) {
    // Initialize the audio element
    node.volume = 0.8;

    // Init volume slider
    volume.slider({
    range: 'min',
    min: 1,
    max: 100,
    value: 80,
    start: function(event,ui) {},
    slide: function(event, ui) {
        song.volume = ui.value / 100;
    },
    stop: function(event,ui) {},
    });

    // Initialize the tracker slider
    tracker.slider({
      range: 'min',
      min: 0,
      max: node.duration, // Set the max value to the duration of the audio
      start: function(event, ui) {},
      slide: function(event, ui) {
        node.currentTime = ui.value;
      },
      stop: function(event, ui) {}
    });

    // Update the position of the tracker slider as the audio plays
    node.addEventListener('timeupdate', function() {
      var curtime = parseInt(node.currentTime, 10);
      tracker.slider('value', curtime);
    });

  }


//audio player with testing added
function playAudio(url) {
  var audioPlayer = new Audio();
  audioPlayer.addEventListener('canplaythrough', function() {
    audioPlayer.play()
      .then(() => console.log('Audio played successfully'))
      .catch(error => console.error('Error playing audio:', error.message));
  });
  audioPlayer.addEventListener('error', function(event) {
    console.error('Error loading audio:', event);
    var targetElement = event.target || event.srcElement;
    console.log('Target element:', targetElement);
  });

  audioPlayer.src = url;
  audioPlayer.preload = 'auto';
}
var currentlyPlayingIndex = 0;

// document.querySelector('.btn-play-all').addEventListener('click', function() {
//     console.log('Play All button clicked');
//     playAll(); 
// });

function playAll(playlistNum) {
    // check the checkbox
    const checkStatus = document.getElementById("autoplay");
    checkStatus.checked = true;
    // play first thing
    var audioElement = playlistRows[playlistNum][0].cells[6].querySelector("audio");
    audioElement.play();

    trackAudio(audioElement);

    console.log('Play All button clicked for Playlist', playlistNum);

// var audioElements = document.querySelectorAll('.table[data-playlist="' + playlistNum + '"] audio');
//     console.log('Number of audio elements:', audioElements.length);

//     function playAudioWithDelay(audio, delay) {
//         setTimeout(function () {
//             audio.play();
//         }, delay);
//     }

//     function playNextAudio(index) {
//         if (index < audioElements.length - 1) {
//             audioElements[index].addEventListener('ended', function () {
//                 playAudioWithDelay(audioElements[index + 1], 0);
//                 playNextAudio(index + 1);
//             });
//         }
//     }

//     if (audioElements.length > 0) {
//         playAudioWithDelay(audioElements[0], 0);
//         playNextAudio(0);
//     }
}


// pauses all audio in playlistRows[playlist]
function pause(playlist) {
  for(let i = 0; i < playlistRows[playlist].length; i++){
    var audioElement = playlistRows[playlist][i].cells[6].querySelector("audio");
    audioElement.pause();
  }
  // var audioElements = document.querySelectorAll('audio[data-playlist="' + playlist + '"]');
  // audioElements.forEach(function (audio) {
  //   audio.pause();
  // });
}

function playAudioNode(playlist) {
    $('.play').addClass('hidden');
    $('.pause').addClass('visible');

    playAll(playlist);
    //tracker.slider("option", "max", song.duration);   
}
function stopAudio(playlist) {
    $('.play').removeClass('hidden');
    $('.pause').removeClass('visible');

  for(let i = 0; i < playlistRows[playlist].length; i++){
    var audioElement = playlistRows[playlist][i].cells[6].querySelector("audio");
    audioElement.pause();
  }   
}

function playNext(playlistNum, rowNum) {
  // console.error("playNext called");
  const checkStatus = document.getElementById("autoplay");

  // we do auto play
  if(checkStatus.checked == true){
    // just play next row
    if(rowNum < playlistRows[playlistNum].length - 1){
      // console.error("AAAAAAAAAAA");
      var audioElement = playlistRows[playlistNum][rowNum+1].cells[6].querySelector("audio");
      audioElement.currentTime = 0;
      audioElement.play();
    }
    // load in next playlist, play first
    else if(playlistNum < playlistRows.length){
      switchPlaylist(playlistNum + 1); // calls pause on everything in this playlist
      var audioElement = playlistRows[playlistNum+1][0].cells[6].querySelector("audio");
      audioElement.currentTime = 0;
      audioElement.play();
    }
  }
}

  // var audioElements = document.querySelectorAll('.table[data-playlist="' + currPlaylist + '"] audio');
  // if (currentlyPlayingIndex < audioElements.length) {
  //   audioElements[currentlyPlayingIndex].play();
  //   currentlyPlayingIndex++;
  // } else {
  //   currentlyPlayingIndex = 0;
  // }
// }

function skipToNext() {
  var audioElements = document.querySelectorAll('.table[data-playlist="' + currPlaylist + '"] audio');
  audioElements[currentlyPlayingIndex].pause();
  audioElements[currentlyPlayingIndex].currentTime = 0;
  currentlyPlayingIndex++;
  // playNext();
}


// switches playlist from currPlaylist (global) to playlistNum
function switchPlaylist(playlistNum){
  // console.error("currentplaylist " + currPlaylist)

  // set playlist content to display current playlist
  document.getElementById("playlistContent").innerHTML = names[playlistNum];

  // hide current playlist
  for(let i = 0; i < playlistRows[currPlaylist].length; i++){
    playlistRows[currPlaylist][i].style.display = 'none';
  }

  // show selected playlist
  for(let i = 0; i < playlistRows[playlistNum].length; i++){
    playlistRows[playlistNum][i].style.display = 'table-row';
  }

  // TODO: uncomment
  // pause(currPlaylist);

    //var audioElements = document.querySelectorAll('.table[data-playlist="' + currPlaylist + '"] audio');
  //audioElements.forEach(function (audio) {
    //audio.removeEventListener('ended', playNext);
  //});

  currPlaylist = playlistNum;
}

// populate playlist content table
function populatePlayListContentTable(){
  // sets playlist name to loading... until sheets are successfully grabbed
  document.getElementById("playlistContent").innerHTML = "Loading...";

  // calls getAllSheetsValues()) which is in Code.js, stores array of sheets (Nx5 matrices) in sheets
//   google.script.run.withSuccessHandler(function(sheets){

// sheets is returned from getRows, then waits for it to become fulfilled, then runs the stuff inside curly brackets
getRows().then((sheets) => {

    // i dont know why theres 2 of these, but im not gonna change it
  var table = document.getElementsByClassName("table")[0];
  var playlistTable = document.getElementsByClassName("table")[0];

  // get dropdownMenu so we can add to it
  var dropdownMenu = document.getElementsByClassName("dropdown-menu")[0];

  // iterate through each sheet
  for(let j = 0; j < Object.keys(sheets).length; j++){
    let values = sheets[j];
    let sheetName = values[0];

    names.push(sheetName);
    // set playlist content to name of first playlist
    if(j == 0){
      document.getElementById("playlistContent").innerHTML = sheetName;
    }
    // stores all the rows of the current playlist, will be added to playlistRows
    playlistRowsAdd = [];
    
    // add button with correct playlist name to dropdown menu
    let button = document.createElement("button");
    button.setAttribute("class", "dropdown-item");
    button.setAttribute("type", button);
    button.textContent = sheetName;
    button.addEventListener("click", function() {
      // calls switchPlaylist to switch to j, which is this playlists index in playlistRows
      switchPlaylist(j);
    });
    dropdownMenu.appendChild(button);



    // might need to update, because if we include more themes on this page it's nxn
    // iterate through each row of values Nx5 matrix (i think thats what it is)
    for(let i = 2; i < values.length; i++){

      // grab column values from values matrix
      var url = values[i][0];
      var name = values[i][1];
      var speaker = values[i][2];
      var playlistOrder = values[i][3];
      var theme = values[i][4];

      //console.log('Current URL:', url);

      // insert new row into the table
      var row = table.insertRow();
      // add a row
      playlistRowsAdd.push(row);
      // set initial playlist to main one
      if(j != 0){
        row.style.display = 'none';
      }
      var urlSpot = row.insertCell(0);
      var nameSpot = row.insertCell(1);
      var speakerSpot = row.insertCell(2);
      var playlistOrderSpot = row.insertCell(3);
      var themeSpot = row.insertCell(4);
      var delSpot = row.insertCell(5);
      let btnDel = ' <button class="btn btn-outline-danger btn-sm" onclick=" google.script.run.RowDelete('+i+')">Delete</button>';
      //let branchDropdown = ' <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownBranch" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Choose playlist branch </button> ';
      // this is the button that we will play audio from 
      var playButtonCell = row.insertCell(6);
      //playButtonCell.innerHTML = '<audio controls src = ' +url+' ></audio>';
    
      playlistTable.appendChild(row);
      
      //check if normal audio block
       if (speaker !== "" && playlistOrder !== "" && theme !== "") {
        
        // insert actual values into the row
        urlSpot.innerHTML = '<a href="' + url + '">LINK</a>';
        nameSpot.innerHTML = name;
        speakerSpot.innerHTML = speaker;
        playlistOrderSpot.innerHTML = playlistOrder;
        themeSpot.innerHTML = theme;
        delSpot.innerHTML = btnDel;

        playButtonCell.innerHTML = '<audio controls src = ' +url+' ></audio>';
        // add event listener so when playButtonCell ends, check if next row should autoplay
        playButtonCell.querySelector("audio").addEventListener("ended", (event) => {
          console.error(j);
          console.error(i);
          // j = playlist number
          // i-2 = row number
          playNext(j,i-2);
        });

        // playButtonCell.querySelector('audio').setAttribute('data-playlist', j)
        // playButtonCell.innerHTML = '<button class="btn btn-outline-primary btn-sm" onclick="playAudio(\'' + url + '\')">Play</button>';
        //THIS IS THE BUTTON (JAE NOTE)
        // playButtonCell.innerHTML = '<audio controls src="' + url + '"></audio>';
        // playButtonCell.querySelector('audio').setAttribute('data-playlist', j);
      } 

      //check if branch block 
      else if (speaker !== "" && playlistOrder == "" && theme == ""){
        nameSpot.innerHTML = "BRANCHING POINT: " + url;
        //playButtonCell.innerHTML = "Choose playlist branch"

        //dropdown css
        var dropdownButton = document.createElement("button");
        dropdownButton.setAttribute("class", "btn btn-secondary dropdown-toggle");
        dropdownButton.setAttribute("type", "button");
        dropdownButton.setAttribute("data-toggle", "dropdown");
        dropdownButton.setAttribute("aria-haspopup", "true");
        dropdownButton.setAttribute("aria-expanded", "false");
        dropdownButton.textContent = "Choose playlist branch";
          
        //dropdown menu
        var dropdownB = document.createElement("div");
        dropdownB.setAttribute("class", "dropdown-menu");

        let nameDropdownItem = document.createElement("a");
        nameDropdownItem.setAttribute("class", "dropdown-item");
        nameDropdownItem.textContent = name;
        var nameHolder = name;
        //branchNames[branchNum] = name;
        //console.log('dropdown name: ', branchNames[branchNum]);


        nameDropdownItem.addEventListener("click", function() {
            loadData(nameHolder,i);
            //console.log('new name: ', branchNames[branchNum]);
        });

        let speakerDropdownItem = document.createElement("a");
        speakerDropdownItem.setAttribute("class", "dropdown-item");
        speakerDropdownItem.textContent = speaker;
        var speakerHolder = speaker;
        //branchSpeakers[branchNum] = speaker;
        //console.log('dropdown speaker: ', branchSpeakers[branchNum]);

        speakerDropdownItem.addEventListener("click", function() {
            loadData(speakerHolder,i);
            //console.log('new speaker: ', branchSpeakers[branchNum]);
        });

        dropdownB.appendChild(nameDropdownItem);
        dropdownB.appendChild(speakerDropdownItem);

        // add to playButtonCell
        playButtonCell.appendChild(dropdownButton);
        playButtonCell.appendChild(dropdownB);
        
        branchNum++;
      }
      //otherwise, whitespace divider block
      else {
      }
    }
    // add next list of rows
    playlistRows.push(playlistRowsAdd);
  }
  document.querySelector('.btn-play-all').addEventListener('click', function() {
    console.log('Play All button clicked');
    playAll(currPlaylist); // Pass the currPlaylist as an argument
  });
});
}

function loadData(branchName,pos) {

  // calls loadDataFromSheet()) which is in Code.js
  google.script.run.withSuccessHandler(function(data){

    console.log('position: ', pos);
    console.log('sheet: ', branchName);
    updateContentTable(data, pos);

  }).loadDataFromSheet(branchName);
}

function updateContentTable(data, position) {
    var table = document.getElementsByClassName("table")[0];
    var index = 0;

    // iterate over each row of the data
    data.forEach(function(rowData) {
        // create a new row in the table
        var row = table.insertRow(position);

        // populate each cell with data
        rowData.forEach(function(cellData, index) {
            var cell = row.insertCell();
            // format the first cell for URL
            if (index === 0) {
                if (cellData !== '') {
                    cell.innerHTML = '<a href="' + cellData + '">LINK</a>';
                } else {
                    cell.textContent = cellData;
                }
            } else {
                cell.textContent = cellData;
            }
        });

    // add an empty cell for the delete button
    var deleteCell = row.insertCell();
    let btnDel = ' <button class="btn btn-outline-danger btn-sm" onclick=" google.script.run.RowDelete('+ position +')">Delete</button>';
    deleteCell.innerHTML = btnDel; // Empty for now

    // add a cell for the play button
    var playButtonCell = row.insertCell();
    playButtonCell.innerHTML = '<audio controls src="' + data[index] + '"></audio>';

    index++;
    });
}

  // play click
  $('.play').click(function (e) {
      e.preventDefault();
      playAudioNode();
  });
  // pause click
  $('.pause').click(function (e) {
      e.preventDefault();
      stopAudio();
  });

  //used for displaying info on the webpage like navigation and forms
  $(document).ready(function($) {  
            s1 = $(document).find('.screen_home').html();
            var e0 = $(document).find('.screen_data'); 

            e0.html(s1);
            $(document).on('click', '.btn_menu', function(event) {
                event.preventDefault();
                var screen_name = $(this).attr('screen_name');

                $(document).find('.screen_name').html(screen_name);

                if (screen_name == "home") {
                    var s1 = $(document).find('.screen_home').html();
                    e0.html(s1);
                } else if (screen_name == "about") {
                    var s1 = $(document).find('.screen_about').html();
                    e0.html(s1);
                } 
            });

            $(document).on('click', '.btn_send_contact', function(event) {
              
              event.preventDefault();
              var e1 = $(this).closest('.screen_data');
              var a1={
                user_link:e1.find('.user_link').val(),
                file_name:e1.find('.file_name').val(),
                speaker_name:e1.find('.speaker_name').val(),
                user_playlist:e1.find('.user_playlist').val(),
                user_theme:e1.find('.user_theme').val(),
              };
              console.log(a1);

              google.script.run.withSuccessHandler(function(data)
              {      
                if(data.status == "success"){
                }    
              }).AddNewAudio(a1) 
            });

          $(document).on('click', '.btn_send_branch', function(event) {
              
              event.preventDefault();
              var e1 = $(this).closest('.screen_data');
              var a1={
                branch_name:e1.find('.branch_name').val(),
                branchA_name:e1.find('.branchA_name').val(),
                branchB_name:e1.find('.branchB_name').val(),
              };
              console.log(a1);

              google.script.run.withSuccessHandler(function(data)
              {    
                if(data.status == "success"){
                }  
              }).AddNewBranch(a1) 
            });

  });

async function getRows(){
    const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=MStsWWcz1NUJe3z44MggFaVzQtNh7IE6kypAs30vdzmnUCQYaaC2IJLmSDrPhWJ3x737NPVLRfVkjW-WNQpCecL9auC8ckw1m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnIj3_gMMbm9-A8zseuNG5ZNpBR329FMiUeIBycXed-kazm2DFk1bZjm-V-PPpBlqzuBcKsnmi_LPQ2eP8f2htHZjTkxO_ibbyw&lib=MEjNFnfKOm1bUGdxphezfU1RTZmW3_9WJ");
    return await response.json();
}
