const reviewsData = [
            {
                short: "Dexter helped us with our refinancing and we couldn't be happier.  He was detailed in his explanations which really shows his experience.",
                full: "Dexter helped us with our refinancing and we couldn't be happier.  He was detailed in his explanations which really shows his experience. Replies were prompt and he went the extra mile to give an assessment of the market for us to make an informed decision. Really glad we connected with him and we'd recommend him in a heartbeat!",
                reviewer: "Jonathan Soon",
                rating: 5
            },
            {
                short: "Dexter has been a great help in our mortgage journey. Especially as a first time home owner, we had many queries. ",
                full: "Dexter has been a great help in our mortgage journey. Especially as a first time home owner, we had many queries.  Dexter was knowledgeable, prompt and thorough in addressing our queries, and provided frequent updates and follow ups. Would definitely recommend his services to anyone looking to purchase their first home or to decouple.",
                reviewer: "Yt Chng",
                rating: 5
            },
            {
                short: "Dexter is not just my mortgage advisor—he is also my trusted go-to expert for my clients’ mortgage needs as well.",
                full: "Dexter is not just my mortgage advisor—he is also my trusted go-to expert for my clients’ mortgage needs as well. I have complete confidence in his ability to provide sound advice, ensuring the best outcomes for those I refer to him. Beyond his unwavering commitment to finding optimal solutions, Dexter upholds the highest standards of professionalism. He is always honest, unbiased, and analytical, tailoring every recommendation to your unique needs and circumstances. His clear and insightful explanations of mortgage rates make the decision-making process effortless and well-informed.",
                reviewer: "Rong Tzuu Lee",
                rating: 5
            },
            {
                short: "2 years ago, we needed to refinance and exit from an unfavourable arrangement. We engaged Dexter as he was referred to us by our neighbour friend.",
                full: "2 years ago, we needed to refinance and exit from an unfavourable arrangement. We engaged Dexter as he was referred to us by our neighbour friend. Dexter diligently helped us within a short timeframe as we were rushing to secure a low fix rate for our refinancing. He was transparent, honest and able to successfully deliver. We’ll definitely speak to you again for our upcoming refinancing!",
                reviewer: "Firdaus Farid",
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