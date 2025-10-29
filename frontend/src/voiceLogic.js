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

export function startListening(setCommand, processCommand, onComplete) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    setCommand(text);
    processCommand(text, onComplete);
  };
  
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    alert(`Speech recognition error: ${event.error}`);
  };
  
  recognition.onend = () => {
    console.log("Speech recognition ended");
  };
  
  recognition.start();
}
