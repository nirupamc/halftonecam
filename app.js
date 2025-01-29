let video;
let spacing = 4; // Smaller spacing for denser halftone effect

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvasContainer");
    pixelDensity(1);

    video = createCapture(VIDEO);
    video.size(floor(width / spacing), floor(height / spacing));
    video.hide();
}

function draw() {
    background(255); // White background for high contrast

    video.loadPixels();

    for (let y = 0; y < video.height; y++) {
        for (let x = 0; x < video.width; x++) {
            let index = (x + y * video.width) * 4;
            let r = video.pixels[index];
            let g = video.pixels[index + 1];
            let b = video.pixels[index + 2];

            let brightnessValue = (r * 0.3 + g * 0.59 + b * 0.11); // Weighted grayscale for better contrast
            let diameter = map(brightnessValue, 0, 255, spacing * 2, 0, true); // Larger dots for darker areas

            fill(0); // Black dots
            noStroke();
            ellipse(x * spacing, y * spacing, diameter, diameter);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    video.size(floor(width / spacing), floor(height / spacing));
}
