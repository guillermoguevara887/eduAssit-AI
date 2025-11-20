import { useState } from "react";
import "./App.css";
import StudentView from "./StudentView";

const STUDENTS = [
  { id: 1, name: "Ana López", grade: "4th grade", hasAI: true },
  { id: 2, name: "Carlos Martínez", grade: "5th grade", hasAI: false },
  { id: 3, name: "María García", grade: "4th grade", hasAI: false },
  { id: 4, name: "Jorge Pérez", grade: "6th grade", hasAI: false },
  { id: 5, name: "Luis Ramírez", grade: "3rd grade", hasAI: false },
  { id: 6, name: "Sofía Hernández", grade: "5th grade", hasAI: false },
];

function App() {
  const [screen, setScreen] = useState("landing"); // landing | dashboard | student
  const [tab, setTab] = useState("students"); // students | assignments | reports

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Panels inside student actions
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [showStudentReports, setShowStudentReports] = useState(false);

  // Class-level assignments tab
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isProcessingTask, setIsProcessingTask] = useState(false);
  const [taskGenerated, setTaskGenerated] = useState(false);
  const [taskSent, setTaskSent] = useState(false);

  // Personalized assignment for one student
  const [personalizedFileName, setPersonalizedFileName] = useState(null);
  const [isProcessingPersonalized, setIsProcessingPersonalized] =
    useState(false);
  const [personalizedGenerated, setPersonalizedGenerated] = useState(false);
  const [personalizedSent, setPersonalizedSent] = useState(false);

  // -------- Navigation --------

  const goHome = () => {
    setScreen("landing");
    setTab("students");
    setSelectedStudent(null);
    setShowRecommendations(false);
    setShowAssignPanel(false);
    setShowStudentReports(false);

    setUploadedFileName(null);
    setIsProcessingTask(false);
    setTaskGenerated(false);
    setTaskSent(false);

    setPersonalizedFileName(null);
    setIsProcessingPersonalized(false);
    setPersonalizedGenerated(false);
    setPersonalizedSent(false);
  };

  const handleRoleTeacher = () => {
    // Go directly to dashboard (no login)
    setScreen("dashboard");
  };

  const handleRoleStudent = () => {
    setScreen("student");
  };

  // -------- Students / AI panels --------

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);

    // Reset all student panels when changing student
    setShowRecommendations(false);
    setShowAssignPanel(false);
    setShowStudentReports(false);

    setPersonalizedFileName(null);
    setIsProcessingPersonalized(false);
    setPersonalizedGenerated(false);
    setPersonalizedSent(false);
  };

  const handleShowRecommendations = () => {
    if (!selectedStudent) return;
    // Show only recommendations, hide others
    setShowRecommendations(true);
    setShowAssignPanel(false);
    setShowStudentReports(false);
  };

  const handleShowAssignPanel = () => {
    if (!selectedStudent) return;
    // Show only assign panel, hide others
    setShowAssignPanel(true);
    setShowStudentReports(false);
    setShowRecommendations(false);

    // Reset personalized assignment state when reopening
    setPersonalizedFileName(null);
    setIsProcessingPersonalized(false);
    setPersonalizedGenerated(false);
    setPersonalizedSent(false);
  };

  const handleShowStudentReports = () => {
    if (!selectedStudent) return;
    // Show only reports panel, hide others
    setShowStudentReports(true);
    setShowAssignPanel(false);
    setShowRecommendations(false);
  };

  // -------- Assignments / AI from documents (class-level tab) --------

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setTaskGenerated(false);
    setTaskSent(false);
    setIsProcessingTask(true);

    // Simulate "AI processing"
    setTimeout(() => {
      setIsProcessingTask(false);
      setTaskGenerated(true);
    }, 1500);
  };

  const handleSendTask = () => {
    setTaskSent(true);
  };

  // -------- Personalized assignment for one student --------

  const handlePersonalizedFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPersonalizedFileName(file.name);
    setPersonalizedGenerated(false);
    setPersonalizedSent(false);
    setIsProcessingPersonalized(true);

    // Simulate AI processing only for this student
    setTimeout(() => {
      setIsProcessingPersonalized(false);
      setPersonalizedGenerated(true);
    }, 1500);
  };

  const handleSendPersonalized = () => {
    setPersonalizedSent(true);
  };

  // Small helper to render a bar in a mini chart
  const renderBar = (label, percent, color) => (
    <div key={label} style={{ marginBottom: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          marginBottom: "0.15rem",
        }}
      >
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div
        style={{
          background: "#e5e7eb",
          borderRadius: 999,
          height: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
          }}
        />
      </div>
    </div>
  );

  // --------- SCREENS ---------

  if (screen === "landing") {
    return (
      <div className="page">
        <h1>EduAssist · Demo</h1>
        <p>
          AI-assisted platform to support teachers and students with
          personalized learning.
        </p>

        <div className="card">
          <h2>How would you like to enter?</h2>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button onClick={handleRoleTeacher}>Enter as teacher</button>
            <button onClick={handleRoleStudent}>Enter as student</button>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
            In this demo we focus on the <b>teacher experience</b> and show how
            artificial intelligence can support decision making and inclusion.
          </p>
        </div>
      </div>
    );
  }

  if (screen === "student") {
    return <StudentView onBack={goHome} />;
  }

  if (screen === "dashboard") {
    return (
      <div className="page">
        {/* Dashboard header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h1>Teacher dashboard</h1>
            <p style={{ color: "#555", marginTop: 4 }}>
              Here the teacher uses AI to personalize learning and support
              diverse students.
            </p>
          </div>
          <button onClick={goHome}>Reset demo</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            onClick={() => setTab("students")}
            style={{
              background: tab === "students" ? "#16a34a" : "#e5e7eb",
              color: tab === "students" ? "white" : "black",
            }}
          >
            Students
          </button>
          <button
            onClick={() => setTab("assignments")}
            style={{
              background: tab === "assignments" ? "#16a34a" : "#e5e7eb",
              color: tab === "assignments" ? "white" : "black",
            }}
          >
            Assignments
          </button>
          <button
            onClick={() => setTab("reports")}
            style={{
              background: tab === "reports" ? "#16a34a" : "#e5e7eb",
              color: tab === "reports" ? "white" : "black",
            }}
          >
            Reports
          </button>
        </div>

        {/* Tab: Students */}
        {tab === "students" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* Students list */}
            <div className="card">
              <h2>Students</h2>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                The teacher selects a student to see options and AI-driven
                recommendations.
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {STUDENTS.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => handleSelectStudent(s)}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      padding: "0.6rem",
                      marginBottom: "0.5rem",
                      cursor: "pointer",
                      background:
                        selectedStudent?.id === s.id ? "#ecfdf3" : "white",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: "0.85rem", color: "#555" }}>
                        {s.grade}
                      </div>
                    </div>
                    {s.hasAI && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          background: "#22c55e",
                          color: "white",
                          padding: "0.2rem 0.5rem",
                          borderRadius: 999,
                        }}
                      >
                        AI active
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions for student */}
            <div className="card">
              <h2>Actions for the student</h2>
              {!selectedStudent ? (
                <p>Please select a student from the list.</p>
              ) : (
                <>
                  <p>
                    Selected student: <b>{selectedStudent.name}</b>
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <button onClick={handleShowAssignPanel}>
                      Assign personalized work (AI)
                    </button>
                    <button onClick={handleShowStudentReports}>
                      View reports & chart
                    </button>
                    <button onClick={handleShowRecommendations}>
                      AI recommendations for this student
                    </button>
                  </div>

                  {/* Personalized assignment panel */}
                  {showAssignPanel && (
                    <div style={{ marginTop: "1rem" }}>
                      <h3>
                        Personalized assignment for {selectedStudent.name}
                      </h3>
                      <p style={{ fontSize: "0.9rem", color: "#555" }}>
                        Upload a short document or exercise, and AI will suggest
                        a personalized assignment for this student.
                      </p>
                      <div className="upload-area">
                        <p>Select a file to simulate the process:</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handlePersonalizedFileChange}
                        />
                        {personalizedFileName && (
                          <p style={{ marginTop: "0.5rem" }}>
                            Selected file: <b>{personalizedFileName}</b>
                          </p>
                        )}
                      </div>

                      {isProcessingPersonalized && (
                        <p className="loading">
                          Generating personalized suggestions with AI...
                        </p>
                      )}

                      {personalizedGenerated && (
                        <div style={{ marginTop: "1rem" }}>
                          <p>
                            AI suggests the following tailored activities for{" "}
                            <b>{selectedStudent.name}</b>:
                          </p>
                          <ul>
                            <li>
                              Read a short visual summary of the topic and
                              highlight three key ideas.
                            </li>
                            <li>
                              Complete a set of 3 practice questions adapted to
                              the current difficulty level.
                            </li>
                            <li>
                              Record a short explanation (audio or video) of
                              the main concept in their own words.
                            </li>
                          </ul>
                          <p className="ai-text">
                            ✨ This illustrates how AI can transform teacher
                            input into personalized activities for one specific
                            learner.
                          </p>
                          <button onClick={handleSendPersonalized}>
                            Assign to this student
                          </button>
                          {personalizedSent && (
                            <p className="success">
                              ✅ Personalized assignment sent to{" "}
                              {selectedStudent.name} (simulated workflow).
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Student reports with mini chart */}
                  {showStudentReports && (
                    <div style={{ marginTop: "1rem" }}>
                      <h3>Progress report</h3>
                      <p className="ai-text">
                        Example of how AI can visualize this student's progress
                        and highlight key metrics.
                      </p>
                      <div style={{ marginTop: "0.75rem" }}>
                        {renderBar("Assignments completed", 78, "#22c55e")}
                        {renderBar("On-time submission", 88, "#4ade80")}
                        {renderBar("Concept mastery", 72, "#10b981")}
                      </div>
                      <p className="ai-text" style={{ marginTop: "0.75rem" }}>
                        ✨ In a full version, these metrics would be generated
                        from real classroom data and updated in real time.
                      </p>
                    </div>
                  )}

                  {/* AI recommendations */}
                  {showRecommendations && (
                    <div className="ai-recommendations">
                      {selectedStudent.hasAI ? (
                        <>
                          <div className="ai-recommendations-header">
                            <div>
                              <span className="ai-pill">AI coach</span>
                              <h3>AI-generated recommendations</h3>
                              <p className="ai-text">
                                Based on this student&apos;s learning pattern,
                                EduAssist suggests:
                              </p>
                            </div>
                            <div className="ai-icon">✨</div>
                          </div>

                          <ul className="ai-recommendations-list">
                            <li>
                              <div className="ai-bullet">✓</div>
                              <div className="ai-recommendation-content">
                                <div className="ai-recommendation-title">
                                  Visual & interactive learning
                                </div>
                                <div className="ai-recommendation-body">
                                  This student learns best with{" "}
                                  <b>interactive visual activities</b>. Reinforce
                                  concepts with images, diagrams, mind maps, and
                                  short videos.
                                </div>
                                <span className="ai-tag">Learning style</span>
                              </div>
                            </li>

                            <li>
                              <div className="ai-bullet">✓</div>
                              <div className="ai-recommendation-content">
                                <div className="ai-recommendation-title">
                                  Step-by-step explanations
                                </div>
                                <div className="ai-recommendation-body">
                                  Use{" "}
                                  <b>
                                    step-by-step explanations with concrete
                                    examples
                                  </b>{" "}
                                  to reduce cognitive load and support
                                  understanding of complex topics.
                                </div>
                                <span className="ai-tag">Scaffolding</span>
                              </div>
                            </li>

                            <li>
                              <div className="ai-bullet">✓</div>
                              <div className="ai-recommendation-content">
                                <div className="ai-recommendation-title">
                                  Micro-assignments with quick feedback
                                </div>
                                <div className="ai-recommendation-body">
                                  Send <b>short micro-assignments</b> that focus
                                  on one concept at a time, providing quick
                                  feedback to build confidence gradually.
                                </div>
                                <span className="ai-tag">Pacing</span>
                              </div>
                            </li>

                            <li>
                              <div className="ai-bullet">✓</div>
                              <div className="ai-recommendation-content">
                                <div className="ai-recommendation-title">
                                  Inclusive task versions
                                </div>
                                <div className="ai-recommendation-body">
                                  Offer <b>two versions of each task</b>{" "}
                                  (standard and adapted: more visual, more
                                  guided, or simplified) to support diverse and
                                  neurodivergent learners.
                                </div>
                                <span className="ai-tag">
                                  Inclusion & accessibility
                                </span>
                              </div>
                            </li>
                          </ul>

                          <p className="ai-text ai-footer">
                            ✨ This section illustrates how AI can act as a
                            pedagogical assistant, suggesting concrete
                            strategies for diverse learning needs.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="ai-recommendations-header">
                            <div>
                              <span className="ai-pill muted">Demo</span>
                              <h3>AI recommendations (demo)</h3>
                              <p className="ai-text">
                                In this demo, AI-generated recommendations are
                                currently activated only for <b>Ana López</b>.
                              </p>
                            </div>
                            <div className="ai-icon">💡</div>
                          </div>
                          <p className="ai-text ai-footer">
                            This allows us to showcase the core idea to the jury
                            without implementing the full production system yet.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab: Assignments (class-level) */}
        {/* Tab: Assignments (class-level) */}
        {tab === "assignments" && (
          <div className="card assignment-card">
            <div className="assignment-header">
              <div>
                <h2>Create an assignment from a document (AI)</h2>
                <p className="ai-text">
                  Turn any Word or PDF file into a ready-to-use assignment in three
                  simple steps.
                </p>
              </div>
              <span className="assignment-pill">Teacher workflow</span>
            </div>

            <div className="assignment-grid">
              {/* Left: steps and upload */}
              <div className="assignment-column">
                <div className="assignment-step">
                  <div className="assignment-step-number">1</div>
                  <div className="assignment-step-content">
                    <div className="assignment-step-title">Upload a document</div>
                    <div className="assignment-step-body">
                      Choose a <b>Word or PDF file</b> you already use in your class.
                      EduAssist will read it and extract the key ideas.
                    </div>
                  </div>
                </div>

                <div className="upload-area assignment-upload">
                  <p className="assignment-upload-title">
                    Select a file to simulate the process:
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  {uploadedFileName && (
                    <p className="assignment-file-name">
                      Selected file: <b>{uploadedFileName}</b>
                    </p>
                  )}
                </div>

                {isProcessingTask && (
                  <p className="loading" style={{ marginTop: "0.7rem" }}>
                    Processing assignment with AI based on the uploaded document…
                  </p>
                )}
              </div>

              {/* Right: what AI does */}
              <div className="assignment-column">
                <div className="assignment-step">
                  <div className="assignment-step-number">2</div>
                  <div className="assignment-step-content">
                    <div className="assignment-step-title">
                      AI designs the assignment
                    </div>
                    <div className="assignment-step-body">
                      EduAssist analyzes the text and creates questions that check{" "}
                      <b>understanding, key ideas, and critical thinking</b>.
                    </div>
                  </div>
                </div>

                <div className="assignment-step">
                  <div className="assignment-step-number">3</div>
                  <div className="assignment-step-content">
                    <div className="assignment-step-title">
                      You review and send to students
                    </div>
                    <div className="assignment-step-body">
                      You stay in control: you can quickly review the generated
                      assignment and send it with one click.
                    </div>
                  </div>
                </div>

                <div className="assignment-ai-box">
                  <h3>Example of AI-generated assignment</h3>
                  <ol>
                    <li>
                      Write a 5–7 sentence summary of the main topic of the text.
                    </li>
                    <li>
                      Identify three key ideas and explain why they are important.
                    </li>
                    <li>
                      Write two questions that came to your mind after reading the
                      document.
                    </li>
                  </ol>
                  <p className="ai-text" style={{ marginTop: "0.5rem" }}>
                    ✨ This example shows how AI can transform a document into a
                    structured assignment, saving preparation time while keeping quality.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom: send button once generated */}
            {taskGenerated && (
              <div className="assignment-footer">
                <button onClick={handleSendTask}>
                  Send assignment to students
                </button>
                {taskSent && (
                  <p className="success">
                    ✅ Assignment successfully sent to students (simulated workflow).
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Reports (class-level) */}
        {/* Tab: Reports (class-level) */}
        {tab === "reports" && (
          <div className="reports-grid">
            {/* Class overview */}
            <div className="card report-card">
              <div className="report-header">
                <div>
                  <h2>Class overview</h2>
                  <p className="ai-text">
                    Quick snapshot of how the class is doing this week.
                  </p>
                </div>
                <span className="report-pill">This week</span>
              </div>

              <div className="report-metrics">
                <div className="report-metric">
                  <div className="report-metric-label">Active students</div>
                  <div className="report-metric-value">25</div>
                  <div className="report-metric-note">
                    Students who logged in or submitted work.
                  </div>
                </div>

                <div className="report-metric">
                  <div className="report-metric-label">Assignments completed</div>
                  <div className="report-metric-value">82%</div>
                  <div className="report-metric-note">
                    Out of all assignments sent this week.
                  </div>
                </div>

                <div className="report-metric">
                  <div className="report-metric-label">Average score</div>
                  <div className="report-metric-value">7.9 / 10</div>
                  <div className="report-metric-note">
                    Class performance across all graded activities.
                  </div>
                </div>
              </div>

              <p className="ai-text report-footer">
                ✨ In the full version, these metrics would be calculated from real
                classroom data and updated automatically.
              </p>
            </div>

            {/* Alerts & insights */}
            <div className="card report-card">
              <div className="report-header">
                <div>
                  <h2>Alerts & insights (AI)</h2>
                  <p className="ai-text">
                    AI highlights what may need your attention as a teacher.
                  </p>
                </div>
                <span className="report-pill warning">Focus areas</span>
              </div>

              <ul className="report-alerts-list">
                <li>
                  <span className="report-alert-dot warning" />
                  <div className="report-alert-content">
                    <div className="report-alert-title">
                      3 students at risk of failing
                    </div>
                    <div className="report-alert-body">
                      If they miss the next assignment, their average may drop below the
                      passing grade. Consider sending a reminder or adapted task.
                    </div>
                  </div>
                </li>

                <li>
                  <span className="report-alert-dot topic" />
                  <div className="report-alert-content">
                    <div className="report-alert-title">Fractions need review</div>
                    <div className="report-alert-body">
                      The topic with the highest difficulty is <b>Fractions</b> with a{" "}
                      <b>45% error rate</b>. A short visual review could help many
                      students.
                    </div>
                  </div>
                </li>

                <li>
                  <span className="report-alert-dot info" />
                  <div className="report-alert-content">
                    <div className="report-alert-title">
                      Suggested next action from AI
                    </div>
                    <div className="report-alert-body">
                      Send an <b>interactive review activity</b> before the next test
                      and offer an adapted version for students who need extra support.
                    </div>
                  </div>
                </li>
              </ul>

              <p className="ai-text report-footer">
                ✨ The idea is that EduAssist works like an assistant, pointing out where
                to act first instead of making the teacher read complex tables.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default App;