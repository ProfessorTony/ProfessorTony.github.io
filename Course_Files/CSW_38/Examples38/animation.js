// 1. Get the canvas and context
const canvas = document.getElementById('animCanvas');
const ctx = canvas.getContext('2d');
const replayBtn = document.getElementById('replayBtn');

// 2. Animation State Configuration
const squareSize = 100;
const cornerRadius = 20;
const speed = 6;

// 3. Dynamic variables
let x = 0; // Starting X position
let y = (canvas.height / 2) - (squareSize / 2); // Center Y vertically
let dx = speed; // Velocity on X axis
let opacity = 1.0; // Starting opacity

// 4. Track the state of the bounce
let hasBounced = false;
let isStopped = false;
let animationFrameId = null;

// 5. Function to reset the animation to its initial state
function resetAnimation() {
x = 50; // Start slightly off the left edge
dx = speed;
opacity = 1.0;
hasBounced = false;
isStopped = false;

if (animationFrameId) cancelAnimationFrame(animationFrameId);
draw();


}

// 6. The main animation loop
function draw() {
// Clear the entire canvas for the new frame
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Set the color and opacity (Tailwind green-500: #22c55e)
ctx.fillStyle = \`rgba(34, 197, 94, \${opacity})\`;

// Draw the rounded square
ctx.beginPath();
if (ctx.roundRect) {
    ctx.roundRect(x, y, squareSize, squareSize, cornerRadius);
} else {
    // Fallback for older browsers
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + squareSize - cornerRadius, y);
    ctx.arcTo(x + squareSize, y, x + squareSize, y + cornerRadius, cornerRadius);
    ctx.lineTo(x + squareSize, y + squareSize - cornerRadius);
    ctx.arcTo(x + squareSize, y + squareSize, x + squareSize - cornerRadius, y + squareSize, cornerRadius);
    ctx.lineTo(x + cornerRadius, y + squareSize);
    ctx.arcTo(x, y + squareSize, x, y + squareSize - cornerRadius, cornerRadius);
    ctx.lineTo(x, y + cornerRadius);
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
}
ctx.fill();

// Update coordinates if the animation hasn't stopped
if (!isStopped) {
    x += dx;

    // Check for the collision with the right wall (the bounce)
    if (x + squareSize >= canvas.width && !hasBounced) {
        x = canvas.width - squareSize; 
        dx = -dx; 
        opacity = 0.5; // Drop to 50% opacity
        hasBounced = true; 
    }

    // Check for collision with the left wall to stop the animation
    if (x <= 50 && hasBounced) {
        x = 50; 
        isStopped = true; 
    }
}

// Request the next frame recursively
animationFrameId = requestAnimationFrame(draw);


}

// 7. Event listener for the replay button
replayBtn.addEventListener('click', resetAnimation);

// 8. Start the animation immediately
resetAnimation();
