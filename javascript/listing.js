// Handle custom dropdown functionality
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const items = dropdown.querySelectorAll('.dropdown-options li');

    // Toggle dropdown visibility
    selected.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-options').forEach(el => {
            if (el !== options) el.style.display = 'none'; // Close other dropdowns
        });
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });

    // Handle option selection
    items.forEach(item => {
        item.addEventListener('click', () => {
            selected.textContent = item.textContent; // Update selected text
            selected.setAttribute('data-value', item.getAttribute('data-value')); // Store value
            options.style.display = 'none'; // Close dropdown
            items.forEach(i => i.classList.remove('selected')); // Remove selected class
            item.classList.add('selected'); // Add selected class

            // Execute corresponding logic for category or sort dropdown
            const value = item.getAttribute('data-value');
            if (dropdown.id === 'category-dropdown') {
                filterCategory(value);
            } else if (dropdown.id === 'sort-dropdown') {
                sortPetitions(value);
            }
        });
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', e => {
        if (!dropdown.contains(e.target)) {
            options.style.display = 'none';
        }
    });
});

// Filtering logic
function filterCategory(category) {
    if (category) {
        window.location.href = `/listing/${category}`;
    }
}


// Sorting logic
function sortPetitions(order) {
    const category = document.querySelector('#category-dropdown .dropdown-selected').getAttribute('data-value'); // Get selected category
    const petitionsGrid = document.querySelector('.petition-grid'); // Petition grid container

    fetch(`/listing/${category}?sort=${order}`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch sorted petitions.");
            }
            return response.json();
        })
        .then(data => {
            const petitions = data.petitions;

            // Clear existing petitions
            petitionsGrid.innerHTML = '';

            // Render the new sorted petitions
            petitions.forEach(petition => {
                const petitionCard = `
                    <div class="petition-card">
                        <img class="petition-image" src="${petition.image || '/assets/default-image.jpg'}" alt="Petition Image">
                        <h3 class="petition-title">${petition.title}</h3>
                        <p class="petition-supporters">Supporters: ${petition.supporters.length}</p>
                        <p class="petition-author">Author: ${petition.authors[0]}</p>
                        <a href="/petition/${petition._id}" class="sign-btn">Sign Now</a>
                    </div>
                `;
                petitionsGrid.insertAdjacentHTML('beforeend', petitionCard);
            });
        })
        .catch(error => {
            console.error("Error sorting petitions:", error);
        });
}
