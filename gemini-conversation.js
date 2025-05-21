const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");
require("dotenv").config(); // Using dotenv to load API_KEY from a .env file

//Get API key from https://aistudio.google.com/apikey and save it in a file called .env, in the following format: API_KEY=YOUR_PERSONAL_KEY_VALUE
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Error: API_KEY is not set.");
  console.error(
    "Please create a .env file in the same directory with the content: API_KEY=YOUR_API_KEY"
  );
  process.exit(1);
}

const exitWords = ["quit", "exit", "stop", "goodbye", "bye"]; //Add more exit words if needed

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(API_KEY);

// Choose a Gemini model
const preferredModel = "gemini-2.5-flash-preview-05-20"; // Other options: gemini-2.0-flash, gemini-1.5-flash, etc
const model = genAI.getGenerativeModel({
  model: preferredModel,
});

// Create a chat session
const chat = model.startChat({
  history: [], // You can pre-populate history here if needed
  generationConfig: {
    maxOutputTokens: 1000, // Adjust as needed
  },
});

// Setup readline for command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  `Starting chat with Gemini (model: ${preferredModel}). Type ${exitWords.join(
    ", "
  )} to end the conversation.`
);

// Function to send message and get response
async function sendMessage(message) {
  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini:", text);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Continuous conversation loop
function askQuestion() {
  rl.question("You: ", async (input) => {
    // Check if any of the exitWords are present in the input string
    const shouldExit = exitWords.some((word) =>
      input.toLowerCase().includes(word)
    );

    if (shouldExit) {
      console.log("Ending conversation. Goodbye!");
      rl.close();
      return;
    }

    await sendMessage(input);
    askQuestion(); // Ask for the next input
  });
}

// Start the conversation
askQuestion();
