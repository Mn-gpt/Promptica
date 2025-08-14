async function generatePrompt() {
  const input = document.getElementById('prompt-input').value;
  const resultDiv = document.getElementById('result');
  
  resultDiv.innerText = "جارٍ التوليد...";
  
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt: input })
    });
    
    const data = await response.json();
    resultDiv.innerText = data.candidates[0].content.parts[0].text;
  } catch (error) {
    resultDiv.innerText = "حدث خطأ: " + error.message;
  }
}