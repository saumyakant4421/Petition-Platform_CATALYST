const fileInput = document.getElementById('image');
const fileName = document.querySelector('.file-name');

fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name;
    } else {
        fileName.textContent = 'No file chosen';
    }
});
