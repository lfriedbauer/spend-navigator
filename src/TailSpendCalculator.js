import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Info, Check, Mail, Link2, Calendar, Sun, Moon, HelpCircle } from 'lucide-react';
import { INDUSTRY_ESTIMATES, INDUSTRY_OPTIONS } from './data/industryEstimates';
import './TailSpendCalculator.css';

const TailSpendCalculator = () => {
  const [operatingExpenses, setOperatingExpenses] = useState(50);
  const [industry, setIndustry] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessment, setAssessment] = useState({
    explainPurchases: null,
    consultantFindings: null,
    procurementAutomated: null
  });
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [customSavings, setCustomSavings] = useState({
    conservative: null,
    moderate: null,
    aggressive: null
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Refs for focus management
  const modalRef = useRef(null);
  
  // Real-time counter states
  const [startTime, setStartTime] = useState(Date.now());
  const [resultViewTime, setResultViewTime] = useState(null);
  const [counterStarted, setCounterStarted] = useState(false);
  const [lostAmount, setLostAmount] = useState(0);
  // const [roiAmount, setRoiAmount] = useState(0); // Reserved for future use
  const [frozenLostAmount, setFrozenLostAmount] = useState(null);

  // URL parameter support for sharing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const opex = params.get('opex');
    const ind = params.get('industry');

    if (opex) setOperatingExpenses(Number(opex));
    if (ind) setIndustry(ind);
  }, []);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Simple analytics tracking
  const trackEvent = (event, properties = {}) => {
    // Local storage tracking
    const events = JSON.parse(localStorage.getItem('tail_spend_events') || '[]');
    events.push({
      event,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem('session_id') || Math.random().toString(36)
    });
    localStorage.setItem('tail_spend_events', JSON.stringify(events.slice(-100)));
    
    // Ready for Google Analytics if added
    if (window.gtag) {
      window.gtag('event', event, properties);
    }
  };

  const questions = [
    "Can you explain all purchases under $10K to the board?",
    "Would a consultant find unmanaged spend?", 
    "Is procurement still managed in Excel?"
  ];

  const calculations = useMemo(() => {
    const expensesInMillions = operatingExpenses;
    const industryData = industry ? INDUSTRY_ESTIMATES[industry] : null;
    const multiplier = industryData ? industryData.indirectSpendRate : 0.20;
    const indirectSpend = expensesInMillions * multiplier;
    const tailSpend = indirectSpend * 0.20;
    
    // Count GOOD answers for HIGH maturity:
    // Q1: Can explain purchases? YES = good (you have visibility)
    // Q2: Would consultant find unmanaged spend? NO = good (well-managed)  
    // Q3: Is procurement in Excel? NO = good (automated, not manual)
    const goodAnswers = 
      (assessment.explainPurchases === true ? 1 : 0) +     // YES = visibility
      (assessment.consultantFindings === false ? 1 : 0) +  // NO = well-managed
      (assessment.procurementAutomated === false ? 1 : 0); // NO = automated
    
    // Check if assessment was actually completed (at least one answer provided)
    const assessmentCompleted = Object.values(assessment).some(val => val !== null);
    // Low maturity if 0-1 good answers (high maturity if 2-3 good answers)
    const isLowMaturity = assessmentCompleted ? goodAnswers <= 1 : false;
    
    // Calculate scenarios first
    const scenarios = {
      conservative: customSavings.conservative !== null 
        ? tailSpend * (customSavings.conservative / 100)
        : tailSpend * (isLowMaturity ? 0.10 : 0.05),
      moderate: customSavings.moderate !== null
        ? tailSpend * (customSavings.moderate / 100)
        : tailSpend * (isLowMaturity ? 0.15 : 0.10),
      aggressive: customSavings.aggressive !== null
        ? tailSpend * (customSavings.aggressive / 100)
        : tailSpend * (isLowMaturity ? 0.20 : 0.15)
    };
    
    // Breakdown should be components of the AGGRESSIVE scenario, not some higher number
    const savingsSources = {
      supplierConsolidation: scenarios.aggressive * 0.35,  // 35% of aggressive
      maverickSpendControl: scenarios.aggressive * 0.25,   // 25% of aggressive
      contractCompliance: scenarios.aggressive * 0.22,     // 22% of aggressive
      processAutomation: scenarios.aggressive * 0.18       // 18% of aggressive
    };
    
    return {
      operatingExpenses: expensesInMillions,
      industry,
      indirectSpend,
      tailSpend,
      lowMaturity: isLowMaturity,
      scenarios,
      savingsSources
    };
  }, [operatingExpenses, industry, assessment, customSavings]);

  // Add calculations for real-time counters
  const perHourLoss = useMemo(() => {
    if (!industry) return 0;
    const annualOpportunityCost = calculations.scenarios.conservative || 0;
    return annualOpportunityCost * 1000000 / (365 * 24);
  }, [calculations.scenarios.conservative, industry]);
  
  const perSecondLoss = useMemo(() => {
    return perHourLoss / 3600;
  }, [perHourLoss]);

  const perSecondROI = useMemo(() => {
    if (!industry) return 0;
    const annualROI = calculations.scenarios.moderate || 0;
    const implementationMultiplier = 2; // 2x for focused implementation (more realistic)
    return (annualROI * implementationMultiplier * 1000000) / (365 * 24 * 60 * 60);
  }, [calculations.scenarios.moderate, industry]);

  const catchUpTime = useMemo(() => {
    if (!frozenLostAmount || perSecondROI <= perSecondLoss) return null;
    const catchUpSeconds = frozenLostAmount / (perSecondROI - perSecondLoss);
    const days = Math.ceil(catchUpSeconds / 86400);
    return {
      value: days,
      text: days === 1 ? 'day' : 'days'
    };
  }, [frozenLostAmount, perSecondROI, perSecondLoss]);

  // Start counter immediately when industry is selected
  useEffect(() => {
    if (!industry) return;
    setCounterStarted(true);
    setStartTime(Date.now());
  }, [industry]);

  // Update counters more frequently
  useEffect(() => {
    if (!counterStarted) return;
    
    const interval = setInterval(() => {
      const secondsElapsed = (Date.now() - startTime) / 1000;
      
      if (!showResults) {
        setLostAmount(secondsElapsed * perSecondLoss);
      } else if (frozenLostAmount === null) {
        setFrozenLostAmount(lostAmount);
        setResultViewTime(Date.now());
      }
      
      if (showResults && resultViewTime) {
        // const roiSeconds = (Date.now() - resultViewTime) / 1000;
      }
    }, 1000); // Update every second for smoother counting
    
    return () => clearInterval(interval);
  }, [counterStarted, perSecondLoss, perSecondROI, startTime, showResults, resultViewTime, lostAmount, frozenLostAmount]);

  // Debounced slider handler to prevent rapid updates
  const [sliderValue, setSliderValue] = useState(operatingExpenses);
  
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
  };
  
  // Debounce the actual state update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sliderValue !== operatingExpenses) {
        setOperatingExpenses(sliderValue);
        if (showResults) {
          showToast("Scenarios updated");
        }
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [sliderValue]);

  const handleGetEstimate = () => {
    if (!industry) {
      showToast("Please select an industry first", "error");
      return;
    }
    
    // Reset assessment when opening to ensure clean slate
    setAssessment({
      explainPurchases: null,
      consultantFindings: null,
      procurementAutomated: null
    });
    
    setShowAssessment(true);
    
    // Track analytics
    trackEvent('maturity_assessment_opened', {
      industry,
      operatingExpenses
    });
  };


  const handleSkipAssessment = () => {
    // Reset assessment to ensure clean state when skipping
    setAssessment({
      explainPurchases: null,
      consultantFindings: null,
      procurementAutomated: null
    });
    setShowAssessment(false);
    setShowResults(true);
  };

  const handleCopyLink = async () => {
    try {
      const params = new URLSearchParams({
        opex: operatingExpenses.toString(),
        industry: industry
      });
      const shareUrl = `${window.location.origin}?${params.toString()}`;
      
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard");
    } catch (err) {
      showToast("Failed to copy link", "error");
    }
  };

  const handleEmailResults = () => {
    const subject = "Tail Spend Analysis - Potential Savings Identified";
    const industryData = industry ? INDUSTRY_ESTIMATES[industry] : null;
    const body = `
Tail Spend Analysis Results
Operating Expenses: $${operatingExpenses}M
Industry: ${industryData?.label || industry}
Estimated Tail Spend: $${calculations.tailSpend.toFixed(1)}M

Potential Annual Savings:
- Conservative (5-10%): $${calculations.scenarios.conservative.toFixed(1)}M
- Moderate (10-15%): $${calculations.scenarios.moderate.toFixed(1)}M
- Aggressive (15-20%): $${calculations.scenarios.aggressive.toFixed(1)}M

Top Opportunity Areas:
${industryData?.tailSpendAreas.slice(0, 3).join('\n') || ''}

View interactive calculator: ${window.location.href}
    `;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Focus trap for modal
  useEffect(() => {
    if (showAssessment && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement?.focus();

      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
        if (e.key === 'Escape') {
          setShowAssessment(false);
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [showAssessment]);

  // Handle slider keyboard navigation
  const handleSliderKeyDown = (e, value, setValue, min, max, step = 1) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setValue(Math.max(min, value - step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setValue(Math.min(max, value + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setValue(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      setValue(max);
    }
  };

  return (
    <div className="tail-spend-calculator">
      {/* Skip to Content Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`toast ${toast.type}`}
          role="alert"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}

      {/* Dark Mode Toggle */}
      <button
        className="dark-mode-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem',
          borderRadius: '50%',
          background: darkMode ? '#374151' : '#f3f4f6',
          border: '1px solid var(--border-color)',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '1.25rem'
        }}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Hero Section */}
      <section className="hero-section" aria-label="Introduction">
        <div className="container">
          <h1 className="hero-title">The Spend Your Board Will Eventually Ask About</h1>
          <p className="hero-subtitle">
            Model the impact before someone else finds it
          </p>
          
          {/* How It Works Button */}
          <button
            className="btn-ghost"
            onClick={() => setShowHowItWorks(true)}
            style={{
              marginBottom: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            aria-label="Learn how the calculator works"
          >
            <HelpCircle size={20} />
            How It Works
          </button>
          
          <div className="trust-signals">
            <div className="trust-item">
              <Check className="icon-check" />
              <span>2-minute analysis</span>
            </div>
            <div className="trust-item">
              <Check className="icon-check" />
              <span>Industry-specific</span>
            </div>
            <div className="trust-item">
              <Check className="icon-check" />
              <span>No signup required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Opportunity Insight */}
      {industry && counterStarted && (
        <section className="opportunity-insight">
          <div className="container">
            <div className="insight-card">
              <div className="insight-content">
                {!showResults ? (
                  <>
                    <div className="insight-label">For every hour that passes:</div>
                    <div className="insight-value negative">
                      You lose ${Math.round(perHourLoss).toLocaleString()} in opportunity cost
                    </div>
                    <div className="insight-context">
                      That's ${Math.round(perHourLoss * 24 * 30).toLocaleString()} every month of delay
                    </div>
                  </>
                ) : (
                  <>
                    <div className="insight-label">By taking action now:</div>
                    <div className="insight-value positive">
                      {catchUpTime ? `You'll recover losses in ${catchUpTime.value} ${catchUpTime.text}` : 'Immediate ROI potential'}
                    </div>
                    <div className="insight-context">
                      Then earn ${calculations.scenarios.moderate.toFixed(1)}M annually
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Primary Input Card */}
      <main id="main-content" role="main">
      <section className="input-section" aria-label="Calculator inputs">
        <div className="container">
          <div className="card input-card">
            <div className="card-content">
              <div className="form-group">
                <label className="form-label">
                  Annual Operating Expenses (excluding payroll/COGS)
                </label>
                <div className="slider-value">
                  ${sliderValue}M
                </div>
                <input
                  type="range"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  onKeyDown={(e) => handleSliderKeyDown(e, operatingExpenses, setOperatingExpenses, 10, 500, 5)}
                  min="10"
                  max="500"
                  step="5"
                  className="slider"
                  aria-label="Annual Operating Expenses in millions"
                  aria-valuemin="10"
                  aria-valuemax="500"
                  aria-valuenow={operatingExpenses}
                  aria-valuetext={`${operatingExpenses} million dollars`}
                />
                <div className="slider-labels">
                  <span>$10M</span>
                  <span>$500M</span>
                </div>
                <p className="helper-text">
                  All costs except payroll and direct materials
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Industry
                </label>
                <select 
                  value={industry} 
                  onChange={(e) => setIndustry(e.target.value)}
                  className="select-input"
                  aria-label="Select your industry"
                  aria-required="true"
                  aria-invalid={!industry}
                >
                  <option value="">Select your industry</option>
                  {INDUSTRY_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleGetEstimate}
                className="btn btn-primary btn-large"
                aria-label="Calculate tail spend savings"
              >
                Calculate Your Savings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <>
          <div 
            className="modal-backdrop" 
            onClick={() => setShowHowItWorks(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Escape' && setShowHowItWorks(false)}
            aria-label="Close modal"
          />
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="how-it-works-title">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h3 id="how-it-works-title">How the Calculator Works</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--positive)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔒 Your Data Stays Private
                  </p>
                </div>
                <button
                  className="btn-close"
                  onClick={() => setShowHowItWorks(false)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Privacy Guarantees */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--positive)' }}>
                    <ul style={{ margin: '0', paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.8 }}>
                      <li>No signup required</li>
                      <li>No data collected or stored</li>
                      <li>All calculations happen in your browser</li>
                      <li>Share results only if you choose to</li>
                    </ul>
                  </div>

                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '-0.5rem' }}>Three Simple Steps:</h4>

                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: darkMode ? 'rgba(99, 102, 241, 0.2)' : 'var(--navy)', 
                        color: darkMode ? '#818cf8' : 'white', 
                        fontSize: '0.875rem', 
                        fontWeight: 700 
                      }}>1</span>
                      Adjust the slider
                    </h4>
                    <p style={{ marginLeft: '1.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Set your annual operating expenses
                    </p>
                  </div>

                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: darkMode ? 'rgba(99, 102, 241, 0.2)' : 'var(--navy)', 
                        color: darkMode ? '#818cf8' : 'white', 
                        fontSize: '0.875rem', 
                        fontWeight: 700 
                      }}>2</span>
                      Select your industry
                    </h4>
                    <p style={{ marginLeft: '1.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      For accurate benchmarks
                    </p>
                  </div>

                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: darkMode ? 'rgba(99, 102, 241, 0.2)' : 'var(--navy)', 
                        color: darkMode ? '#818cf8' : 'white', 
                        fontSize: '0.875rem', 
                        fontWeight: 700 
                      }}>3</span>
                      Answer 3 questions (optional)
                    </h4>
                    <p style={{ marginLeft: '1.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      For personalized estimates
                    </p>
                  </div>

                  <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>Transparent Math:</h4>
                    <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      We calculate your tail spend opportunity using industry research from McKinsey, BCG, and NYU Stern, applying the 80/20 rule to identify your unmanaged spend.
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <button 
                      onClick={() => setShowHowItWorks(false)}
                      className="btn btn-primary"
                      style={{ minWidth: '200px' }}
                    >
                      Got It
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Maturity Assessment Modal - All Questions Visible */}
      {showAssessment && (
        <>
          <div 
            className="modal-backdrop" 
            onClick={() => setShowAssessment(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Escape' && setShowAssessment(false)}
            aria-label="Close modal"
          />
          <div className="modal modal-wide" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="assessment-title">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h3 id="assessment-title">Quick Maturity Check</h3>
                  <p className="modal-subtitle">Your answers help personalize savings estimates</p>
                </div>
                <button
                  className="btn-close"
                  onClick={() => setShowAssessment(false)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="maturity-questions">
                  {questions.map((question, index) => {
                    const key = index === 0 ? 'explainPurchases' : 
                               index === 1 ? 'consultantFindings' : 'procurementAutomated';
                    const currentValue = assessment[key];
                    
                    // Determine which answer is "good" for maturity
                    // Q1: YES is good (can explain purchases)
                    // Q2: NO is good (consultant won't find issues)
                    // Q3: NO is good (not using Excel)
                    const yesIsGood = index === 0;
                    const noIsGood = index > 0;
                    
                    return (
                      <div key={index} className="maturity-question-row">
                        <span className="question-text">{question}</span>
                        <div className="answer-buttons">
                          <button
                            onClick={() => {
                              setAssessment(prev => ({...prev, [key]: true}));
                            }}
                            className={`btn-answer ${
                              currentValue === true ? (yesIsGood ? 'btn-answer-good' : 'btn-answer-bad') : ''
                            }`}
                          >
                            <Check size={16} aria-hidden="true" />
                            Yes
                          </button>
                          <button
                            onClick={() => {
                              setAssessment(prev => ({...prev, [key]: false}));
                            }}
                            className={`btn-answer ${
                              currentValue === false ? (noIsGood ? 'btn-answer-good' : 'btn-answer-bad') : ''
                            }`}
                          >
                            <X size={16} aria-hidden="true" />
                            No
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="maturity-insight">
                  <Info size={16} />
                  <span>
                    {(() => {
                      const goodAnswers = 
                        (assessment.explainPurchases === true ? 1 : 0) +
                        (assessment.consultantFindings === false ? 1 : 0) +
                        (assessment.procurementAutomated === false ? 1 : 0);
                      return goodAnswers <= 1 
                        ? "Low maturity = Higher savings potential (10-20%)"
                        : "Higher maturity = Moderate savings potential (5-15%)";
                    })()}
                  </span>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  onClick={handleSkipAssessment}
                  className="btn btn-ghost"
                >
                  Skip & Use Defaults
                </button>
                <button
                  onClick={() => {
                    setShowAssessment(false);
                    setShowResults(true);
                    
                    // Track completion
                    const goodAnswers = 
                      (assessment.explainPurchases === true ? 1 : 0) +
                      (assessment.consultantFindings === false ? 1 : 0) +
                      (assessment.procurementAutomated === false ? 1 : 0);
                    trackEvent('calculation_completed', {
                      industry,
                      operatingExpenses,
                      maturityScore: goodAnswers,
                      tailSpend: calculations.tailSpend
                    });
                  }}
                  className="btn btn-primary"
                >
                  See My Results
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Results Section */}
      {showResults && (
        <section className="results-section">
          <div className="container">
            {/* Summary Banner */}
            <div className="card summary-card">
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-value">
                    ${calculations.operatingExpenses}M
                  </div>
                  <div className="summary-label">
                    Operating Expenses
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">
                    {industry ? INDUSTRY_ESTIMATES[industry]?.label : ''}
                  </div>
                  <div className="summary-label">
                    Industry
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-value with-tooltip">
                    ${calculations.indirectSpend.toFixed(1)}M
                    <Info size={14} className="info-hint" />
                    <div className="tooltip">
                      All purchases except payroll & COGS - {industry ? INDUSTRY_ESTIMATES[industry]?.indirectSpendRange : '15-25%'} of operating expenses in {industry ? INDUSTRY_ESTIMATES[industry]?.label : 'your industry'}
                    </div>
                  </div>
                  <div className="summary-label">
                    Est. Indirect Spend
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-value highlight with-tooltip">
                    ${calculations.tailSpend.toFixed(1)}M
                    <Info size={14} className="info-hint" />
                    <div className="tooltip">
                      The unmanaged 20% of spend value that creates 80% of your transactions - your hidden opportunity
                    </div>
                  </div>
                  <div className="summary-label">
                    Est. Tail Spend (20%)
                  </div>
                </div>
              </div>
            </div>

            {/* Methodology Explanation */}
            <div className="card methodology-card">
              <h4 className="methodology-title">
                <Info size={16} />
                Understanding Your Spend Breakdown
              </h4>
              <ul className="methodology-list">
                <li><strong>Indirect Spend (${calculations.indirectSpend.toFixed(1)}M):</strong> {industry ? (INDUSTRY_ESTIMATES[industry]?.indirectSpendRate * 100).toFixed(1) + '%' : '20%'} of operating expenses for {industry ? INDUSTRY_ESTIMATES[industry]?.label : 'your industry'}</li>
                <li><strong>Tail Spend (${calculations.tailSpend.toFixed(1)}M):</strong> 20% of indirect spend (80% of transactions)</li>
                <li><strong>Savings Range:</strong> {calculations.lowMaturity ? '10-20%' : '5-15%'} based on your maturity level</li>
                <li><strong>Source:</strong> Industry benchmarks validated by McKinsey & BCG</li>
              </ul>
              
              {/* Advanced Customization Toggle */}
              <button 
                className="btn btn-ghost"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{ marginTop: '1rem' }}
                aria-expanded={showAdvanced}
              >
                <span style={{ marginRight: '0.5rem' }}>{showAdvanced ? '▼' : '▶'}</span>
                Customize Savings Percentages
              </button>
              
              {showAdvanced && (
                <div className="advanced-options" style={{ marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
                    Adjust savings percentages based on your specific situation:
                  </p>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        Conservative ({customSavings.conservative ?? (calculations.lowMaturity ? 10 : 5)}%)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={customSavings.conservative ?? (calculations.lowMaturity ? 10 : 5)}
                        onChange={(e) => setCustomSavings(prev => ({...prev, conservative: parseInt(e.target.value)}))}
                        style={{ width: '100%' }}
                        aria-label="Conservative savings percentage"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        Moderate ({customSavings.moderate ?? (calculations.lowMaturity ? 15 : 10)}%)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={customSavings.moderate ?? (calculations.lowMaturity ? 15 : 10)}
                        onChange={(e) => setCustomSavings(prev => ({...prev, moderate: parseInt(e.target.value)}))}
                        style={{ width: '100%' }}
                        aria-label="Moderate savings percentage"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        Aggressive ({customSavings.aggressive ?? (calculations.lowMaturity ? 20 : 15)}%)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={customSavings.aggressive ?? (calculations.lowMaturity ? 20 : 15)}
                        onChange={(e) => setCustomSavings(prev => ({...prev, aggressive: parseInt(e.target.value)}))}
                        style={{ width: '100%' }}
                        aria-label="Aggressive savings percentage"
                      />
                    </div>
                    <button 
                      className="btn btn-ghost"
                      onClick={() => setCustomSavings({ conservative: null, moderate: null, aggressive: null })}
                      style={{ marginTop: '0.5rem' }}
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Low Maturity Alert */}
            {calculations.lowMaturity && showResults && (
              <div className="card alert-card">
                <div className="alert-content">
                  <span className="alert-icon">📈</span>
                  <div>
                    <h4 className="alert-title">
                      Higher Savings Potential Detected
                    </h4>
                    <p className="alert-text">
                      Based on your assessment, you have above-average opportunity
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Combined Scenarios & Sources Table */}
            <div className="card breakdown-card">
              <h3 className="card-title">Your Savings Scenarios & Sources</h3>
              <div className="table-container">
                <table className="scenarios-table">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Conservative<br/><span className="sub">{calculations.lowMaturity ? '10%' : '5%'} of tail spend</span></th>
                      <th>Moderate<br/><span className="sub">{calculations.lowMaturity ? '15%' : '10%'} of tail spend</span></th>
                      <th>Aggressive<br/><span className="sub">{calculations.lowMaturity ? '20%' : '15%'} of tail spend</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Supplier Consolidation (35%)</td>
                      <td>${(calculations.scenarios.conservative * 0.35).toFixed(1)}M</td>
                      <td>${(calculations.scenarios.moderate * 0.35).toFixed(1)}M</td>
                      <td>${(calculations.scenarios.aggressive * 0.35).toFixed(1)}M</td>
                    </tr>
                    <tr>
                      <td>Maverick Spend Control (25%)</td>
                      <td>${(calculations.scenarios.conservative * 0.25).toFixed(1)}M</td>
                      <td>${(calculations.scenarios.moderate * 0.25).toFixed(1)}M</td>
                      <td>${(calculations.scenarios.aggressive * 0.25).toFixed(1)}M</td>
                    </tr>
                    <tr>
                      <td>Contract Compliance (22%)</td>
                      <td>${(calculations.scenarios.conservative * 0.22).toFixed(1)}M</td>
                      <td>${(calculations.scenarios.moderate * 0.22).toFixed(1)}M</td>
                      <td>${(calculations.scenarios.aggressive * 0.22).toFixed(1)}M</td>
                    </tr>
                    <tr>
                      <td>Process Automation (18%)</td>
                      <td>${(calculations.scenarios.conservative * 0.18).toFixed(1)}M</td>
                      <td>${(calculations.scenarios.moderate * 0.18).toFixed(1)}M</td>
                      <td>${(calculations.scenarios.aggressive * 0.18).toFixed(1)}M</td>
                    </tr>
                    <tr className="total-row">
                      <td><strong>Total Annual Savings</strong></td>
                      <td className="total-conservative"><strong>${calculations.scenarios.conservative.toFixed(1)}M</strong></td>
                      <td className="total-moderate"><strong>${calculations.scenarios.moderate.toFixed(1)}M</strong></td>
                      <td className="total-aggressive"><strong>${calculations.scenarios.aggressive.toFixed(1)}M</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Common Areas */}
            <div className="card areas-card" data-industry={industry}>
              <h3 className="card-title">Where to find your ${calculations.scenarios.aggressive.toFixed(1)}M:</h3>
              <ul className="areas-list">
                {industry && INDUSTRY_ESTIMATES[industry]?.tailSpendAreas.map((area, index) => (
                  <li key={index} className="area-item">
                    <span className="area-bullet"></span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
              <p className="areas-action">
                Pull 6 months of transactions in these categories to identify consolidation opportunities
              </p>
              <p className="areas-note">
                Interactive modeling tool. Estimates based on industry benchmarks.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={() => window.open('https://calendly.com/insights-cfocharm/30min', '_blank')}
                className="btn btn-primary btn-large"
              >
                <Calendar size={20} />
                Schedule Discussion
              </button>
              <button
                onClick={handleEmailResults}
                className="btn btn-secondary"
              >
                <Mail size={16} />
                Email Results
              </button>
              <button
                onClick={handleCopyLink}
                className="btn btn-outline"
              >
                <Link2 size={16} />
                Copy Link
              </button>
            </div>
          </div>
        </section>
      )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-attribution">Based on NYU Stern research (Damodaran, 2024) and McKinsey benchmarks.</p>
          <p className="footer-copyright">&copy; 2025 CFOCharm - Executive Spend Intelligence</p>
        </div>
      </footer>
    </div>
  );
};

export default TailSpendCalculator;