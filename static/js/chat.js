// Ensure the chatbox scrolls dynamically to the latest message
const chatbox = document.querySelector(".chatbox");
const sendbox = document.querySelector(".sendbox input");
const button = document.querySelector(".sendbox button");

// Simulate bot response
function botResponse() {
  const botMessage = document.createElement("div");
  botMessage.classList.add("message", "bot-message");
  botMessage.innerHTML = `
    <div class="message-bubble">
      <p>Let me check that for you.</p>
    </div>
  `;
  chatbox.appendChild(botMessage);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Ensure the chatbox scrolls dynamically to the latest message
document.addEventListener("DOMContentLoaded", () => {
    const chatbox = document.getElementById("messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const fileResponseContainer = document.querySelector(".file-response");
  
    // Function to add a message to the chatbox
    const addMessage = (content, role) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${role}-message`;
  
      const messageBubble = document.createElement("div");
      messageBubble.className = "message-bubble";
      messageBubble.textContent = content;
  
      messageDiv.appendChild(messageBubble);
      chatbox.appendChild(messageDiv);
      chatbox.scrollTop = chatbox.scrollHeight;
    };
  
    // Function to update the file response container based on metadata
    const updateFileResponse = async (metadata) => {
      fileResponseContainer.innerHTML = ""; // Clear current content
  
      if (!metadata) {
        // Default GIF if no metadata is provided
        fileResponseContainer.innerHTML = `
          <div class="gif-container">
            <img src="static/images/birthday-happy-birthday-ezgif.com-crop.gif" alt="Loading...">
          </div>
        `;
        return;
      }
  
      const { type, path } = metadata;
  
      switch (type) {
        case "text":
          try {
            const response = await fetch(path);
            if (!response.ok) throw new Error("Unable to fetch the text file");
  
            const fileText = await response.text();
            fileResponseContainer.innerHTML = `
            <div class="background-text">
              <div class="bday-card">
                <!-- Top part of the card: image + decorations -->
                <div class="bday-decor--container">
                  <div class="bday-pic"> 
                    <img src="https://images.unsplash.com/photo-1572451479139-6a308211d8be?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2670&q=80">
                  </div>
                  <p class="bday-decor bday-decor--top-right float">🎈</p>
                  <p class="bday-decor bday-decor--top-left spin">🌼</p>
                </div>
  
                <!-- Message (file content) + decoration -->
                <div class="bday-message bday-message--paper">
                  <p>${fileText}</p> 
                  <p class="bday-decor bday-decor--bottom-right zoom-left-in-out">🎉</p>
                </div>
              </div>
              </div>`;
          } catch (error) {
            console.error("Error reading the text file:", error);
            fileResponseContainer.innerHTML = `
              <div class="bday-card">
                <div class="bday-message bday-message--paper">
                  <p>Error: Unable to display the content of the file.</p>
                </div>
              </div>`;
          }
          break;
  
        case "video":
          fileResponseContainer.innerHTML = `
          <div class="background-container">
          <div class="video-container">
            <div class="video-wrapper">
              <video controls class="video-player">
                 <source src="${path}" type="video/${path.split('.').pop()}">
                 Your browser does not support the video tag.
                </video>
                <div class="video-overlay">
                 <button class="play-button" onclick="togglePlayPause()">
                     <i class="fas fa-play"></i>
                 </button>
                 </div>
            </div>
          </div>
        </div>`
        break;
  
        case "audio":
          fileResponseContainer.innerHTML = `
                    <div class="media-controls">
                      <div class="media-buttons">
                        <button class="back-button media-button" label="back">
                          <i class="fas fa-step-backward button-icons"></i>
                          <span class="button-text milli">Back</span>
                        </button>

                        <button class="rewind-button media-button" label="rewind">
                          <i class="fas fa-backward button-icons"></i>
                          <span class="button-text milli">Rewind</span>
                        </button>

                        <button class="play-button media-button" label="play">
                          <i class="fas fa-play button-icons play-icon"></i>
                          <span class="button-text milli">Play</span>
                        </button>

                        <button class="fast-forward-button media-button" label="fast forward">
                          <i class="fas fa-forward button-icons"></i>
                          <span class="button-text milli">Forward</span>
                        </button>

                        <button class="skip-button media-button" label="skip">
                          <i class="fas fa-step-forward button-icons"></i>
                          <span class="button-text milli">Skip</span>
                        </button>
                      </div>
                      <div class="media-progress">
                        <div class="progress-bar-wrapper progress">
                          <div class="progress-bar" id="progress-bar"></div>
                        </div>
                        <div class="progress-time-current milli" id="current-time">00:00</div>
                        <div class="progress-time-total milli" id="total-time">00:00</div>
                      </div>
                      <audio id="audio-player" src="${path}"></audio>
                    </div>`;

                  // Initialize elements after the audio player is added
                  const audioPlayer = document.getElementById("audio-player");
                  const playButton = document.querySelector(".play-button");
                  const playButtonIcon = document.querySelector(".play-icon");
                  const progressBar = document.getElementById("progress-bar");
                  const currentTimeElem = document.getElementById("current-time");
                  const totalTimeElem = document.getElementById("total-time");

                  function togglePlayPauseAudio() {
                    if (audioPlayer.paused) {
                      audioPlayer.play();
                      playButtonIcon.classList.replace("fa-play", "fa-pause");
                    } else {
                      audioPlayer.pause();
                      playButtonIcon.classList.replace("fa-pause", "fa-play");
                    }
                  }

                  function seekForward(seconds) {
                    audioPlayer.currentTime = Math.min(audioPlayer.currentTime + seconds, audioPlayer.duration);
                  }

                  function seekBackward(seconds) {
                    audioPlayer.currentTime = Math.max(audioPlayer.currentTime - seconds, 0);
                  }

                  audioPlayer.addEventListener("timeupdate", () => {
                    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                    progressBar.style.width = `${progress}%`;
                    currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
                  });

                  audioPlayer.addEventListener("loadedmetadata", () => {
                    totalTimeElem.textContent = formatTime(audioPlayer.duration);
                  });

                  function formatTime(seconds) {
                    const minutes = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${minutes}:${secs.toString().padStart(2, "0")}`;
                  }

                  // Attach event listeners to buttons
                  playButton.addEventListener("click", togglePlayPauseAudio);

                  const backButton = document.querySelector(".back-button");
                  const rewindButton = document.querySelector(".rewind-button");
                  const forwardButton = document.querySelector(".fast-forward-button");
                  const skipButton = document.querySelector(".skip-button");

                  backButton.addEventListener("click", () => seekBackward(10));
                  rewindButton.addEventListener("click", () => seekBackward(5));
                  forwardButton.addEventListener("click", () => seekForward(5));
                  skipButton.addEventListener("click", () => seekForward(10));

                  break;
  
        case "image":
          fileResponseContainer.innerHTML = `
            <div class="image-card">
            <div class="image-frame">
              <img src="${path}" class="image-preview" alt="Image Preview">
            </div>
            <div class="image-caption">A Beautiful View</div>
          </div>`;
          break;
  
        default:
          fileResponseContainer.innerHTML = `
            <h2>Unknown File Type</h2>
            <p>Unable to display the file.</p>`;
      }
    };
  
    // Function to send a message and process the response
    const sendMessage = async () => {
      const message = userInput.value.trim();
      if (!message) return;
  
      // Add the user's message to the chat
      addMessage(message, "user");
      userInput.value = "";
  
      // Send the user's message to the server
      try {
        const response = await fetch("/chat_api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
  
        const data = await response.json();
  
        // Handle bot message
        if (data.assistant_message) {
          addMessage(data.assistant_message, "bot");
        }
  
        // Handle file response
        if (data.file_metadata) {
          await updateFileResponse(data.file_metadata);
        } else {
          updateFileResponse(null); // Reset to default GIF if no file
        }
      } catch (err) {
        addMessage("Error connecting to server.", "error");
        updateFileResponse(null); // Reset to default GIF on error
      }
    };
  
    // Event listeners for send button and Enter key
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  });


  // Function to toggle play/pause
function togglePlayPause() {
    const video = document.querySelector('.video-player');
    const playButtonIcon = document.querySelector('.play-button i');
  
    if (video.paused) {
      video.play();
      playButtonIcon.classList.replace('fa-play', 'fa-pause');
    } else {
      video.pause();
      playButtonIcon.classList.replace('fa-pause', 'fa-play');
    }
  }
  
  // Hide overlay when video is playing
  document.querySelector('.video-player').addEventListener('play', () => {
    document.querySelector('.video-overlay').style.display = 'none';
  });
  
  // Show overlay when video is paused
  document.querySelector('.video-player').addEventListener('pause', () => {
    document.querySelector('.video-overlay').style.display = 'flex';
  });
  
  
  