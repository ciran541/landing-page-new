document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5lW59iHS4-QJk41WtTMx25XFKzU-LMla2r5ukqwMBJMKqukVu6PuLfYiUZoZQICs9/exec'; // Replace with your actual URL
    
    // ✅ Get partner ID from URL
    const params = new URLSearchParams(window.location.search);
    const partnerId = params.get("partner"); // e.g., 'john123'

    // ✅ Track QR scan immediately on page load
    trackQRScan();

    // Loan form functionality
    const loanTypeRadios = document.querySelectorAll('input[name="loanType"]');
    const currentBankGroup = document.getElementById('currentBankGroup');
    const currentBankInput = document.getElementById('currentBank');

    // ✅ Create hidden input to store partner ID
    const loanForm = document.getElementById("loanForm");
    if (loanForm) {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "partnerId";
        hiddenInput.value = partnerId || '';
        loanForm.appendChild(hiddenInput);
    }

    // Show/hide current bank based on loan type
    if (loanTypeRadios.length > 0) {
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
    }

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

    // Multi-step form functionality
    const form = document.getElementById('loanForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const progressFill = document.getElementById('progressFill');
    const serviceDropdown = document.getElementById('serviceRequired');
    const loanAmountInput = document.getElementById('loanAmount');

    let currentPage = 1;
    const totalPages = 2;

    // Initialize only if elements exist
    if (progressFill) {
        updateProgress();
    }
    if (currentBankGroup) {
        updateCurrentBankVisibility();
    }

    // Handle service selection change
    if (serviceDropdown) {
        serviceDropdown.addEventListener('change', updateCurrentBankVisibility);
    }

    // Handle loan amount formatting
    if (loanAmountInput) {
        loanAmountInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value) {
                value = parseInt(value).toLocaleString();
            }
            e.target.value = value;
        });
    }

    // ✅ NEW: Function to track QR scan
    function trackQRScan() {
        // Only track if there's a partner ID (indicating QR scan)
        if (!partnerId) {
            return;
        }

        // Check if already tracked in this session to avoid duplicate scans
        const sessionKey = `qr_scan_tracked_${partnerId}`;
        if (sessionStorage.getItem(sessionKey)) {
            return;
        }

        // Get Singapore time (UTC+8)
        const now = new Date();
        const sgOffset = 8 * 60; // minutes
        const localOffset = now.getTimezoneOffset();
        const sgTime = new Date(now.getTime() + (sgOffset + localOffset) * 60000);
        const sgIsoString = sgTime.toISOString().replace('Z', '+08:00');

        const scanData = {
            type: 'scan',
            partnerId: partnerId,
            timestamp: sgIsoString,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            // No form data for scan tracking
            propertyType: '',
            serviceRequired: '',
            currentBank: '',
            loanAmount: '',
            fullName: '',
            phoneNumber: '',
            emailAddress: ''
        };

        // Submit scan tracking data
        submitToGoogleSheets(scanData)
            .then(() => {
                // Mark as tracked in session storage
                sessionStorage.setItem(sessionKey, 'true');
                console.log('QR scan tracked successfully');
            })
            .catch(error => {
                console.error('Failed to track QR scan:', error);
            });
    }

    function updateCurrentBankVisibility() {
        if (!serviceDropdown || !currentBankGroup) return;
        
        const selectedService = serviceDropdown.value;
        const currentBankInput = document.getElementById('currentBank');
        
        if (selectedService === 'new-purchase' || selectedService === '') {
            currentBankGroup.classList.add('hidden');
            if (currentBankInput) {
                currentBankInput.removeAttribute('required');
            }
        } else {
            currentBankGroup.classList.remove('hidden');
            if (currentBankInput) {
                currentBankInput.setAttribute('required', 'required');
            }
        }
    }

    function updateProgress() {
        if (!progressFill) return;
        
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
        const targetPage = document.getElementById(`page${pageNumber}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        currentPage = pageNumber;
        updateProgress();
    }

    function validateCurrentPage() {
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (!currentPageElement) return true;
        
        const requiredFields = currentPageElement.querySelectorAll('[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                field.focus();
                return false;
            }
        }
        
        // Special validation for loan amount
        if (currentPage === 1) {
            const loanAmountElement = document.getElementById('loanAmount');
            const loanAmountError = document.getElementById('loanAmountError');
            if (loanAmountElement) {
                const loanAmountValue = loanAmountElement.value.replace(/[^\d]/g, '');
                if (loanAmountValue && parseInt(loanAmountValue) < 100000) {
                    if (loanAmountError) {
                        loanAmountError.textContent = 'Minimum loan amount is $100,000';
                        loanAmountError.style.display = 'block';
                    }
                    loanAmountElement.focus();
                    return false;
                } else {
                    if (loanAmountError) {
                        loanAmountError.textContent = '';
                        loanAmountError.style.display = 'none';
                    }
                }
            }
        }
        
        return true;
    }

    // Hide error on input or page change
    if (loanAmountInput) {
        loanAmountInput.addEventListener('input', function(e) {
            const loanAmountError = document.getElementById('loanAmountError');
            if (loanAmountError) {
                loanAmountError.textContent = '';
                loanAmountError.style.display = 'none';
            }
        });
    }

    // ✅ UPDATED: Function to collect form data (now includes type)
    function collectFormData() {
        // Get Singapore time (UTC+8)
        const now = new Date();
        const sgOffset = 8 * 60; // minutes
        const localOffset = now.getTimezoneOffset();
        const sgTime = new Date(now.getTime() + (sgOffset + localOffset) * 60000);
        const sgIsoString = sgTime.toISOString().replace('Z', '+08:00');

        const formData = {
            // ✅ NEW: Add type field
            type: 'submit',
            
            // Page 1 data
            propertyType: document.getElementById('propertyType')?.value || '',
            serviceRequired: document.getElementById('serviceRequired')?.value || '',
            currentBank: document.getElementById('currentBank')?.value || '',
            loanAmount: document.getElementById('loanAmount')?.value || '',
            
            // Page 2 data
            fullName: document.getElementById('fullName')?.value || '',
            phoneNumber: document.getElementById('phoneNumber')?.value || '',
            emailAddress: document.getElementById('emailAddress')?.value || '',
            
            // Additional data
            partnerId: partnerId || '',
            timestamp: sgIsoString,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct'
        };
        
        return formData;
    }

    // Function to submit data to Google Sheets (CORS-free approach)
    function submitToGoogleSheets(formData) {
        return new Promise((resolve, reject) => {
            // Create a temporary form
            const tempForm = document.createElement('form');
            tempForm.action = GOOGLE_SCRIPT_URL;
            tempForm.method = 'POST';
            tempForm.style.display = 'none';
            
            // Add all form data as hidden inputs
            Object.keys(formData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = formData[key];
                tempForm.appendChild(input);
            });
            
            // Create iframe for submission
            const iframe = document.createElement('iframe');
            iframe.name = 'submission-iframe';
            iframe.style.display = 'none';
            tempForm.target = 'submission-iframe';
            
            // Set up message listener for iframe response
            const messageListener = function(event) {
                if (event.data && event.data.type === 'formSubmissionComplete') {
                    // Clean up
                    window.removeEventListener('message', messageListener);
                    document.body.removeChild(tempForm);
                    document.body.removeChild(iframe);
                    
                    if (event.data.success) {
                        resolve({ success: true, message: event.data.message });
                    } else {
                        reject(new Error(event.data.message || 'Submission failed'));
                    }
                }
            };
            
            // Add message listener
            window.addEventListener('message', messageListener);
            
            // Handle iframe load (fallback if postMessage doesn't work)
            let loadTimeout;
            iframe.onload = function() {
                // Clear any existing timeout
                if (loadTimeout) {
                    clearTimeout(loadTimeout);
                }
                
                // Set a timeout to resolve if no message is received
                loadTimeout = setTimeout(() => {
                    if (document.body.contains(tempForm)) {
                        window.removeEventListener('message', messageListener);
                        document.body.removeChild(tempForm);
                        document.body.removeChild(iframe);
                        resolve({ success: true, message: 'Form submitted successfully' });
                    }
                }, 2000); // Wait 2 seconds for postMessage
            };
            
            // Handle iframe error
            iframe.onerror = function() {
                window.removeEventListener('message', messageListener);
                if (document.body.contains(tempForm)) {
                    document.body.removeChild(tempForm);
                }
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                reject(new Error('Submission failed'));
            };
            
            // Append elements and submit
            document.body.appendChild(iframe);
            document.body.appendChild(tempForm);
            tempForm.submit();
        });
    }

    // Function to show loading state
    function showLoading(show = true) {
        let overlay = document.querySelector('.loading-overlay');
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'loading-overlay';
                overlay.innerHTML = '<div class="loading-spinner"></div>';
                document.body.appendChild(overlay);
            }
        } else {
            if (overlay) {
                overlay.remove();
            }
        }
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = show;
            submitButton.textContent = show ? 'Submitting...' : 'Submit';
        }
    }

    // Function to show success message
    function showSuccessMessage() {
        const page2 = document.getElementById('page2');
        const successPage = document.getElementById('successPage');
        
        if (page2) {
            page2.classList.remove('active');
        }
        if (successPage) {
            successPage.classList.add('active');
        }
        // Automatically reset form after 2 seconds
        setTimeout(() => {
            resetFormToInitialState();
        }, 2000);
    }

    // Function to show error message
    function showErrorMessage(message = 'An error occurred. Please try again.') {
        // You can customize this to show a proper error UI
        alert(message);
    }

    function resetFormToInitialState() {
        // Hide success page, show page 1
        document.getElementById('successPage').classList.remove('active');
        document.getElementById('page1').classList.add('active');
        // Reset form fields
        if (form) {
            form.reset();
        }
        // Reset progress and step indicators
        currentPage = 1;
        updateProgress();
        // Hide current bank group if needed
        updateCurrentBankVisibility();
    }

    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentPage()) {
                showPage(2);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showPage(1);
        });
    }

    // Form submission for multi-step form
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateCurrentPage()) {
                return;
            }

            // Show loading state
            showLoading(true);

            try {
                // Collect form data
                const formData = collectFormData();
                
                // Submit to Google Sheets
                const result = await submitToGoogleSheets(formData);
                
                if (result.success) {
                    // Show success message
                    showSuccessMessage();
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                showErrorMessage('Failed to submit your application. Please try again.');
            } finally {
                // Hide loading state
                showLoading(false);
            }
        });
    }
});