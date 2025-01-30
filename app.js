let video;
let spacing = 6;
let recorder, chunks = [];
let isRecording = false;
let canvasElement;
let currentFacingMode = "user"; // Default to front camera
let toggleCameraButton; // Toggle button for switching cameras

function setup() {
  canvasElement = createCanvas(windowWidth, windowHeight);
  canvasElement.parent('canvasContainer'); // Attach to container
  pixelDensity(1);

  // Initialize video capture
  initializeVideo(currentFacingMode);

  // Set up recording
  setupRecorder();

  // Capture button event
  document.getElementById("captureButton").addEventListener("click", capturePhoto);

  // Record button event
  document.getElementById("recordButton").addEventListener("click", toggleRecording);

  // Check for multiple cameras and create toggle button if supported
  checkForMultipleCameras();
}

function draw() {
  background(255);

  push(); // Save current canvas state

  // Mirror the canvas for front camera
  if (currentFacingMode === "user") {
    translate(width, 0); // Move to the right
    scale(-1, 1); // Flip horizontally
  }

  if (video.loadedmetadata) {
    video.loadPixels();

    for (let y = 0; y < video.height; y++) {
      for (let x = 0; x < video.width; x++) {
        let index = (x + y * video.width) * 4;
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        let brightnessValue = (r + g + b) / 3;
        let invertedBrightness = 255 - brightnessValue;
        let diameter = map(invertedBrightness, 50, 255, spacing * 0.1, spacing * 1.5, true);

        fill(0);
        noStroke();
        ellipse(x * spacing, y * spacing, diameter, diameter);
      }
    }
  }

  pop(); // Restore canvas state
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(floor(width / spacing), floor(height / spacing));
}

// Function to initialize the video capture
function initializeVideo(facingMode) {
  if (video) video.remove();

  video = createCapture({
    video: {
      facingMode: facingMode,
    },
  });

  video.size(floor(width / spacing), floor(height / spacing));
  video.hide();
}

// Function to capture and save a photo
function capturePhoto() {
  saveCanvas('captured_image', 'png'); // Save image
  alert('Image saved successfully!'); // Show popup
}

// Set up media recorder for video recording
function setupRecorder() {
  let stream = canvasElement.elt.captureStream(30); // Capture at 30 FPS
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (event) => chunks.push(event.data);
  recorder.onstop = saveRecording;
}

// Start or stop recording
function toggleRecording() {
  let recordButton = document.getElementById("recordButton");

  if (!isRecording) {
    chunks = [];
    recorder.start();
    isRecording = true;
    recordButton.textContent = "⏹ Stop Recording";
  } else {
    recorder.stop();
    isRecording = false;
    recordButton.textContent = "🎥 Start Recording";
  }
}

// Save the recorded video
function saveRecording() {
  let blob = new Blob(chunks, { type: "video/webm" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");

  a.href = url;
  a.download = "recorded_video.webm";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  alert("Video saved successfully!");
}

// Check if multiple cameras are available
function checkForMultipleCameras() {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    if (videoDevices.length > 1) {
      createToggleCameraButton();
    }
  });
}

// Create a button to toggle between front and back cameras
function createToggleCameraButton() {
  toggleCameraButton = createButton("🔄 Toggle Camera");
  toggleCameraButton.position(10, 10); // Adjust position as needed
  toggleCameraButton.style("padding", "10px");
  toggleCameraButton.style("font-size", "16px");
  toggleCameraButton.style("cursor", "pointer");
  toggleCameraButton.style("border-radius", "5px");

  toggleCameraButton.mousePressed(toggleCamera);
}

// Toggle between front and back cameras
function toggleCamera() {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  initializeVideo(currentFacingMode);
}
