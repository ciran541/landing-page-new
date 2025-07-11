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


// //  Stable text slider functionality
//         let currentSlide = 0;
//         const totalSlides = 3;
//         const reviewCards = document.querySelectorAll('.review-card');
//         const prevBtn = document.getElementById('prevBtn');
//         const nextBtn = document.getElementById('nextBtn');
//         const dots = document.querySelectorAll('.dot');

//         function updateSlider() {
//             // Hide all cards
//             reviewCards.forEach((card, index) => {
//                 card.classList.remove('active');
//             });
            
//             // Show current card
//             reviewCards[currentSlide].classList.add('active');
            
//             // Update dots
//             dots.forEach((dot, index) => {
//                 dot.classList.toggle('active', index === currentSlide);
//             });
            
//             // Update button states - allow continuous cycling
//             prevBtn.disabled = false;
//             nextBtn.disabled = false;
//         }

//         function nextSlide() {
//             currentSlide = (currentSlide + 1) % totalSlides;
//             updateSlider();
//         }

//         function prevSlide() {
//             currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
//             updateSlider();
//         }

//         function goToSlide(slideIndex) {
//             currentSlide = slideIndex;
//             updateSlider();
//         }

//         // Event listeners
//         nextBtn.addEventListener('click', nextSlide);
//         prevBtn.addEventListener('click', prevSlide);

//         dots.forEach((dot, index) => {
//             dot.addEventListener('click', () => goToSlide(index));
//         });

//         // Auto-play functionality
//         let autoPlayInterval = setInterval(nextSlide, 6000);

//         // Pause auto-play on hover
//         const sliderContainer = document.querySelector('.slider-container');
//         sliderContainer.addEventListener('mouseenter', () => {
//             clearInterval(autoPlayInterval);
//         });

//         sliderContainer.addEventListener('mouseleave', () => {
//             autoPlayInterval = setInterval(nextSlide, 6000);
//         });

//         // Initialize
//         updateSlider();

const form = document.getElementById('loanForm');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const progressFill = document.getElementById('progressFill');
        const currentBankGroup = document.getElementById('currentBankGroup');
        const serviceDropdown = document.getElementById('serviceRequired');
        const loanAmountInput = document.getElementById('loanAmount');

        let currentPage = 1;
        const totalPages = 2;

        // Initialize
        updateProgress();
        updateCurrentBankVisibility();

        // Handle service selection change
        serviceDropdown.addEventListener('change', updateCurrentBankVisibility);

        // Handle loan amount formatting
        loanAmountInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value) {
                value = parseInt(value).toLocaleString();
            }
            e.target.value = value;
        });

        function updateCurrentBankVisibility() {
            const selectedService = serviceDropdown.value;
            if (selectedService === 'new-purchase' || selectedService === '') {
                currentBankGroup.classList.add('hidden');
                document.getElementById('currentBank').removeAttribute('required');
            } else {
                currentBankGroup.classList.remove('hidden');
                document.getElementById('currentBank').setAttribute('required', 'required');
            }
        }

        function updateProgress() {
            const progress = (currentPage / totalPages) * 100;
            progressFill.style.width = `${progress}%`;
            
            // Update step indicators
            document.querySelectorAll('.step').forEach((step, index) => {
                if (index + 1 <= currentPage) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        }

        function showPage(pageNumber) {
            document.querySelectorAll('.form-page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(`page${pageNumber}`).classList.add('active');
            currentPage = pageNumber;
            updateProgress();
        }

        function validateCurrentPage() {
            const currentPageElement = document.getElementById(`page${currentPage}`);
            const requiredFields = currentPageElement.querySelectorAll('[required]');
            
            for (let field of requiredFields) {
                if (!field.value.trim()) {
                    field.focus();
                    return false;
                }
            }
            
            // Special validation for loan amount
            if (currentPage === 1) {
                const loanAmountValue = document.getElementById('loanAmount').value.replace(/[^\d]/g, '');
                if (loanAmountValue && parseInt(loanAmountValue) < 100000) {
                    alert('Minimum loan amount is $100,000');
                    return false;
                }
            }
            
            return true;
        }

        nextBtn.addEventListener('click', () => {
            if (validateCurrentPage()) {
                showPage(2);
            }
        });

        prevBtn.addEventListener('click', () => {
            showPage(1);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateCurrentPage()) {
                // Simulate form submission
                setTimeout(() => {
                    document.getElementById('page2').classList.remove('active');
                    document.getElementById('successPage').classList.add('active');
                }, 500);
            }
        });
        

        // Review slider functionality
        class ReviewSlider {
            constructor() {
                this.currentSlide = 0;
                this.slides = document.querySelectorAll('.review-item');
                this.dots = document.querySelectorAll('.control-dot');
                this.totalSlides = this.slides.length;
                this.autoSlideInterval = null;
                
                this.init();
            }
            
            init() {
                // Add click event listeners to dots
                this.dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        this.goToSlide(index);
                    });
                });
                
                // Start auto-slide
                this.startAutoSlide();
                
                // Pause auto-slide on hover
                const container = document.querySelector('.review-slider-container');
                container.addEventListener('mouseenter', () => this.pauseAutoSlide());
                container.addEventListener('mouseleave', () => this.startAutoSlide());
            }
            
            goToSlide(index) {
                // Remove active class from current slide and dot
                this.slides[this.currentSlide].classList.remove('active');
                this.dots[this.currentSlide].classList.remove('active');
                
                // Update current slide
                this.currentSlide = index;
                
                // Add active class to new slide and dot
                this.slides[this.currentSlide].classList.add('active');
                this.dots[this.currentSlide].classList.add('active');
            }
            
            nextSlide() {
                const nextIndex = (this.currentSlide + 1) % this.totalSlides;
                this.goToSlide(nextIndex);
            }
            
            startAutoSlide() {
                this.autoSlideInterval = setInterval(() => {
                    this.nextSlide();
                }, 5000); // Change slide every 5 seconds
            }
            
            pauseAutoSlide() {
                if (this.autoSlideInterval) {
                    clearInterval(this.autoSlideInterval);
                    this.autoSlideInterval = null;
                }
            }
        }
        
        // Initialize the slider when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new ReviewSlider();
        });