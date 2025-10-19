// Profile Page JavaScript

// Tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;

            // Remove active class from all buttons and panels
            tabBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            tabPanels.forEach(function(p) {
                p.classList.remove('active');
            });

            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(tabName + '-panel').classList.add('active');
        });
    });

    // Profile edit functionality
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const profileForm = document.getElementById('profileForm');
    const formInputs = profileForm.querySelectorAll('input[name], input[type="radio"]');
    const formActions = profileForm.querySelector('.form-actions');

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Enable all inputs
            formInputs.forEach(function(input) {
                if (input.name !== 'email' && input.type !== 'hidden') {
                    input.disabled = false;
                }
            });

            // Show form actions, hide edit button
            formActions.style.display = 'flex';
            editBtn.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // Disable all inputs
            formInputs.forEach(function(input) {
                if (input.name !== 'email') {
                    input.disabled = true;
                }
            });

            // Reset form to original values
            profileForm.reset();

            // Hide form actions, show edit button
            formActions.style.display = 'none';
            editBtn.style.display = 'inline-flex';
        });
    }

    // Password confirmation validation
    const passwordForm = document.querySelector('form[action*="/password"]');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            const newPassword = this.querySelector('input[name="newPassword"]').value;
            const confirmPassword = this.querySelector('input[name="confirmPassword"]').value;

            if (newPassword !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match!');
            }
        });
    }
});

