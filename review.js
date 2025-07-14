const reviewsData = [
            {
                short: "I was very impressed with the fast and efficient service from the time I inquired online to the time I obtained the bond I needed. The entire process was seamless and professional.",
                full: "I was very impressed with the fast and efficient service from the time I inquired online to the time I obtained the bond I needed. The entire process was seamless and professional. Dexter's expertise really made the difference in getting everything sorted quickly and without any hassle. I would definitely recommend their services to anyone looking for reliable financial assistance. The attention to detail and personalized approach made all the difference in my experience.",
                reviewer: "Lacey",
                rating: 5
            },
            {
                short: "Exceptional service! Dexter made the entire loan process seamless and stress-free. His expertise and attention to detail are truly impressive.",
                full: "Exceptional service! Dexter made the entire loan process seamless and stress-free. His expertise and attention to detail are truly impressive. From the initial consultation to the final paperwork, everything was handled professionally and efficiently. I couldn't have asked for a better experience, and I'm grateful for the personalized attention I received throughout the process. The communication was clear and timely at every step.",
                reviewer: "Marcus Chen",
                rating: 5
            },
            {
                short: "Outstanding customer service and competitive rates. Dexter went above and beyond to ensure I got the best deal possible.",
                full: "Outstanding customer service and competitive rates. Dexter went above and beyond to ensure I got the best deal possible. He took the time to explain all the options available and helped me understand the terms clearly. The communication was excellent throughout, and I felt confident in every decision. This level of service is rare to find these days, and I'm thoroughly impressed with the professionalism and dedication shown.",
                reviewer: "Sarah Johnson",
                rating: 5
            },
            {
                short: "Quick response time and excellent communication throughout the process. Dexter made what could have been complicated very simple.",
                full: "Quick response time and excellent communication throughout the process. Dexter made what could have been complicated very simple. He was always available to answer questions and provided clear guidance at every step. The turnaround time was incredibly fast, and the whole experience exceeded my expectations. I'll definitely be returning for future financial needs and recommending to friends and family.",
                reviewer: "David Lee",
                rating: 5
            }
        ];

        let currentReview = 0;
        let expandedStates = {};

        function generateReviewHTML(review, index) {
            const starsHTML = Array.from({length: review.rating}, () => `
                <span class="star"><svg viewBox="0 0 20 20" fill="#fbbc05" xmlns="http://www.w3.org/2000/svg"><polygon points="10,1.5 12.59,7.36 19,8.09 14,12.67 15.18,19 10,15.77 4.82,19 6,12.67 1,8.09 7.41,7.36"/></svg></span>`).join('');
            // Get initials from reviewer name
            const initials = review.reviewer.split(' ').map(n => n[0]).join('').toUpperCase();
            return `
                <div class="review-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <div class="review-meta">
                        <div class="reviewer-avatar">
                            ${initials}
                            <span class="google-g-badge">
                                <img src="https://theloanconnection.com.sg/wp-content/uploads/2025/07/google-icon-logo-svgrepo-com.svg" alt="Google G" width="18" height="18" style="display:block;" />
                            </span>
                        </div>
                        <div class="reviewer-details">
                            <div class="reviewer-name">${review.reviewer} </div>
                            <div class="stars">${starsHTML}</div>
                        </div>
                    </div>
                    <div class="review-text truncated">
                        ${review.short}
                    </div>
                    <div class="expand-toggle">
                        <span class="expand-text">Read More</span>
                        <svg class="expand-icon" width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            `;
        }

        function generateNavigationHTML() {
            return reviewsData.map((_, index) => 
                `<div class="nav-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
            ).join('');
        }

        function initSlider() {
            const reviewContent = document.getElementById('reviewContent');
            const navigation = document.getElementById('navigation');
            
            reviewContent.innerHTML = reviewsData.map((review, index) => 
                generateReviewHTML(review, index)
            ).join('');
            
            navigation.innerHTML = generateNavigationHTML();
            
            const navDots = document.querySelectorAll('.nav-dot');
            navDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showReview(index);
                });
            });

            addExpandHandlers();
            addCarouselArrows();
        }

        function addExpandHandlers() {
            const reviewItems = document.querySelectorAll('.review-item');
            
            reviewItems.forEach((item) => {
                const expandToggle = item.querySelector('.expand-toggle');
                const index = parseInt(item.dataset.index);
                
                expandToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleExpand(index);
                });
            });
        }

        function toggleExpand(index) {
            const reviewItems = document.querySelectorAll('.review-item');
            const targetItem = reviewItems[index];
            const reviewText = targetItem.querySelector('.review-text');
            const expandToggle = targetItem.querySelector('.expand-toggle');
            const expandText = expandToggle.querySelector('.expand-text');
            
            const isExpanded = expandedStates[index] || false;
            
            if (isExpanded) {
                reviewText.textContent = reviewsData[index].short;
                reviewText.classList.remove('expanded');
                reviewText.classList.add('truncated');
                expandText.textContent = 'Read More';
                expandToggle.classList.remove('expanded');
                expandedStates[index] = false;
            } else {
                reviewText.textContent = reviewsData[index].full;
                reviewText.classList.remove('truncated');
                reviewText.classList.add('expanded');
                expandText.textContent = 'Show Less';
                expandToggle.classList.add('expanded');
                expandedStates[index] = true;
            }
        }

        function addCarouselArrows() {
            const reviewSection = document.querySelector('.review-content');
            if (!reviewSection) return;
            // Remove existing arrows if any
            const oldLeft = document.querySelector('.review-carousel-arrow.left');
            const oldRight = document.querySelector('.review-carousel-arrow.right');
            if (oldLeft) oldLeft.remove();
            if (oldRight) oldRight.remove();
            // Left arrow
            const leftArrow = document.createElement('button');
            leftArrow.className = 'review-carousel-arrow left';
            leftArrow.setAttribute('aria-label', 'Previous review');
            leftArrow.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 16L7 10L13 4" stroke="#052d4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            leftArrow.onclick = function(e) {
                e.stopPropagation();
                showReview((currentReview - 1 + reviewsData.length) % reviewsData.length);
            };
            // Right arrow
            const rightArrow = document.createElement('button');
            rightArrow.className = 'review-carousel-arrow right';
            rightArrow.setAttribute('aria-label', 'Next review');
            rightArrow.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="#052d4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            rightArrow.onclick = function(e) {
                e.stopPropagation();
                showReview((currentReview + 1) % reviewsData.length);
            };
            reviewSection.appendChild(leftArrow);
            reviewSection.appendChild(rightArrow);
        }

        function showReview(index) {
            const reviewItems = document.querySelectorAll('.review-item');
            const navDots = document.querySelectorAll('.nav-dot');
            
            reviewItems.forEach(item => item.classList.remove('active'));
            navDots.forEach(dot => dot.classList.remove('active'));
            
            reviewItems[index].classList.add('active');
            navDots[index].classList.add('active');
            
            currentReview = index;
        }

        document.addEventListener('DOMContentLoaded', () => {
            initSlider();
        });