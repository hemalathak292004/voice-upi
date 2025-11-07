// Fuzzy string matching for contact names
function fuzzyMatch(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Check for similarity
  let matches = 0;
  const minLen = Math.min(s1.length, s2.length);
  for (let i = 0; i < minLen; i++) {
    if (s1[i] === s2[i]) matches++;
  }
  const similarity = matches / Math.max(s1.length, s2.length);
  return similarity;
}

// Extract name from voice command
export function extractVoiceCommand(text) {
  const regex = /(?:send|pay)\s+(\d+)\s*(?:rupees|rs|₹)?\s*(?:to|ma)?\s*(.+)/i;
  const match = text.match(regex);
  if (!match) return null;
  
  return {
    amount: Number(match[1]),
    name: match[2].trim()
  };
}

// Find matching contacts with similarity scores
export function findMatchingContacts(contacts, searchName) {
  if (!contacts || contacts.length === 0) return [];
  
  const results = contacts.map(contact => {
    const similarity = fuzzyMatch(contact.name, searchName);
    return { contact, similarity };
  })
  .filter(result => result.similarity > 0.3) // Only include similar matches
  .sort((a, b) => b.similarity - a.similarity);
  
  return results;
}

// Store recognition instance to prevent multiple instances
let recognitionInstance = null;

export function startListening(setCommand, processCommand, onComplete) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser. Please use Chrome, Edge, or Safari.");
    return;
  }
  
  // Stop any existing recognition instance
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {
      // Ignore errors when stopping
    }
    recognitionInstance = null;
  }
  
  const recognition = new SpeechRecognition();
  recognitionInstance = recognition;
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  
  // Track if onComplete has been called to avoid multiple calls
  let onCompleteCalled = false;
  const callOnComplete = () => {
    if (!onCompleteCalled && onComplete) {
      onCompleteCalled = true;
      onComplete();
    }
  };
  
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    console.log("Voice command received:", text);
    setCommand(text);
    // Call processCommand with only text parameter
    if (processCommand) {
      processCommand(text);
    }
    // Call onComplete to reset listening state
    callOnComplete();
    recognitionInstance = null;
  };
  
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    recognitionInstance = null;
    
    // Handle specific error cases
    switch(event.error) {
      case 'not-allowed':
        alert("❌ Microphone permission denied. Please allow microphone access in your browser settings and try again.");
        callOnComplete();
        break;
      case 'no-speech':
        alert("❌ No speech detected. Please try again and speak clearly.");
        callOnComplete();
        break;
      case 'audio-capture':
        alert("❌ No microphone found. Please check your microphone connection.");
        callOnComplete();
        break;
      case 'network':
        alert("❌ Network error. Please check your internet connection.");
        callOnComplete();
        break;
      case 'aborted':
        // User cancelled, don't show alert
        console.log("Speech recognition aborted by user");
        callOnComplete();
        break;
      default:
        alert(`❌ Speech recognition error: ${event.error}. Please try again.`);
        callOnComplete();
    }
  };
  
  recognition.onend = () => {
    console.log("Speech recognition ended");
    recognitionInstance = null;
    // Reset listening state if recognition ends without result
    callOnComplete();
  };
  
  try {
    recognition.start();
    console.log("Voice recognition started");
  } catch (error) {
    console.error("Failed to start recognition:", error);
    alert("❌ Failed to start voice recognition. Please try again.");
    recognitionInstance = null;
    callOnComplete();
  }
}
