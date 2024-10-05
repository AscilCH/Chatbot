let selectedLanguage = 'en'; // Default language

// Handle flag click to change the selected language
document.querySelectorAll('.flag').forEach(flag => {
    flag.addEventListener('click', function () {
        // Remove active class from all flags
        document.querySelectorAll('.flag').forEach(flag => flag.classList.remove('active'));
        // Add active class to the clicked flag
        this.classList.add('active');
        // Set the selected language based on the flag clicked
        selectedLanguage = this.getAttribute('data-lang');
    });
});

document.getElementById('sendBtn').addEventListener('click', async function () {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) return;

    // Display user input
    addChatMessage('user', userInput);

    // Clear the input field immediately after capturing the message
    document.getElementById('userInput').value = '';

    // Send user input to the Vercel serverless function (backend) and get the response
    const aiResponse = await fetchBackendAIResponse(userInput);

    // Display AI response
    addChatMessage('ai', aiResponse);
});

function addChatMessage(sender, message) {
    const messageContainer = document.createElement('div');
    messageContainer.className = sender === 'user' ? 'chat-bubble user' : 'chat-bubble ai';
    messageContainer.textContent = message;

    const chatContainer = document.getElementById('chat-container');
    chatContainer.appendChild(messageContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
}

// Function to fetch AI response from Vercel serverless function
async function fetchBackendAIResponse(userInput) {
    try {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userInput: userInput,
                selectedLanguage: selectedLanguage
            })
        });

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error fetching AI response from backend:', error);
        return "Sorry, I couldn't process your request.";
    }
}
