document.addEventListener('DOMContentLoaded', function() {
    const loanTypeRadios = document.querySelectorAll('input[name="loanType"]');
    const currentBankGroup = document.getElementById('currentBankGroup');
    const currentBankInput = document.getElementById('currentBank');

    // ✅ Get partner ID from URL
    const params = new URLSearchParams(window.location.search);
    const partnerId = params.get("partner"); // e.g., 'john123'

    // ✅ Create hidden input to store partner ID
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "partnerId";
    hiddenInput.value = partnerId || '';
    document.getElementById("loanForm").appendChild(hiddenInput);

    // Show/hide current bank based on loan type
    loanTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'refinance') {
                currentBankGroup.classList.remove('hidden');
                currentBankInput.required = true;
            } else {
                currentBankGroup.classList.add('hidden');
                currentBankInput.required = false;
                currentBankInput.value = '';
            }
        });
    });

    document.getElementById('loanForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // ✅ SHORTENED MESSAGE - WhatsApp works better with shorter messages
        let message = `Hi! Mortgage inquiry:\n\n`;
        message += `Name: ${data.name}\n`;
        message += `Contact: ${data.contact}\n`;
        message += `Email: ${data.email}\n`;
        message += `Type: ${data.loanType === 'new-loan' ? 'New Loan' : 'Refinance'}\n`;
        message += `Amount: SGD ${parseInt(data.amount).toLocaleString()}\n`;

        if (data.loanType === 'refinance' && data.currentBank) {
            message += `Current Bank: ${data.currentBank}\n`;
        }

        if (partnerId) {
            message += `Partner: ${partnerId}\n`;
        }

        message += `\nPlease help with best rates. Thanks!`;

        // ✅ DEBUGGING
        console.log('Message:', message);
        console.log('Message length:', message.length);

        const encodedMessage = encodeURIComponent(message);
        console.log('Encoded length:', encodedMessage.length);

        // ✅ TRY MULTIPLE APPROACHES
        const whatsappUrl = `https://wa.me/6594657429?text=${encodedMessage}`;
        
        // Method 1: Try direct window.open
        console.log('Opening WhatsApp with URL:', whatsappUrl);
        window.open(whatsappUrl, '_blank');
        
        // Method 2: If that doesn't work, show fallback after 3 seconds
        setTimeout(() => {
            const userResponse = confirm('Did WhatsApp open with the message pre-filled?\n\nClick OK if NO (to copy message instead)');
            if (userResponse) {
                // Copy to clipboard
                navigator.clipboard.writeText(message).then(() => {
                    alert('Message copied to clipboard! Please paste it in WhatsApp manually.');
                }).catch(() => {
                    // Fallback for older browsers
                    prompt('WhatsApp message (copy this):', message);
                });
            }
        }, 3000);
    });

    // FAQ toggle
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('open');
                    item.querySelector('.faq-answer').classList.remove('open');
                }
            });

            faqItem.classList.toggle('open');
            answer.classList.toggle('open');
        });
    });
});


//  Stable text slider functionality
        let currentSlide = 0;
        const totalSlides = 3;
        const reviewCards = document.querySelectorAll('.review-card');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dots = document.querySelectorAll('.dot');

        function updateSlider() {
            // Hide all cards
            reviewCards.forEach((card, index) => {
                card.classList.remove('active');
            });
            
            // Show current card
            reviewCards[currentSlide].classList.add('active');
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Update button states - allow continuous cycling
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateSlider();
        }

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Auto-play functionality
        let autoPlayInterval = setInterval(nextSlide, 6000);

        // Pause auto-play on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        sliderContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextSlide, 6000);
        });

        // Initialize
        updateSlider();