document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const heroSection = document.getElementById('hero');
    const dashboardSection = document.getElementById('dashboard');
    const startAnalysisBtn = document.getElementById('start-analysis-btn');
    const newScanBtn = document.getElementById('new-scan-btn');
    const homeBtn = document.getElementById('home-btn');
    const uploadZone = document.getElementById('upload-zone');
    const loadingOverlay = document.getElementById('loading-overlay');
    const findingsList = document.getElementById('findings-list');

    // ⚠️ IMPORTANT: Replace this with your actual Gemini API Key from Google AI Studio or GCP
    const GEMINI_API_KEY = "AIzaSyCAOvze0QerAc8qxMrmDPUKeyxP6Gu-U7M";
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const contractInput = document.getElementById('contract-input');
    const riskScoreElement = document.querySelector('.score-number');
    const riskStatusElement = document.querySelector('.risk-status');
    const summaryTextElement = document.querySelector('.summary-text');
    const scoreCircle = document.getElementById('risk-score');
    
    // New UI Elements for Upload
    const fileDropArea = document.getElementById('file-drop-area');
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name-display');

    let uploadedFileMimeType = null;
    let uploadedFileData = null; // Base64 data for PDF/Images

    // Navigation and Transitions
    let terminalInterval;
    const terminalBox = document.getElementById('terminal-box');

    function showLoading() {
        loadingOverlay.classList.remove('hidden');
        if (terminalBox) {
            terminalBox.innerHTML = '<div class="terminal-line">> Booting LexGuard Core...</div>';
            const logs = [
                "> Initiating Extractor Agent...",
                "> Parsing document structure...",
                "> Adversarial Drafter Agent activated.",
                "> Scanning for liability loopholes...",
                "> Cross-referencing against standard consumer law...",
                "> User Advocate Agent analyzing fairness...",
                "> Flagging ambiguous definitions...",
                "> Synthesizing multi-agent consensus...",
                "> Generating risk report..."
            ];
            let i = 0;
            terminalInterval = setInterval(() => {
                if (i < logs.length) {
                    const line = document.createElement('div');
                    line.className = 'terminal-line';
                    line.textContent = logs[i];
                    terminalBox.appendChild(line);
                    terminalBox.scrollTop = terminalBox.scrollHeight;
                    i++;
                }
            }, 600);
        }
    }

    function hideLoading() {
        loadingOverlay.classList.add('hidden');
        if (terminalInterval) clearInterval(terminalInterval);
    }

    function transitionToDashboard() {
        heroSection.classList.remove('active');
        heroSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        dashboardSection.classList.add('active');
    }

    function transitionToHero() {
        dashboardSection.classList.remove('active');
        dashboardSection.classList.add('hidden');
        heroSection.classList.remove('hidden');
        heroSection.classList.add('active');
    }

    // Animated number counter
    function animateCounter(elementId, target) {
        const el = document.getElementById(elementId);
        if (!el) return;
        let current = 0;
        const duration = 1200;
        const stepTime = Math.max(Math.floor(duration / target), 30);
        const timer = setInterval(() => {
            current++;
            el.textContent = current;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, stepTime);
    }

    function populateDashboard(data) {
        // Populate AI Summary
        const aiSummaryContent = document.getElementById('ai-summary-content');
        if (aiSummaryContent) {
            aiSummaryContent.innerHTML = `<p class="ai-summary-text">${data.aiSummary || data.summary || "Summary not provided."}</p>`;
        }

        // Populate Stats Counters with animation
        if (data.stats) {
            animateCounter('stat-total', data.stats.totalClauses || 0);
            animateCounter('stat-dangerous', data.stats.dangerousClauses || 0);
            animateCounter('stat-fair', data.stats.fairClauses || 0);
        }

        // Populate Risk Breakdown Chart
        const chartBars = document.getElementById('chart-bars');
        if (chartBars && data.riskBreakdown) {
            chartBars.innerHTML = '';
            for (const [category, score] of Object.entries(data.riskBreakdown)) {
                let barColor;
                if (score >= 70) barColor = 'var(--danger)';
                else if (score >= 40) barColor = 'var(--warning)';
                else barColor = 'var(--success)';
                
                const barRow = document.createElement('div');
                barRow.className = 'chart-bar-row';
                barRow.innerHTML = `
                    <span class="chart-label">${category}</span>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill" style="--bar-width: ${score}%; --bar-color: ${barColor};"></div>
                    </div>
                    <span class="chart-value" style="color: ${barColor};">${score}%</span>
                `;
                chartBars.appendChild(barRow);
            }
        }

        // Populate findings
        findingsList.innerHTML = '';
        
        // Determine icon color based on risk
        let iconColor, iconBorderColor;
        if (data.riskScore >= 7) {
            iconColor = 'var(--danger)';
            iconBorderColor = 'rgba(255, 51, 102, 0.2)';
        } else if (data.riskScore >= 4) {
            iconColor = 'var(--warning)';
            iconBorderColor = 'rgba(255, 176, 32, 0.2)';
        } else {
            iconColor = 'var(--success)';
            iconBorderColor = 'rgba(0, 230, 118, 0.2)';
        }

        data.findings.forEach(finding => {
            const findingEl = document.createElement('div');
            findingEl.className = 'finding-item';
            findingEl.style.borderLeftColor = iconColor;
            findingEl.style.borderColor = iconBorderColor;
            findingEl.style.borderLeftWidth = '4px';
            findingEl.style.borderLeftStyle = 'solid';
            findingEl.innerHTML = `
                <div class="finding-header">
                    <svg class="warning-icon" style="color: ${iconColor};" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <h4>${finding.title}</h4>
                </div>
                <p class="finding-desc">${finding.description}</p>
                <div class="finding-quote-box">
                    <div class="quote-label">EXACT CLAUSE EXTRACTED:</div>
                    <div class="finding-quote"><span class="highlight-danger">"${finding.quote}"</span></div>
                </div>
            `;
            findingsList.appendChild(findingEl);
        });

        // Populate Improvements (only if high risk)
        const improvementsSection = document.getElementById('improvements-section');
        const improvementsList = document.getElementById('improvements-list');
        
        if (data.riskScore >= 7 && data.improvements && data.improvements.length > 0) {
            improvementsSection.classList.remove('hidden');
            improvementsList.innerHTML = '';
            data.improvements.forEach((imp, index) => {
                const patchEl = document.createElement('div');
                patchEl.className = 'patch-item';
                patchEl.innerHTML = `
                    <div class="patch-timeline-node">
                        <span class="patch-dot-pulse"></span>
                    </div>
                    <div class="patch-terminal-box">
                        <div class="patch-header">
                            <span class="patch-title">LEGAL_PATCH_0${index + 1}.SH</span>
                            <span class="patch-status">READY FOR DEPLOY</span>
                        </div>
                        <div class="patch-terminal-body">
                            <div class="patch-terminal-line">
                                <span class="terminal-prompt">lexguard@negotiator:~$</span>
                                <span class="terminal-command">apply --renegotiate --step=${index + 1}</span>
                            </div>
                            <div class="patch-response">
                                <span class="patch-label">RENEGOTIATION STRATEGY:</span>
                                <p class="patch-text">${imp}</p>
                            </div>
                        </div>
                    </div>
                `;
                improvementsList.appendChild(patchEl);
            });
        } else if (improvementsSection) {
            improvementsSection.classList.add('hidden');
        }
    }

    // Event Listeners
    // --- File Upload Logic ---
    fileDropArea.addEventListener('click', () => fileInput.click());
    
    fileDropArea.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        fileDropArea.classList.add('dragover'); 
    });
    
    fileDropArea.addEventListener('dragleave', () => fileDropArea.classList.remove('dragover'));
    
    fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', function() {
        if (this.files.length) handleFileSelect(this.files[0]);
    });

    async function handleFileSelect(file) {
        fileNameDisplay.textContent = `Processing: ${file.name}...`;
        uploadedFileMimeType = file.type;

        // Handle ZIP files — extract first supported file inside
        if (file.name.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
            try {
                const zip = await JSZip.loadAsync(file);
                const supportedExts = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.csv', '.json', '.doc', '.rtf'];
                let foundFile = null;
                let foundName = null;

                // Search for the first supported file (skip folders & hidden files)
                for (const [name, entry] of Object.entries(zip.files)) {
                    if (entry.dir || name.startsWith('__MACOSX') || name.startsWith('.')) continue;
                    const lowerName = name.toLowerCase();
                    if (supportedExts.some(ext => lowerName.endsWith(ext))) {
                        foundFile = entry;
                        foundName = name;
                        break;
                    }
                }

                if (!foundFile) {
                    // If no known extension, just grab the first non-directory file
                    for (const [name, entry] of Object.entries(zip.files)) {
                        if (!entry.dir && !name.startsWith('__MACOSX') && !name.startsWith('.')) {
                            foundFile = entry;
                            foundName = name;
                            break;
                        }
                    }
                }

                if (!foundFile) {
                    alert("No supported files found inside the ZIP archive.");
                    fileNameDisplay.textContent = "Upload Document";
                    return;
                }

                fileNameDisplay.textContent = `Extracting: ${foundName}...`;
                const blob = await foundFile.async('blob');
                const extractedFileName = foundName.split('/').pop();
                
                // Determine MIME type from extension
                const ext = extractedFileName.toLowerCase().split('.').pop();
                const mimeMap = {
                    'pdf': 'application/pdf', 'png': 'image/png', 'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg', 'txt': 'text/plain', 'csv': 'text/csv',
                    'json': 'application/json', 'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'doc': 'application/msword', 'rtf': 'application/rtf'
                };
                const mime = mimeMap[ext] || 'application/octet-stream';
                const extractedFile = new File([blob], extractedFileName, { type: mime });
                
                // Recursively process the extracted file
                handleFileSelect(extractedFile);
                return;
            } catch (err) {
                console.error("ZIP extraction error:", err);
                alert("Failed to extract files from the ZIP archive.");
                fileNameDisplay.textContent = "Upload Document";
                return;
            }
        }
        
        // Handle Word Docs via Mammoth.js
        if (file.name.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer();
            mammoth.extractRawText({arrayBuffer: arrayBuffer})
                .then(function(result){
                    contractInput.value = result.value;
                    contractInput.disabled = false;
                    uploadedFileData = null;
                    fileNameDisplay.textContent = `Extracted Text from: ${file.name}`;
                })
                .catch(function(err){
                    alert("Error parsing Word document.");
                    console.error(err);
                });
            return;
        }

        // Handle raw text-based files (txt, csv, json, xml, html, rtf, etc.)
        const textTypes = ['text/', 'application/json', 'application/xml', 'application/rtf'];
        const textExts = ['.txt', '.csv', '.json', '.xml', '.html', '.htm', '.rtf', '.md', '.log'];
        const isTextFile = textTypes.some(t => file.type.startsWith(t)) || textExts.some(e => file.name.toLowerCase().endsWith(e));
        
        if (isTextFile) {
            const text = await file.text();
            contractInput.value = text;
            contractInput.disabled = false;
            uploadedFileData = null;
            fileNameDisplay.textContent = `Extracted Text from: ${file.name}`;
            return;
        }

        // Handle PDFs, Images, and all other binary files (Send to Gemini as inlineData)
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result.split(',')[1];
            uploadedFileData = base64Data;
            uploadedFileMimeType = file.type || 'application/octet-stream';
            contractInput.value = `[File attached: ${file.name}]\n\nGemini will analyze the contents of this file.`;
            contractInput.disabled = true;
            fileNameDisplay.textContent = `Attached: ${file.name} (Ready)`;
        };
        reader.readAsDataURL(file);
    }

    // Event Listeners
    startAnalysisBtn.addEventListener('click', async () => {
        const textToAnalyze = contractInput.value.trim();
        if (!textToAnalyze && !uploadedFileData) {
            alert("Please upload a file or paste a contract first.");
            return;
        }

        if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            alert("Please add your Gemini API Key to app.js (line 12) before analyzing.");
            return;
        }

        showLoading();
        
        try {
            let systemPrompt = `You are LexGuard, an adversarial multi-agent AI system that analyzes contracts.
Analyze the provided document or text to detect exploitative clauses, hidden liabilities, and legal ambiguities.
Return the result strictly as a JSON object with this exact structure (no markdown formatting, just raw JSON). Ensure all fields are specific to the actual document provided:
{
  "riskScore": [Number between 1 and 10],
  "riskStatus": "[Short string, e.g., 'High Risk', 'Moderate Risk']",
  "aiSummary": "[A short, punchy 1-2 sentence summary of the biggest dangers and overall fairness.]",
  "stats": {
    "totalClauses": [Number of clauses/sections analyzed],
    "dangerousClauses": [Number of problematic clauses found],
    "fairClauses": [Number of fair/standard clauses]
  },
  "riskBreakdown": {
    "Liability": [Score 0-100],
    "Termination": [Score 0-100],
    "Privacy": [Score 0-100],
    "Compensation": [Score 0-100],
    "IP Rights": [Score 0-100]
  },
  "improvements": [
    "[Write a highly specific, actionable way to rewrite or negotiate the bad clauses found in THIS document]",
    "[Write another highly specific improvement tailored to THIS document]"
  ],
  "findings": [
    {
      "title": "[Title of the dangerous clause]",
      "description": "[Plain english explanation of why it's bad]",
      "quote": "[Direct exact quote from the text]"
    }
  ]
}`;
            // If they pasted text (and didn't attach a base64 file), append the text.
            if (!uploadedFileData && textToAnalyze) {
                systemPrompt += `\n\nText to analyze:\n${textToAnalyze}`;
            }

            const requestParts = [{ text: systemPrompt }];

            // If a PDF or Image is attached, add it to the parts
            if (uploadedFileData) {
                requestParts.push({
                    inlineData: {
                        mimeType: uploadedFileMimeType,
                        data: uploadedFileData
                    }
                });
            }

            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: requestParts
                    }],
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                })
            });

            if (!response.ok) {
                const errorBody = await response.json();
                const errorMessage = errorBody.error ? errorBody.error.message : response.statusText;
                throw new Error("API request failed: " + errorMessage);
            }

            const result = await response.json();
            
            if (!result.candidates || result.candidates.length === 0) {
                console.error("Gemini API returned no candidates:", result);
                throw new Error("The AI returned an empty response. This might be due to safety filters blocking the document.");
            }
            
            if (!result.candidates[0].content || !result.candidates[0].content.parts || result.candidates[0].content.parts.length === 0) {
                console.error("Gemini API blocked content:", result);
                const blockReason = result.candidates[0].finishReason || "Unknown Reason";
                throw new Error(`The AI blocked the response. Reason: ${blockReason}`);
            }

            const rawText = result.candidates[0].content.parts[0].text;
            
            // Clean up the text in case the model returns markdown JSON blocks
            const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData = JSON.parse(jsonString);

            // Update UI with real data (Risk score converted to percentage)
            const percentage = Math.round(parsedData.riskScore * 10);
            riskScoreElement.textContent = percentage;
            riskStatusElement.textContent = parsedData.riskStatus;

            // Update score color based on risk
            scoreCircle.classList.remove('high-risk', 'warning-risk', 'low-risk');
            scoreCircle.style.borderColor = ''; // Clear any inline styles
            riskStatusElement.classList.remove('text-danger', 'text-warning', 'text-success');

            if (parsedData.riskScore >= 7) {
                scoreCircle.classList.add('high-risk');
                riskStatusElement.classList.add('text-danger');
            } else if (parsedData.riskScore >= 4) {
                scoreCircle.classList.add('warning-risk');
                riskStatusElement.classList.add('text-warning');
            } else {
                scoreCircle.classList.add('low-risk');
                riskStatusElement.classList.add('text-success');
            }

            hideLoading();
            transitionToDashboard();
            populateDashboard(parsedData);

        } catch (error) {
            console.error("Analysis error:", error);
            // Show ONLY the exact error so we don't confuse the user
            alert("GOOGLE API ERROR: " + error.message);
            hideLoading();
        }
    });

    newScanBtn.addEventListener('click', () => {
        // Reset state
        uploadedFileData = null;
        uploadedFileMimeType = null;
        contractInput.value = '';
        contractInput.disabled = false;
        fileNameDisplay.textContent = "Upload Document";
        transitionToHero();
    });

    homeBtn.addEventListener('click', () => {
        // Reset state
        uploadedFileData = null;
        uploadedFileMimeType = null;
        contractInput.value = '';
        contractInput.disabled = false;
        fileNameDisplay.textContent = "Upload Document";
        transitionToHero();
    });
});
