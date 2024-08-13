// OpenAI API key (make sure this is stored securely in a production environment)
const openaiApiKey = '';

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

    // Send user input to OpenAI API and get the response
    const aiResponse = await fetchOpenAIResponse(userInput);

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

async function fetchOpenAIResponse(userInput) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: `You are a helpful assistant that responds in ${selectedLanguage}.` },
                    { role: 'user', content: userInput }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return "Sorry, I couldn't process your request.";
    }
}
