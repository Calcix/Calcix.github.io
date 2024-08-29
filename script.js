// Global variable to store the requestAnimationFrame ID
let animationFrameId;

const character = document.querySelector('#character');
const gameArea = document.querySelector('.game-area');

const frameWidth = 64; // Width of a single frame
const frameHeight = 64; // Height of a single frame

let currentFrame = 0; // Start at the first frame
let moving = false; // To check if the character is moving
let upFrameCount = 0; // To keep track of the current frame for the up movement

// Update the character's sprite based on the row and column
function updateCharacterSprite(rows, columns) {
  if (moving) {
    const row = rows[Math.floor(upFrameCount / columns) % rows.length]; // Rotate between specified rows
    const col = currentFrame % columns; // Calculate column based on current frame
    const xPos = -col * frameWidth;
    const yPos = -row * frameHeight; // Top position of the current row

    character.style.backgroundPosition = `${xPos}px ${yPos}px`;

    // Move to the next frame
    currentFrame = (currentFrame + 1) % columns; // Loop through frames in the row
    upFrameCount++; // Increment the frame count for up movement
  }
}

// Keydown event listener for movement
document.addEventListener('keydown', (event) => {
  const key = event.key; // Store the pressed key
  const step = 10; // Adjust the step size as needed

  // Get the current position of the character
  let top = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  let left = parseInt(window.getComputedStyle(character).getPropertyValue('left'));

  // Update the character's position and sprite based on the key pressed
  if (key === 'ArrowUp') {
    top -= step;
    character.style.top = `${top}px`;
    moving = true;
    updateCharacterSprite([4, 8], 7); // Use rows 4, 8, 12, and 8 columns for up movement
  } else if (key === 'ArrowDown') {
    top += step;
    character.style.top = `${top}px`;
    moving = true;
    updateCharacterSprite([10], 9); // Use row 10, 9 frames for down movement
  } else if (key === 'ArrowLeft') {
    left -= step;
    character.style.left = `${left}px`;
    moving = true;
    updateCharacterSprite([9], 9); // Use row 9, 9 frames for left movement
  } else if (key === 'ArrowRight') {
    left += step;
    character.style.left = `${left}px`;
    moving = true;
    updateCharacterSprite([11], 9); // Use row 11, 9 frames for right movement
  }

  // Prevent the character from moving out of bounds
  top = Math.max(0, Math.min(top, gameArea.offsetHeight - character.offsetHeight));
  left = Math.max(0, Math.min(left, gameArea.offsetWidth - character.offsetWidth));

  // Set the new position of the character
  character.style.top = `${top}px`;
  character.style.left = `${left}px`;

  // Cancel any previous animation frame to avoid multiple animations running
  cancelAnimationFrame(animationFrameId);

  // Update the camera position and animate it
  animationFrameId = requestAnimationFrame(() => moveCamera(left, top));
});

// Keyup event listener to stop the movement
document.addEventListener('keyup', () => {
  moving = false; // Stop the animation when no key is pressed
  // Stop the camera movement animation
  cancelAnimationFrame(animationFrameId);
});

// Function to move the camera smoothly
function moveCamera(left, top) {
  const centerX = -(left - (window.innerWidth / 2) + (character.offsetWidth / 2));
  const centerY = -(top - (window.innerHeight / 2) + (character.offsetHeight / 2));

  gameArea.style.transform = `translate(${centerX}px, ${centerY}px)`;
}

// Center the camera on the character when the page loads
window.addEventListener('load', () => {
  // Get the current position of the character (after it's loaded)
  const top = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  const left = parseInt(window.getComputedStyle(character).getPropertyValue('left'));

  // Center the camera on the character
  moveCamera(left, top);
});

// Adjust the game area and camera on window resize
window.addEventListener('resize', () => {
  // Center the camera on the character after resizing
  const top = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  const left = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  moveCamera(left, top);
});

gameArea.addEventListener('wheel', (event) => {
  event.preventDefault();
});
gameArea.addEventListener('touchmove', (event) => {
  event.preventDefault();
});
