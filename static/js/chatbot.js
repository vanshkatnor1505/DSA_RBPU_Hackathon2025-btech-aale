        // Mobile menu toggle
        document.querySelector(".mobile-menu").addEventListener("click", () => {
            document.querySelector("nav").classList.toggle("active");
        });

        // Elements
        const chatMessages = document.getElementById("chatMessages");
        const chatInput = document.getElementById("chatInput");
        const sendButton = document.getElementById("sendButton");
        const voiceButton = document.getElementById("voiceButton");
        const voiceStatus = document.getElementById("voiceStatus");
        const voiceStatusText = document.getElementById("voiceStatusText");
        const languageSelect = document.getElementById("languageSelect");
        const statusText = document.getElementById("statusText");

        // Speech Recognition Setup
        let recognition = null;
        let isListening = false;

        // Initialize speech recognition
        function initSpeechRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    isListening = true;
                    voiceButton.classList.add('listening');
                    voiceStatus.style.display = 'flex';
                    voiceStatusText.textContent = getTranslation('listening');
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    chatInput.value = transcript;
                    processMessage(transcript);
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    addMessage(getTranslation('voiceError'), false);
                };

                recognition.onend = () => {
                    isListening = false;
                    voiceButton.classList.remove('listening');
                    voiceStatus.style.display = 'none';
                    statusText.textContent = getTranslation('online');
                };
            } else {
                voiceButton.style.display = 'none';
                addMessage(getTranslation('voiceNotSupported'), false);
            }
        }

        // Language translations for 10 Indian languages
        const translations = {
            en: {
                welcome: "Hello! I'm your CityCare Assistant powered by Groq AI. I can help you with:",
                features: [
                    "Reporting civic issues",
                    "Checking issue status",
                    "Finding city services",
                    "Answering FAQs about city governance",
                    "Providing information about local regulations"
                ],
                prompt: "How can I assist you today?",
                quickReplies: ["Report a pothole", "Garbage schedule", "Pay property tax"],
                placeholder: "Type your message here...",
                listening: "Listening... Speak now",
                online: "Online",
                voiceError: "Sorry, I couldn't understand your voice input. Please try again or type your message.",
                voiceNotSupported: "Voice input is not supported in your browser. Please use text input."
            },
            hi: {
                welcome: "नमस्ते! मैं आपकी CityCare Assistant हूं, Groq AI द्वारा संचालित। मैं आपकी सहायता इनमें कर सकती हूं:",
                features: [
                    "नागरिक मुद्दों की रिपोर्टिंग",
                    "मुद्दे की स्थिति जांचना",
                    "शहर की सेवाएं ढूंढना",
                    "शहर प्रशासन के बारे में FAQs के जवाब",
                    "स्थानीय नियमों की जानकारी देना"
                ],
                prompt: "आज मैं आपकी कैसे सहायता कर सकती हूं?",
                quickReplies: ["गड्ढा रिपोर्ट करें", "कचरा संग्रह समय", "संपत्ति कर भुगतान"],
                placeholder: "अपना संदेश यहाँ टाइप करें...",
                listening: "सुन रहा हूं... बोलिए",
                online: "ऑनलाइन",
                voiceError: "क्षमा करें, मैं आपकी आवाज़ नहीं समझ पाया। कृपया पुनः प्रयास करें या अपना संदेश टाइप करें।",
                voiceNotSupported: "आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया टेक्स्ट इनपुट का उपयोग करें।"
            },
            bn: {
                welcome: "হ্যালো! আমি আপনার CityCare Assistant, Groq AI দ্বারা চালিত। আমি আপনাকে সাহায্য করতে পারি:",
                features: [
                    "নাগরিক সমস্যা রিপোর্ট করা",
                    "সমস্যার অবস্থা পরীক্ষা করা",
                    "শহরের পরিষেবা খুঁজে বের করা",
                    "শহর প্রশাসন সম্পর্কে FAQs উত্তর দেওয়া",
                    "স্থানীয় নিয়ম সম্পর্কে তথ্য প্রদান"
                ],
                prompt: "আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
                quickReplies: ["একটি গর্ত রিপোর্ট করুন", "আবর্জনা সংগ্রহ সময়সূচী", "সম্পত্তি কর প্রদান"],
                placeholder: "আপনার বার্তা এখানে টাইপ করুন...",
                listening: "শুনছি... এখন কথা বলুন",
                online: "অনলাইন",
                voiceError: "দুঃখিত, আমি আপনার ভয়েস ইনপুট বুঝতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন বা আপনার বার্তা টাইপ করুন।",
                voiceNotSupported: "আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। অনুগ্রহ করে টেক্সট ইনপুট ব্যবহার করুন।"
            },
            te: {
                welcome: "హలో! నేను మీ CityCare Assistant, Groq AI ద్వారా నడపబడుతున్నాను. నేను మీకు సహాయం చేయగలను:",
                features: [
                    "పౌర సమస్యలను నివేదించడం",
                    "సమస్య స్థితిని తనిఖీ చేయడం",
                    "నగర సేవలను కనుగొనడం",
                    "నగర పరిపాలన గురించి FAQsకి సమాధానాలు ఇవ్వడం",
                    "స్థానిక నిబంధనల గురించి సమాచారం అందించడం"
                ],
                prompt: "ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
                quickReplies: ["ఒక గుంటను నివేదించండి", "చెత్త సేకరణ షెడ్యూల్", "ఆస్తి పన్ను చెల్లించండి"],
                placeholder: "మీ సందేశాన్ని ఇక్కడ టైప్ చేయండి...",
                listening: "వినడం... ఇప్పుడు మాట్లాడండి",
                online: "ఆన్లైన్",
                voiceError: "క్షమించండి, నేను మీ వాయిస్ ఇన్పుట్ను అర్థం చేసుకోలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి లేదా మీ సందేశాన్ని టైప్ చేయండి.",
                voiceNotSupported: "మీ బ్రౌజర్లో వాయిస్ ఇన్పుట్ మద్దతు లేదు. దయచేసి టెక్స్ట్ ఇన్పుట్ ఉపయోగించండి."
            },
            mr: {
                welcome: "नमस्कार! मी तुमची CityCare Assistant आहे, Groq AI द्वारे चालवली जाते. मी तुम्हाला मदत करू शकते:",
                features: [
                    "नागरी समस्यांची अहवाल देणे",
                    "समस्येची स्थिती तपासणे",
                    "शहर सेवा शोधणे",
                    "शहर प्रशासनाबद्दल FAQs ची उत्तरे देणे",
                    "स्थानिक नियमांबद्दल माहिती देणे"
                ],
                prompt: "आज मी तुम्हाला कशी मदत करू शकते?",
                quickReplies: ["एक खड्डा अहवाल द्या", "कचरा संग्रहण वेळापत्रक", "मालमत्ता कर भरा"],
                placeholder: "आपला संदेश येथे टाइप करा...",
                listening: "ऐकत आहे... आता बोला",
                online: "ऑनलाइन",
                voiceError: "क्षमस्व, मी तुमचा व्हॉइस इनपुट समजू शकलो नाही. कृपया पुन्हा प्रयत्न करा किंवा तुमचा संदेश टाइप करा.",
                voiceNotSupported: "तुमच्या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया टेक्स्ट इनपुट वापरा."
            },
            ta: {
                welcome: "வணக்கம்! நான் உங்கள் CityCare Assistant, Groq AI மூலம் இயக்கப்படுகிறேன். நான் உங்களுக்கு உதவ முடியும்:",
                features: [
                    "குடிமக்கள் பிரச்சினைகளைப் புகாரளித்தல்",
                    "பிரச்சினை நிலையைச் சரிபார்க்கிறது",
                    "நகர சேவைகளைக் கண்டறிதல்",
                    "நகராட்சி நிர்வாகம் பற்றிய FAQs க்கு பதிலளித்தல்",
                    "உள்ளூர் விதிமுறைகள் பற்றிய தகவல்களை வழங்குதல்"
                ],
                prompt: "இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
                quickReplies: ["ஒரு குழியைப் புகாரளிக்கவும்", "குப்பை சேகரிப்பு அட்டவணை", "சொத்து வரி செலுத்தவும்"],
                placeholder: "உங்கள் செய்தியை இங்கே தட்டச்சு செய்க...",
                listening: "கேட்கிறது... இப்போது பேசுங்கள்",
                online: "ஆன்லைன்",
                voiceError: "மன்னிக்கவும், உங்கள் குரல் உள்ளீட்டை என்னால் புரிந்து கொள்ள முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது உங்கள் செய்தியை தட்டச்சு செய்யவும்.",
                voiceNotSupported: "உங்கள் உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. உரை உள்ளீட்டைப் பயன்படுத்தவும்."
            },
            ur: {
                welcome: "ہیلو! میں آپ کی CityCare Assistant ہوں، Groq AI کے ذریعے چلتی ہوں۔ میں آپ کی مدد کر سکتی ہوں:",
                features: [
                    "شہری مسائل کی رپورٹنگ",
                    "مسئلے کی حیثیت چیک کرنا",
                    "شہر کی خدمات تلاش کرنا",
                    "شہری حکومت کے بارے میں FAQs کے جوابات دینا",
                    "مقامی ضوابط کی معلومات فراہم کرنا"
                ],
                prompt: "آج میں آپ کی کس طرح مدد کر سکتی ہوں؟",
                quickReplies: ["گڑھے کی رپورٹ کریں", "کوڑے کرکٹ کا شیڈول", "پراپرٹی ٹیکس ادا کریں"],
                placeholder: "اپنا پیغام یہاں ٹائپ کریں...",
                listening: "سن رہا ہوں... اب بولیں",
                online: "آن لائن",
                voiceError: "معذرت، میں آپ کی وائس ان پٹ کو سمجھ نہیں سکا۔ براہ کرم دوبارہ کوشش کریں یا اپنا پیغام ٹائپ کریں۔",
                voiceNotSupported: "آپ کے براؤزر میں وائس ان پٹ سپورٹڈ نہیں ہے۔ براہ کرم ٹیکسٹ ان پٹ استعمال کریں۔"
            },
            gu: {
                welcome: "હેલો! હું તમારી CityCare Assistant છું, Groq AI દ્વારા સંચાલિત. હું તમારી સહાય કરી શકું છું:",
                features: [
                    "નાગરિક મુદ્દાઓની રિપોર્ટિંગ",
                    "મુદ્દાની સ્થિતિ તપાસવી",
                    "શહેરની સેવાઓ શોધવી",
                    "શહેરી શાસન વિશે FAQs ના જવાબો આપવા",
                    "સ્થાનિક નિયમો વિશે માહિતી પૂરી પાડવી"
                ],
                prompt: "આજે હું તમારી કેવી રીતે સહાય કરી શકું?",
                quickReplies: ["એક ખાડો રિપોર્ટ કરો", "કચરો સંગ્રહ શેડ્યૂલ", "પ્રોપર્ટી ટેક્સ ચૂકવો"],
                placeholder: "તમારો સંદેશ અહીં ટાઇપ કરો...",
                listening: "સાંભળી રહ્યો છું... હવે બોલો",
                online: "ઓનલાઇન",
                voiceError: "માફ કરશો, હું તમારો વ voiceઇસ ઇનપુટ સમજી શક્યો નથી. કૃપા કરીને ફરી પ્રયત્ન કરો અથવા તમારો સંદેશ ટાઇપ કરો.",
                voiceNotSupported: "તમારા બ્રાઉઝરમાં વ voiceઇસ ઇનપુટ સપોર્ટેડ નથી. કૃપા કરીને ટેક્સ્ટ ઇનપુટનો ઉપયોગ કરો."
            },
            kn: {
                welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ CityCare Assistant, Groq AI ಮೂಲಕ ನಡೆಸಲ್ಪಡುತ್ತೇನೆ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:",
                features: [
                    "ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡುವುದು",
                    "ಸಮಸ್ಯೆಯ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸುವುದು",
                    "ನಗರ ಸೇವೆಗಳನ್ನು ಹುಡುಕುವುದು",
                    "ನಗರ ಆಡಳಿತದ ಬಗ್ಗೆ FAQs ಗೆ ಉತ್ತರಿಸುವುದು",
                    "ಸ್ಥಳೀಯ ನಿಯಮಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡುವುದು"
                ],
                prompt: "ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ?",
                quickReplies: ["ಒಂದು ಕುಳಿಯನ್ನು ವರದಿ ಮಾಡಿ", "ಕಸದ ಸಂಗ್ರಹ ವೇಳಾಪಟ್ಟಿ", "ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿಸಿ"],
                placeholder: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
                listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ... ಈಗ ಮಾತನಾಡಿ",
                online: "ಆನ್ಲೈನ್",
                voiceError: "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಧ್ವನಿ ಇನ್ಪುಟ್ ಅನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ.",
                voiceNotSupported: "ನಿಮ್ಮ ಬ್ರೌಸರ್ನಲ್ಲಿ ಧ್ವನಿ ಇನ್ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯ ಇನ್ಪುಟ್ ಬಳಸಿ."
            },
            ml: {
                welcome: "ഹലോ! ഞാൻ നിങ്ങളുടെ CityCare Assistant ആണ്, Groq AI ഉപയോഗിച്ച് പ്രവർത്തിക്കുന്നു. എനിക്ക് നിങ്ങളെ സഹായിക്കാനാകും:",
                features: [
                    "സിവിക് പ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്യുന്നു",
                    "പ്രശ്നത്തിന്റെ നില പരിശോധിക്കുന്നു",
                    "നഗര സേവനങ്ങൾ കണ്ടെത്തുന്നു",
                    "നഗര ഭരണത്തെക്കുറിച്ചുള്ള FAQs-കൾക്ക് ഉത്തരം നൽകുന്നു",
                    "പ്രാദേശിക നിയന്ത്രണങ്ങളെക്കുറിച്ചുള്ള വിവരങ്ങൾ നൽകുന്നു"
                ],
                prompt: "ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?",
                quickReplies: ["ഒരു കുഴി റിപ്പോർട്ട് ചെയ്യുക", "കുപ്പകോശ സമയപ്പട്ടിക", "പ്രോപ്പർട്ടി ടാക്സ് അടയ്ക്കുക"],
                placeholder: "നിങ്ങളുടെ സന്ദേശം ഇവിടെ ടൈപ്പ് ചെയ്യുക...",
                listening: "കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക",
                online: "ഓൺലൈൻ",
                voiceError: "ക്ഷമിക്കണം, നിങ്ങളുടെ വോയ്സ് ഇൻപുട്ട് എനിക്ക് മനസ്സിലാക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക.",
                voiceNotSupported: "നിങ്ങളുടെ ബ്രൗസറിൽ വോയ്സ് ഇൻപുട്ട് പിന്തുണയ്ക്കുന്നില്ല. ടെക്സ്റ്റ് ഇൻപുട്ട് ഉപയോഗിക്കുക."
            }
        };

        // Current language
        let currentLanguage = 'en';

        // Get translation for current language
        function getTranslation(key) {
            return translations[currentLanguage][key] || translations.en[key] || key;
        }

        // Update UI language
        function updateUILanguage(lang) {
            currentLanguage = lang;
            const t = translations[lang] || translations.en;
            
            chatInput.placeholder = t.placeholder;
            statusText.textContent = t.online;
            
            // Update quick replies in welcome message
            const quickReplies = document.querySelector('.quick-replies');
            if (quickReplies) {
                quickReplies.innerHTML = t.quickReplies.map((text, index) => 
                    `<div class="quick-reply" data-question="${text}">${text}</div>`
                ).join('');
                
                // Reattach event listeners
                document.querySelectorAll('.quick-reply').forEach(el => {
                    el.addEventListener('click', () => {
                        const question = el.getAttribute('data-question');
                        if (question) processMessage(question);
                    });
                });
            }
        }

        // Add message to chat window
        function addMessage(text, isUser = false, actions = []) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let messageHTML = `<p>${text}</p>`;
            
            // Add navigation actions if provided
            if (actions.length > 0) {
                messageHTML += '<div class="quick-replies">';
                actions.forEach(action => {
                    messageHTML += `<button class="navigation-action" data-url="${action.url}">${action.text}</button>`;
                });
                messageHTML += '</div>';
            }
            
            messageHTML += `<div class="message-time">${time}</div>`;
            
            messageDiv.innerHTML = messageHTML;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Add event listeners to navigation actions
            if (actions.length > 0) {
                messageDiv.querySelectorAll('.navigation-action').forEach(button => {
                    button.addEventListener('click', () => {
                        const url = button.getAttribute('data-url');
                        if (url) {
                            window.location.href = url;
                        }
                    });
                });
            }
        }

        // Show typing indicator
        function showTypingIndicator() {
            if (!document.getElementById('typingIndicator')) {
                const typingDiv = document.createElement('div');
                typingDiv.className = 'typing-indicator';
                typingDiv.id = 'typingIndicator';
                typingDiv.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
                chatMessages.appendChild(typingDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }

        // Hide typing indicator
        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) typingIndicator.remove();
        }

        // Analyze user intent and provide appropriate response
        function analyzeUserIntent(message) {
            const lowerMessage = message.toLowerCase();
            
            // Navigation intents
            if (lowerMessage.includes('report') || lowerMessage.includes('complaint') || lowerMessage.includes('issue')) {
                return {
                    response: "I can help you report a civic issue! You can file a report directly through our system. Would you like me to take you to the report page?",
                    actions: [
                        { text: "Go to Report Page", url: "/report" },
                        { text: "Learn More", url: "/guide" }
                    ]
                };
            }
            
            if (lowerMessage.includes('track') || lowerMessage.includes('status') || lowerMessage.includes('check')) {
                return {
                    response: "You can track the status of your reported issues in the tracking section. Would you like to view your reports?",
                    actions: [
                        { text: "Track Issues", url: "/track" },
                        { text: "View All Reports", url: "/viewmap" }
                    ]
                };
            }
            
            if (lowerMessage.includes('map') || lowerMessage.includes('view') || lowerMessage.includes('location')) {
                return {
                    response: "The map view shows all reported issues in your area. You can see what others have reported and their current status.",
                    actions: [
                        { text: "View Map", url: "/viewmap" },
                        { text: "Report on Map", url: "/report" }
                    ]
                };
            }
            
            if (lowerMessage.includes('community') || lowerMessage.includes('group') || lowerMessage.includes('forum')) {
                return {
                    response: "Our community section lets you connect with other citizens, join WhatsApp groups, and participate in discussions.",
                    actions: [
                        { text: "Join Community", url: "/community" },
                        { text: "View Forums", url: "/community" }
                    ]
                };
            }
            
            if (lowerMessage.includes('home') || lowerMessage.includes('main') || lowerMessage.includes('dashboard')) {
                return {
                    response: "Taking you back to the main dashboard where you can access all features.",
                    actions: [
                        { text: "Go Home", url: "/" }
                    ]
                };
            }
            
            // Service-specific responses
            if (lowerMessage.includes('pothole') || lowerMessage.includes('road') || lowerMessage.includes('street')) {
                return {
                    response: "For pothole reports, we need the exact location and a photo if possible. You can report it directly through our system.",
                    actions: [
                        { text: "Report Pothole", url: "/report" },
                        { text: "View Road Issues", url: "/viewmap" }
                    ]
                };
            }
            
            if (lowerMessage.includes('garbage') || lowerMessage.includes('waste') || lowerMessage.includes('trash')) {
                return {
                    response: "Garbage collection schedules vary by area. You can check your area's schedule or report missed collections.",
                    actions: [
                        { text: "Check Schedule", url: "/services" },
                        { text: "Report Issue", url: "/report" }
                    ]
                };
            }
            
            if (lowerMessage.includes('water') || lowerMessage.includes('supply') || lowerMessage.includes('pipe')) {
                return {
                    response: "Water supply issues should be reported immediately. We can help you file a report with the water department.",
                    actions: [
                        { text: "Report Water Issue", url: "/report" },
                        { text: "Emergency Contacts", url: "/contacts" }
                    ]
                };
            }
            
            if (lowerMessage.includes('tax') || lowerMessage.includes('payment') || lowerMessage.includes('property')) {
                return {
                    response: "Property tax payments can be made online through our portal. You can also check due dates and payment history.",
                    actions: [
                        { text: "Pay Taxes", url: "/services" },
                        { text: "Payment Options", url: "/guide" }
                    ]
                };
            }
            
            // Default response for other queries
            return {
                response: "I understand you're asking about: '" + message + "'. While I'm powered by AI to help with general queries, for specific city services and reporting, our dedicated sections will give you the best experience. How can I assist you further?",
                actions: [
                    { text: "Report an Issue", url: "/report" },
                    { text: "Track Reports", url: "/track" },
                    { text: "View Community", url: "/community" }
                ]
            };
        }

        // Call chatbot API via backend
        async function callChatAPI(userMessage) {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: userMessage,
                        language: currentLanguage 
                    }),
                });

                if (!response.ok) throw new Error(`Status: ${response.status}`);

                const data = await response.json();
                return data.reply;
            } catch (error) {
                console.error('Chat API error:', error);
                // Fallback to intent analysis if API fails
                const intent = analyzeUserIntent(userMessage);
                return intent;
            }
        }

        // Process user input and get AI response
        async function processMessage(message) {
            if (!message.trim()) return;
            
            addMessage(message, true);
            chatInput.value = '';
            sendButton.disabled = true;
            showTypingIndicator();

            try {
                const aiResponse = await callChatAPI(message);
                
                hideTypingIndicator();
                
                if (typeof aiResponse === 'object') {
                    // Response from intent analysis
                    addMessage(aiResponse.response, false, aiResponse.actions);
                } else {
                    // Response from AI API
                    const intent = analyzeUserIntent(message);
                    addMessage(aiResponse, false, intent.actions);
                }
            } catch (error) {
                hideTypingIndicator();
                const intent = analyzeUserIntent(message);
                addMessage("I'm here to help! " + intent.response, false, intent.actions);
            }
            
            sendButton.disabled = false;
            chatInput.focus();
        }

        // Event listeners
        sendButton.addEventListener('click', () => {
            const msg = chatInput.value.trim();
            if (msg) processMessage(msg);
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const msg = chatInput.value.trim();
                if (msg) processMessage(msg);
            }
        });

        chatInput.addEventListener('input', () => {
            sendButton.disabled = !chatInput.value.trim();
        });

        // Voice input
        voiceButton.addEventListener('click', () => {
            if (!recognition) {
                initSpeechRecognition();
            }
            
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        // Language change
        languageSelect.addEventListener('change', (e) => {
            updateUILanguage(e.target.value);
            if (recognition) {
                recognition.lang = e.target.value;
            }
        });
        // Authentication State Management
        let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
        let isAdmin = localStorage.getItem("isAdmin") === "true" || false;

        // DOM Elements
        const authModal = document.getElementById("authModal");
        const adminModal = document.getElementById("adminModal");
        const loginBtn = document.getElementById("loginBtn");
        const adminLoginBtn = document.getElementById("adminLoginBtn");
        const closeModal = document.getElementById("closeModal");
        const closeAdminModal = document.getElementById("closeAdminModal");
        const authTabs = document.querySelectorAll(".auth-tab");
        const authForms = document.querySelectorAll(".auth-form");
        const loginForm = document.getElementById("loginForm");
        const signupForm = document.getElementById("signupForm");
        const adminLoginForm = document.getElementById("adminLoginForm");
        const switchToSignup = document.getElementById("switchToSignup");
        const switchToLogin = document.getElementById("switchToLogin");
        const switchToUserLogin = document.getElementById("switchToUserLogin");
        const authButtons = document.getElementById("authButtons");
        const userMenu = document.getElementById("userMenu");
        const userAvatar = document.getElementById("userAvatar");
        const avatarInitials = document.getElementById("avatarInitials");
        const dropdownMenu = document.getElementById("dropdownMenu");
        const logoutBtn = document.getElementById("logoutBtn");

        // Initialize authentication state
        function initAuthState() {
            if (currentUser) {
                showUserMenu();
            } else {
                showAuthButtons();
            }
        }

        // Show authentication buttons
        function showAuthButtons() {
            authButtons.style.display = "flex";
            userMenu.style.display = "none";
        }

        // Show user menu
        function showUserMenu() {
            authButtons.style.display = "none";
            userMenu.style.display = "flex";
            
            if (isAdmin) {
                userAvatar.classList.add("admin-avatar");
                avatarInitials.textContent = "A";
            } else {
                userAvatar.classList.remove("admin-avatar");
                avatarInitials.textContent = getInitials(currentUser.name);
            }
        }

        // Get user initials
        function getInitials(name) {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
        }

        // Switch auth tabs
        function switchTab(tabName) {
            // Update tabs
            authTabs.forEach((tab) => {
                tab.classList.toggle("active", tab.dataset.tab === tabName);
            });

            // Update forms
            authForms.forEach((form) => {
                form.classList.toggle("active", form.id === `${tabName}Form`);
            });

            // Update modal title
            document.getElementById("modalTitle").textContent =
                tabName === "login" ? "Welcome Back" : "Join City Care";
        }

        // Handle login
        function handleLogin(event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const rememberMe = document.getElementById("rememberMe").checked;

            // Simple validation
            if (!email || !password) {
                alert("Please fill in all fields");
                return;
            }

            // Simulate API call - replace with actual authentication
            const userData = {
                id: 1,
                name: "John Doe",
                email: email,
                phone: "+1234567890",
                address: "123 Main St, City",
            };

            // Store user data
            currentUser = userData;
            isAdmin = false;
            localStorage.setItem("currentUser", JSON.stringify(userData));
            localStorage.setItem("isAdmin", "false");

            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
            }

            // Close modal and update UI
            authModal.style.display = "none";
            showUserMenu();

            // Show success message
            alert("Successfully logged in! Welcome to City Care.");
        }

        // Handle signup
        function handleSignup(event) {
            event.preventDefault();

            const name = document.getElementById("signupName").value;
            const email = document.getElementById("signupEmail").value;
            const phone = document.getElementById("signupPhone").value;
            const address = document.getElementById("signupAddress").value;
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById(
                "signupConfirmPassword"
            ).value;
            const agreeTerms = document.getElementById("agreeTerms").checked;

            // Validation
            if (!name || !email || !phone || !address || !password || !confirmPassword) {
                alert("Please fill in all fields");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            if (!agreeTerms) {
                alert("Please agree to the Terms of Service and Privacy Policy");
                return;
            }

            // Simulate API call - replace with actual registration
            const userData = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                address: address,
            };

            // Store user data
            currentUser = userData;
            isAdmin = false;
            localStorage.setItem("currentUser", JSON.stringify(userData));
            localStorage.setItem("isAdmin", "false");

            // Close modal and update UI
            authModal.style.display = "none";
            showUserMenu();

            // Show success message
            alert("Account created successfully! Welcome to City Care.");
        }

        // Handle admin login
        function handleAdminLogin(event) {
            event.preventDefault();

            const email = document.getElementById("adminEmail").value;
            const password = document.getElementById("adminPassword").value;
            const secretKey = document.getElementById("adminSecretKey").value;
            const rememberMe = document.getElementById("adminRememberMe").checked;

            // Simple validation
            if (!email || !password || !secretKey) {
                alert("Please fill in all fields");
                return;
            }

            // Check admin credentials (in a real app, this would be a secure API call)
            if (email === "admin@citycare.gov" && password === "admin123" && secretKey === "CITYCARE2023") {
                // Simulate admin user data
                const adminData = {
                    id: 999,
                    name: "City Care Admin",
                    email: email,
                    role: "Administrator"
                };

                // Store admin data
                currentUser = adminData;
                isAdmin = true;
                localStorage.setItem("currentUser", JSON.stringify(adminData));
                localStorage.setItem("isAdmin", "true");

                if (rememberMe) {
                    localStorage.setItem("adminRememberMe", "true");
                }

                // Close modal and update UI
                adminModal.style.display = "none";
                showUserMenu();

                // Show success message
                alert("Admin login successful! Welcome to the City Care Admin Panel.");
            } else {
                alert("Invalid admin credentials. Please try again.");
            }
        }

        // Handle logout
        function handleLogout() {
            currentUser = null;
            isAdmin = false;
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isAdmin");
            showAuthButtons();
            dropdownMenu.classList.remove("active");
            alert("You have been logged out successfully.");
        }

        // Event Listeners
        loginBtn.addEventListener("click", () => {
            authModal.style.display = "block";
            switchTab("login");
        });

        adminLoginBtn.addEventListener("click", () => {
            adminModal.style.display = "block";
        });

        closeModal.addEventListener("click", () => {
            authModal.style.display = "none";
        });

        closeAdminModal.addEventListener("click", () => {
            adminModal.style.display = "none";
        });

        authTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                switchTab(tab.dataset.tab);
            });
        });

        switchToSignup.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab("signup");
        });

        switchToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab("login");
        });

        switchToUserLogin.addEventListener("click", (e) => {
            e.preventDefault();
            adminModal.style.display = "none";
            authModal.style.display = "block";
            switchTab("login");
        });

        loginForm.addEventListener("submit", handleLogin);
        signupForm.addEventListener("submit", handleSignup);
        adminLoginForm.addEventListener("submit", handleAdminLogin);

        userAvatar.addEventListener("click", () => {
            dropdownMenu.classList.toggle("active");
        });

        logoutBtn.addEventListener("click", handleLogout);

        // Close modal when clicking outside
        window.addEventListener("click", (e) => {
            if (e.target === authModal) {
                authModal.style.display = "none";
            }
            
            if (e.target === adminModal) {
                adminModal.style.display = "none";
            }

            // Close dropdown when clicking outside
            if (
                !e.target.closest(".user-dropdown") &&
                dropdownMenu.classList.contains("active")
            ) {
                dropdownMenu.classList.remove("active");
            }
        });

        // Social login handlers (placeholder)
        document.querySelectorAll(".social-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                alert("Social login integration would be implemented here");
            });
        });

        // Add welcome message in different languages
        function showWelcomeMessage() {
            const t = translations[currentLanguage] || translations.en;
            addMessage(t.welcome + '\n\n• ' + t.features.join('\n• ') + '\n\n' + t.prompt, false);
        }

        // Focus input on load
        window.addEventListener('DOMContentLoaded', () => {
            initSpeechRecognition();
            chatInput.focus();
            updateUILanguage('en');
            showWelcomeMessage();
        });

        // Export for global access
        window.chatbot = {
            processMessage,
            addMessage,
            updateUILanguage
        };