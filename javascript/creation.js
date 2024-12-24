const fileInput = document.getElementById('image');
const fileName = document.querySelector('.file-name');

fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name;
    } else {
        fileName.textContent = 'No file chosen';
    }
});

    document.addEventListener('DOMContentLoaded', () => {
        const titleInput = document.querySelector('input[name="title"]');
        const charLimit = 75;
        
        // Create a small element to display remaining characters
        const charCountDisplay = document.createElement('p');
        charCountDisplay.style.color = '#666';
        charCountDisplay.style.fontSize = '0.9rem';
        charCountDisplay.style.marginTop = '5px';
        charCountDisplay.textContent = `0/${charLimit} characters used.`;
        titleInput.parentNode.appendChild(charCountDisplay);

        // Update character count on input
        titleInput.addEventListener('input', () => {
            const currentLength = titleInput.value.length;
            charCountDisplay.textContent = `${currentLength}/${charLimit} characters used.`;
        });
    });
