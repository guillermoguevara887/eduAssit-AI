import { useState } from "react";

function StudentView({ onBack }) {
  // Tabs: dashboard vs profile
  const [selectedTab, setSelectedTab] = useState("dashboard"); // "dashboard" | "profile"

  // Mood selector
  const [mood, setMood] = useState(null);

  // Notification state
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [notificationOpened, setNotificationOpened] = useState(false);

  // Assignment flow for Solar System
  const [stage, setStage] = useState("home"); // "home" | "taskIntro" | "summary" | "activity"

  // Activity state
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [activityAbandoned, setActivityAbandoned] = useState(false);

  // Feedback after activity
  const [activityFeeling, setActivityFeeling] = useState(null);
  const [likesActivityType, setLikesActivityType] = useState(null);

  // ---- Simple "AI evaluation" demo logic ----
  const getDemoAIEvaluation = () => {
    // Very simple scoring logic, just for the demo
    let score = 0;

    if (activityCompleted) score += 40;
    if (activityAbandoned) score -= 20;

    if (activityFeeling === "Easy") score += 10;
    if (activityFeeling === "Just right") score += 20;
    if (activityFeeling === "A bit hard") score += 5;

    if (likesActivityType === "Yes") score += 20;
    if (likesActivityType === "No") score -= 10;

    // Basic classification
    let label = "Not enough data yet";
    let message =
      "We still need more completed activities to understand which formats work best for Ana.";

    if (score >= 50) {
      label = "Very good fit";
      message =
        "This type of activity seems to work very well for Ana. The AI would propose more tasks with a similar structure (summary + simple main-ideas activity).";
    } else if (score >= 25) {
      label = "Promising";
      message =
        "This activity format seems promising. With more data, the AI could fine-tune the level of difficulty and pacing.";
    } else if (score <= 0 && (activityAbandoned || likesActivityType === "No")) {
      label = "Needs adjustment";
      message =
        "Ana may need a different activity format (shorter tasks, more visual support, or different pacing). The AI would suggest alternative designs.";
    }

    return { label, message };
  };

  const handleOpenNotifications = () => {
    setNotificationOpened(true);
    setHasNewNotification(false);
  };

  const handleGoToTaskFromNotification = () => {
    setStage("taskIntro");
    setSelectedTab("dashboard");
    setNotificationOpened(false);
  };

  const handleStartAssignment = () => {
    setStage("summary");
  };

  const handleStartActivity = () => {
    setStage("activity");
    setActivityCompleted(false);
    setActivityAbandoned(false);
    setActivityFeeling(null);
    setLikesActivityType(null);
  };

  const handleFinishActivity = () => {
    setActivityCompleted(true);
    setActivityAbandoned(false);
  };

  const handleAbandonActivity = () => {
    setActivityAbandoned(true);
    setActivityCompleted(false);
  };

  return (
    <div className="page">
      <button onClick={onBack}>← Back</button>

      {/* Top bar with student name and notifications */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <h1>Student dashboard</h1>
          <p style={{ color: "#555", marginTop: 4 }}>
            Logged in as <b>Ana López</b> · 4th grade
          </p>
        </div>

        {/* Notifications icon */}
        <div
          onClick={handleOpenNotifications}
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: "999px",
            background: "#ecfdf3",
            border: "1px solid #bbf7d0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Notifications"
        >
          <span role="img" aria-hidden="true">
            🔔
          </span>
          {hasNewNotification && (
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 9,
                height: 9,
                borderRadius: "999px",
                background: "#f97316",
              }}
            />
          )}
        </div>
      </div>

      {/* Tabs for dashboard / profile */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={() => {
            setSelectedTab("dashboard");
            setStage("home");
          }}
          style={{
            background: selectedTab === "dashboard" ? "#16a34a" : "#e5e7eb",
            color: selectedTab === "dashboard" ? "white" : "black",
          }}
        >
          Tasks & mood
        </button>
        <button
          onClick={() => setSelectedTab("profile")}
          style={{
            background: selectedTab === "profile" ? "#16a34a" : "#e5e7eb",
            color: selectedTab === "profile" ? "white" : "black",
          }}
        >
          My profile
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {selectedTab === "dashboard" && (
        <>
          {/* Main dashboard layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            {/* Left column: mood + assignment flow */}
            <div className="card">
              <h2>How are you feeling right now?</h2>
              <p className="ai-text">
                Your answer helps EduAssist adapt the way it presents activities.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.75rem",
                }}
              >
                {["Calm", "A little anxious", "Excited", "Tired"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    style={{
                      background: mood === m ? "#16a34a" : "#e5e7eb",
                      color: mood === m ? "white" : "#111827",
                      boxShadow: "none",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {mood && (
                <p className="ai-text" style={{ marginTop: "0.75rem" }}>
                  ✨ Thanks for sharing. In a full version, EduAssist would use
                  this information to choose the most supportive activities for
                  you.
                </p>
              )}

              {/* Assignment flow based on stage */}
              {stage === "home" && (
                <div style={{ marginTop: "1.2rem" }}>
                  <h3>Today&apos;s tasks</h3>
                  <p className="ai-text">
                    You have <b>1 new personalized assignment</b> waiting.
                    Check your notifications or open it below.
                  </p>
                  <div
                    className="ai-recommendations"
                    style={{ marginTop: "0.75rem" }}
                  >
                    <div className="ai-recommendations-header">
                      <div>
                        <span className="ai-pill">New</span>
                        <h3>Personalized task: The Solar System</h3>
                        <p className="ai-text">
                          Your teacher sent you a special activity designed just
                          for you.
                        </p>
                      </div>
                      <div className="ai-icon">🪐</div>
                    </div>
                    <button type="button" onClick={() => setStage("taskIntro")}>
                      View assignment
                    </button>
                  </div>
                </div>
              )}

              {stage === "taskIntro" && (
                <div style={{ marginTop: "1.2rem" }}>
                  <h3>Personalized assignment: The Solar System</h3>
                  <p className="ai-text">
                    This assignment was adapted for you using AI, focusing on
                    clear steps and visual support.
                  </p>
                  <ul style={{ marginTop: "0.5rem" }}>
                    <li>• Topic: Planets and how they move around the Sun.</li>
                    <li>• Length: Short text + one main activity.</li>
                    <li>• Goal: Understand the main ideas in a simple way.</li>
                  </ul>
                  <button
                    type="button"
                    style={{ marginTop: "0.9rem" }}
                    onClick={handleStartAssignment}
                  >
                    Start assignment
                  </button>
                </div>
              )}

              {stage === "summary" && (
                <div style={{ marginTop: "1.2rem" }}>
                  <h3>Step 1 · Read or listen to the summary</h3>
                  <p className="ai-text">
                    You can read this short summary or listen to it if that
                    feels easier.
                  </p>

                  <div
                    className="card"
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      marginTop: "0.75rem",
                    }}
                  >
                    <p style={{ fontSize: "0.95rem", color: "#065f46" }}>
                      The Solar System is made of the Sun and all the objects
                      that move around it. The Sun is a star at the center, and
                      the planets travel around it in paths called orbits. Each
                      planet is different in size, color, and temperature. Some
                      planets, like Earth, have moons. There are also asteroids
                      and comets that move through space. The Solar System is
                      always moving, but gravity keeps everything together.
                    </p>
                  </div>

                  {/* Fake audio player UI */}
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.8rem",
                      border: "1px solid #d1fae5",
                      background: "#ecfdf3",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "none",
                      }}
                    >
                      ▶
                    </button>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 999,
                          background: "#e5e7eb",
                          overflow: "hidden",
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            width: "45%",
                            height: "100%",
                            borderRadius: 999,
                            background: "#22c55e",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#065f46",
                        }}
                      >
                        AI-generated audio summary (demo)
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: "1.2rem" }}>
                    <h3>Step 2 · Suggested activity</h3>
                    <p className="ai-text">
                      Your teacher suggests an activity about the{" "}
                      <b>main ideas</b> of the Solar System.
                    </p>
                    <button
                      type="button"
                      style={{ marginTop: "0.8rem" }}
                      onClick={handleStartActivity}
                    >
                      Start main ideas activity
                    </button>
                  </div>
                </div>
              )}

              {stage === "activity" && (
                <div style={{ marginTop: "1.2rem" }}>
                  <h3>Main ideas · Order the story of the Solar System</h3>
                  <div
                    style={{
                      marginTop: "0.6rem",
                      padding: "0.75rem",
                      borderRadius: "0.8rem",
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#111827",
                      }}
                    >
                      Imagine we are telling a short story about the Solar
                      System. Read the four ideas below and put them in order in
                      your mind from 1 to 4.
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "0.9rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.6rem 0.7rem",
                        borderRadius: "0.6rem",
                        background: "#fee2e2", // red-ish
                      }}
                    >
                      <b style={{ fontSize: "0.85rem" }}>Red card</b> · The Sun
                      is a star at the center of the Solar System.
                    </div>
                    <div
                      style={{
                        padding: "0.6rem 0.7rem",
                        borderRadius: "0.6rem",
                        background: "#dbeafe", // blue-ish
                      }}
                    >
                      <b style={{ fontSize: "0.85rem" }}>Blue card</b> · Planets
                      move around the Sun in paths called orbits.
                    </div>
                    <div
                      style={{
                        padding: "0.6rem 0.7rem",
                        borderRadius: "0.6rem",
                        background: "#fef9c3", // yellow-ish
                      }}
                    >
                      <b style={{ fontSize: "0.85rem" }}>Yellow card</b> · Each
                      planet is different in size, color, and temperature.
                    </div>
                    <div
                      style={{
                        padding: "0.6rem 0.7rem",
                        borderRadius: "0.6rem",
                        background: "#dcfce7", // green-ish
                      }}
                    >
                      <b style={{ fontSize: "0.85rem" }}>Green card</b> · The
                      Solar System also has moons, asteroids, and comets.
                    </div>
                  </div>

                  <p className="ai-text" style={{ marginTop: "0.75rem" }}>
                    👉 In a full interactive version, the student could drag and
                    drop these cards into the correct order. Here we only show
                    the structure of the activity.
                  </p>

                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleAbandonActivity}
                      style={{
                        background: "#e5e7eb",
                        color: "#111827",
                        boxShadow: "none",
                      }}
                    >
                      Leave activity
                    </button>
                    <button type="button" onClick={handleFinishActivity}>
                      Finish activity
                    </button>
                  </div>

                  {/* Results and feedback */}
                  {activityCompleted && (
                    <div
                      style={{
                        marginTop: "1.1rem",
                        borderRadius: "0.9rem",
                        border: "1px solid #bbf7d0",
                        background: "#f0fdf4",
                        padding: "0.8rem 0.9rem",
                      }}
                    >
                      <p className="success">
                        ✅ Well done! You completed this activity.
                      </p>
                      <p className="ai-text" style={{ marginTop: "0.4rem" }}>
                        Now we have a couple of short questions to understand
                        how this felt for you.
                      </p>

                      <div style={{ marginTop: "0.7rem" }}>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            marginBottom: "0.3rem",
                          }}
                        >
                          How did this activity feel?
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          {["Easy", "Just right", "A bit hard"].map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => setActivityFeeling(f)}
                              style={{
                                background:
                                  activityFeeling === f
                                    ? "#16a34a"
                                    : "#e5e7eb",
                                color:
                                  activityFeeling === f ? "white" : "#111827",
                                boxShadow: "none",
                              }}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: "0.8rem" }}>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            marginBottom: "0.3rem",
                          }}
                        >
                          Do you like this type of activity?
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setLikesActivityType("Yes")}
                            style={{
                              background:
                                likesActivityType === "Yes"
                                  ? "#16a34a"
                                  : "#e5e7eb",
                              color:
                                likesActivityType === "Yes"
                                  ? "white"
                                  : "#111827",
                              boxShadow: "none",
                            }}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setLikesActivityType("No")}
                            style={{
                              background:
                                likesActivityType === "No"
                                  ? "#16a34a"
                                  : "#e5e7eb",
                              color:
                                likesActivityType === "No"
                                  ? "white"
                                  : "#111827",
                              boxShadow: "none",
                            }}
                          >
                            Not really
                          </button>
                        </div>
                      </div>

                      {(activityFeeling || likesActivityType) && (
                        <p className="ai-text" style={{ marginTop: "0.75rem" }}>
                          ✨ In a full version, EduAssist would use your
                          responses and completion time to learn which formats
                          work best for you over time.
                        </p>
                      )}
                    </div>
                  )}

                  {activityAbandoned && (
                    <div
                      style={{
                        marginTop: "1.1rem",
                        borderRadius: "0.9rem",
                        border: "1px solid #fee2e2",
                        background: "#fef2f2",
                        padding: "0.8rem 0.9rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#b91c1c",
                          marginBottom: "0.3rem",
                        }}
                      >
                        You left this activity before finishing.
                      </p>
                      <p className="ai-text">
                        That&apos;s okay—sometimes we need a break. In a full
                        version, EduAssist would track interruptions like this
                        and suggest shorter or different activities next time.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right column: notifications + demo explanation */}
            <div className="card">
              <h2>Notifications & messages</h2>

              {notificationOpened ? (
                <div
                  style={{
                    marginTop: "0.8rem",
                    borderRadius: "0.8rem",
                    border: "1px solid #d1fae5",
                    background: "#f0fdf4",
                    padding: "0.75rem 0.9rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.9rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <b>New from your teacher:</b> You received a personalized
                    assignment about <b>the Solar System</b>.
                  </p>
                  <p className="ai-text">
                    This task was adapted using AI to support your learning
                    style.
                  </p>
                  <button
                    type="button"
                    style={{ marginTop: "0.7rem" }}
                    onClick={handleGoToTaskFromNotification}
                  >
                    Go to assignment
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: "0.8rem" }}>
                  <p className="ai-text">
                    You have {hasNewNotification ? "1 new" : "no new"}{" "}
                    notifications. Click the bell to see them.
                  </p>
                  {hasNewNotification && (
                    <p className="ai-text" style={{ marginTop: "0.4rem" }}>
                      Hint: there is a new personalized assignment waiting for
                      you.
                    </p>
                  )}
                </div>
              )}

              <div
                style={{
                  marginTop: "1.2rem",
                  paddingTop: "0.8rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>
                  What is AI doing here?
                </h3>
                <p className="ai-text">
                  This is a <b>demo version</b>. In a full system, EduAssist
                  could:
                </p>
                <ul
                  style={{
                    marginTop: "0.45rem",
                    paddingLeft: "1.1rem",
                    fontSize: "0.9rem",
                    color: "#065f46",
                  }}
                >
                  <li>Measure how long it takes to complete each activity.</li>
                  <li>
                    Track if activities are often completed or abandoned.
                  </li>
                  <li>
                    Use <b>machine learning</b> to estimate which combinations
                    of summary + activity work best for this student.
                  </li>
                </ul>
                <p className="ai-text" style={{ marginTop: "0.5rem" }}>
                  Over time, the system would learn the{" "}
                  <b>most supportive path</b> for a neurodivergent learner like
                  Ana.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* PROFILE TAB */}
      {selectedTab === "profile" && (
        <div className="card">
          <h2>My profile</h2>
          <p className="ai-text">
            Example of how a student could see their own learning preferences in
            a simple, positive way.
          </p>

          <div
            style={{
              marginTop: "0.9rem",
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <h3>Learning preferences (demo)</h3>
              <ul
                style={{
                  marginTop: "0.5rem",
                  paddingLeft: "1.1rem",
                  fontSize: "0.9rem",
                  color: "#065f46",
                }}
              >
                <li>Prefers visual explanations with simple language.</li>
                <li>Benefits from step-by-step instructions.</li>
                <li>Responds well to short activities with quick feedback.</li>
                <li>Sometimes needs extra time to finish tasks.</li>
              </ul>
              <p className="ai-text" style={{ marginTop: "0.6rem" }}>
                ✨ In a real system, these preferences would be learned over time
                from completed activities and teacher input.
              </p>
            </div>

            <div>
              <h3>Today&apos;s reflection (demo)</h3>
              <p className="ai-text">
                Mood selected:{" "}
                {mood ? <b>{mood}</b> : "No mood selected yet."}
              </p>
              {activityCompleted && (
                <p className="ai-text" style={{ marginTop: "0.3rem" }}>
                  Activity status: <b>Completed</b>
                </p>
              )}
              {activityAbandoned && (
                <p className="ai-text" style={{ marginTop: "0.3rem" }}>
                  Activity status: <b>Left before finishing</b>
                </p>
              )}
              {activityFeeling && (
                <p className="ai-text" style={{ marginTop: "0.3rem" }}>
                  Activity felt: <b>{activityFeeling}</b>
                </p>
              )}
              {likesActivityType && (
                <p className="ai-text" style={{ marginTop: "0.3rem" }}>
                  Likes this type of activity: <b>{likesActivityType}</b>
                </p>
              )}
            </div>
          </div>

          {/* AI evaluation block */}
          <div
            style={{
              marginTop: "1.2rem",
              paddingTop: "0.9rem",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>
              AI evaluation (demo)
            </h3>
            {(() => {
              const { label, message } = getDemoAIEvaluation();
              return (
                <div
                  className="ai-recommendations"
                  style={{ marginTop: "0.4rem" }}
                >
                  <div className="ai-recommendations-header">
                    <div>
                      <span className="ai-pill">AI analysis</span>
                      <h3 style={{ fontSize: "0.95rem" }}>{label}</h3>
                      <p className="ai-text">{message}</p>
                    </div>
                    <div className="ai-icon">📊</div>
                  </div>
                  <p className="ai-text ai-footer">
                    ✨ In a full system, this block would be powered by a machine
                    learning model trained on many students with similar
                    profiles.
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentView;
