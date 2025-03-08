// helper.js

// Prevent duplicate injections
if (!document.getElementById("chatbot-container")) {
    // Create chatbot container
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    chatbotContainer.innerHTML = `
        <div id="chatbot-header">
            <span>AI Chatbot</span>
            <button id="close-chatbot">X</button>
        </div>
        <div id="chatbot-messages"></div>
        <div id="chatbot-input-container">
            <input type="text" id="chatbot-input" placeholder="Enter your text here..." />
            <label style="color:white; font-size:12px; margin-left:5px;">
                <input type="checkbox" id="explain-checkbox" style="vertical-align: middle;" />
                Explain like I'm 5
            </label>
            <button id="chatbot-send">
                <svg id="send-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
                <span id="spinner" class="spinner"></span>
            </button>
        </div>`;
    document.body.appendChild(chatbotContainer);
  
    // Close chatbot
    const closeChat = document.getElementById("close-chatbot");
    closeChat.addEventListener("click", () => {
      chatbotContainer.style.display = "none";
    });
  
    // Create floating button
    const chatbotButton = document.createElement("button");
    chatbotButton.id = "chatbot-btn";
    chatbotButton.innerText = "Use AI";
    document.body.appendChild(chatbotButton);
  
    // Basic styling for chatbot container (further styling via styles.css)
    chatbotContainer.style.background = "linear-gradient(to bottom, black, #4B0082, #8a2be2)";
    chatbotContainer.style.padding = "15px";
    chatbotContainer.style.borderRadius = "10px";
    chatbotContainer.style.color = "white";
  
    // Toggle chatbot visibility
    chatbotButton.addEventListener("click", () => {
      chatbotContainer.style.display = "block";
    });
  
    // Chat functionality
    const inputField = document.getElementById("chatbot-input");
    const sendButton = document.getElementById("chatbot-send");
    const messagesDiv = document.getElementById("chatbot-messages");
    const explainCheckbox = document.getElementById("explain-checkbox");
  
    // Extract problem details from the page
    function extractDSAProblem() {
      let problemNameElem = document.querySelector(".Header_resource_heading__cpRp1.rubik.fw-bold.mb-0.fs-4");
      let descriptionElem = document.querySelector(".coding_desc__pltWY.problem_paragraph .undefined.markdown-renderer");
      let formatElems = document.querySelectorAll(".coding_input_format__pv9fS.problem_paragraph .undefined.markdown-renderer");
      let sampleElems = document.querySelectorAll(".coding_input_format_container__iYezu.mb-0.flex-grow-1.p-3 .coding_input_format__pv9fS");
      return {
        problemName: problemNameElem ? problemNameElem.innerText : "Unknown Problem",
        description: descriptionElem ? descriptionElem.innerText : "No description available.",
        inputFormat: formatElems[0] ? formatElems[0].innerText : "N/A",
        outputFormat: formatElems[1] ? formatElems[1].innerText : "N/A",
        constraints: formatElems[2] ? formatElems[2].innerText : "N/A",
        sampleInput: sampleElems[0] ? sampleElems[0].innerText : "N/A",
        sampleOutput: sampleElems[1] ? sampleElems[1].innerText : "N/A"
      };
    }
  
    // Generate prompt with an optional "explain like I'm 5" clause
    function generatePrompt(problemData, userQuery, explainLikeIm5) {
      let promptIntro = "";
      if (explainLikeIm5) {
        promptIntro = "Explain this problem as if I'm 5 years old. ";
      }
      return `${promptIntro}You are an expert in Data Structures and Algorithms. Your task is to analyze the given problem and respond based on the user's query using the following rules:
      
  1 **If the user greets → Greet them accordingly.**  
  2 **If the user's question is related to the DSA problem → Provide an answer based on the given problem details.**  
  3 **If the question is unrelated to DSA → Respond with: "I am designed to answer only questions related to DSA problems."**
  
  ---
  
  ### **Problem Details**
  **Problem Name:** ${problemData.problemName}
  
  **Description:**  
  ${problemData.description}
  
  **Input Format:**  
  ${problemData.inputFormat}
  
  **Output Format:**  
  ${problemData.outputFormat}
  
  **Constraints:**  
  ${problemData.constraints}
  
  **Sample Input:**  
  \`\`\`
  ${problemData.sampleInput}
  \`\`\`
  
  **Sample Output:**  
  \`\`\`
  ${problemData.sampleOutput}
  \`\`\`
  
  **User's Question:**  
  ${userQuery ? userQuery : "No specific question provided."}
  
  **Instructions for AI:**  
  - **If greeting detected** → Respond with a friendly greeting.  
  - **If DSA-related query detected** → Answer the query based on the given problem details.  
  - **If unrelated query** → Respond with: "I am designed to answer only questions related to DSA problems."`;
    }
  
    // Chat history using localStorage with a problem-specific key
    const problemIdMatch = window.location.pathname.match(/-(\d+)$/);
    const problemId = problemIdMatch ? problemIdMatch[1] : "default";
    const storageKey = `chat_${problemId}`;
    let chatHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
  
    // Load previous chat history
    chatHistory.forEach(({ sender, text }) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = sender === "user" ? "message user-message" : "message bot-message";
      messageDiv.innerText = text;
      messagesDiv.appendChild(messageDiv);
    });
  
    function scrollToBottom() {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    window.onload = scrollToBottom;
  
    async function sendMessage() {
      const text = inputField.value.trim();
      if (!text) return;
      scrollToBottom();
  
      // Check if "Explain like I'm 5" is enabled
      const explainFlag = explainCheckbox.checked;
  
      let userQuery = text;
      let problemData = extractDSAProblem();
      let prompt = generatePrompt(problemData, userQuery, explainFlag);
      console.log("Generated Prompt:", prompt);
  
      // Hide send icon and show spinner
      document.getElementById("send-icon").style.display = "none";
      document.getElementById("spinner").style.display = "inline-block";
  
      // Append user message to chat
      const userMessage = document.createElement("div");
      userMessage.className = "message user-message";
      userMessage.innerText = text;
      messagesDiv.appendChild(userMessage);
      inputField.value = "";
      // Uncheck the explain checkbox after sending
      explainCheckbox.checked = false;
  
      chatHistory.push({ sender: "user", text });
      localStorage.setItem(storageKey, JSON.stringify(chatHistory));
  
      try {
        // Retrieve API key from chrome.storage
        const apiKey = await new Promise((resolve, reject) => {
          chrome.storage.sync.get("gemini_api_key", (data) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(data.gemini_api_key);
            }
          });
        });
        if (!apiKey) throw new Error("API key not found in storage");
  
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }]
              }
            ]
          })
        });
  
        const data = await response.json();
        const botText = (data.candidates &&
                         data.candidates[0] &&
                         data.candidates[0].content.parts[0].text)
                          ? data.candidates[0].content.parts[0].text
                          : "No response";
        
        // Append bot response
        const botMessage = document.createElement("div");
        botMessage.className = "message bot-message";
        botMessage.innerText = botText;
        messagesDiv.appendChild(botMessage);
  
        chatHistory.push({ sender: "bot", text: botText });
        localStorage.setItem(storageKey, JSON.stringify(chatHistory));
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      } catch (error) {
        console.error("Error fetching response:", error);
      } finally {
        // Restore send icon and hide spinner
        document.getElementById("send-icon").style.display = "inline-block";
        document.getElementById("spinner").style.display = "none";
      }
    }
  
    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  
    // (Optional) Additional inline CSS can be appended here if necessary
    const style = document.createElement("style");
    style.innerHTML = `
      /* Additional styles for the chatbot can be added here */
    `;
    document.head.appendChild(style);
  }
  