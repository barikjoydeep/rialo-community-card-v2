"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

type Profile = {
  username: string;
  name: string;
  avatar: string;
  description?: string;
};

const ROLES = [
  {
    id: "club",
    name: "Rialo Club Member",
    icon: "✦",
    message: "You deserve it.",
    accent: "violet",
  },
  {
    id: "shark",
    name: "Rialo Shark Tank Winner",
    icon: "◆",
    message: "Oh, you are great.",
    accent: "gold",
  },
  {
    id: "builder",
    name: "Builder",
    icon: "⌘",
    message: "Keep building.",
    accent: "blue",
  },
  {
    id: "regional",
    name: "Regional Helper",
    icon: "◈",
    message: "You are making a difference.",
    accent: "green",
  },
  {
    id: "rialone",
    name: "RialOne",
    icon: "●",
    message: "Keep it up.",
    accent: "pink",
  },
  {
    id: "testnet",
    name: "Testnet Explorer",
    icon: "◇",
    message: "Keep exploring.",
    accent: "cyan",
  },
  {
    id: "og",
    name: "Community OG",
    icon: "★",
    message: "Respect the OG energy.",
    accent: "orange",
  },
  {
    id: "agent",
    name: "AI Agent Builder",
    icon: "◎",
    message: "Agents are getting smarter.",
    accent: "purple",
  },
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  const [cardUsername, setCardUsername] = useState("");
  const [cardName, setCardName] = useState("");

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  async function fetchProfile() {
    const cleanUsername = username.trim().replace(/^@/, "");

    if (!cleanUsername) {
      setError("Please enter your X username.");
      return;
    }

    setLoading(true);
    setError("");
    setGenerated(false);

    try {
      const response = await fetch(
        `/api/x-profile?username=${encodeURIComponent(cleanUsername)}`
      );

      if (!response.ok) {
        throw new Error("Profile could not be loaded.");
      }

      const data = await response.json();

      const fetchedUsername = data.username || cleanUsername;
      const fetchedName = data.name || cleanUsername;
      const fetchedAvatar =
        data.profile_image_url ||
        data.avatar ||
        `https://unavatar.io/x/${cleanUsername}`;

      setProfile({
        username: fetchedUsername,
        name: fetchedName,
        avatar: fetchedAvatar,
        description: data.description || "",
      });

      setCardUsername(fetchedUsername);
      setCardName(fetchedName);
    } catch {
      setError(
        "Could not load the X profile. Please check the username and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleRole(roleId: string) {
    setSelectedRoles((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId]
    );
  }

  function generateCard() {
    if (!profile) {
      setError("Please load your X profile first.");
      return;
    }

    if (!cardUsername.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (!cardName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (selectedRoles.length === 0) {
      setError("Please select at least one designation.");
      return;
    }

    setError("");
    setGenerated(true);

    setTimeout(() => {
      document
        .getElementById("identity-card")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  }

  async function downloadCard() {
    const card = document.getElementById("identity-card");

    if (!card) return;

    try {
      const canvas = await html2canvas(card, {
        backgroundColor: "#080910",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      const link = document.createElement("a");

      link.download = `rialo-fun-identity-card-${
        cardUsername || "member"
      }.png`;

      link.href = canvas.toDataURL("image/png");

      link.click();
    } catch {
      setError("Could not download the card. Please try again.");
    }
  }

  function shareOnX() {
    const roles = ROLES.filter((role) =>
      selectedRoles.includes(role.id)
    )
      .map((role) => role.name)
      .join(", ");

    const text =
      `I just created my Rialo FUN Identity Card.\n\n` +
      `Name: ${cardName}\n` +
      `Designation: ${roles}\n\n` +
      `Gifted From: KNIGHT RIALO`;

    const url =
      `https://twitter.com/intent/tweet?text=` +
      encodeURIComponent(text);

    window.open(url, "_blank", "noopener,noreferrer");
  }

  const selectedRoleObjects = ROLES.filter((role) =>
    selectedRoles.includes(role.id)
  );

  const primaryRole =
    selectedRoleObjects.length > 0
      ? selectedRoleObjects[0].name
      : "Community Member";

  return (
    <main className="site-shell">
      <div className="background-grid" />

      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* =========================
          HEADER
      ========================= */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">
            <img src="/rialo-logo.jpg" alt="Rialo" />
          </div>

          <div className="brand-text">
            <strong>RIALO</strong>
            <span>COMMUNITY</span>
          </div>
        </div>

        <div className="topbar-status">
          <span className="status-dot" />
          FUN IDENTITY SYSTEM
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <section className="hero">
        <div className="hero-kicker">
          <span />
          COMMUNITY IDENTITY
          <span />
        </div>

        <h1>
          Your Rialo
          <br />
          <span>Community Identity</span>
        </h1>

        <p>
          Create your own premium Rialo FUN Identity Card
          <br />
          based on your community role.
        </p>
      </section>

      {/* =========================
          BUILDER
      ========================= */}

      <section className="builder-layout">
        {/* =========================
            LEFT PANEL
        ========================= */}

        <div className="builder-panel">
          {/* X PROFILE */}

          <div className="panel-heading">
            <div>
              <span className="panel-number">01</span>

              <h2>Your X Profile</h2>
            </div>

            {profile && (
              <div className="profile-loaded">
                <span />
                PROFILE LOADED
              </div>
            )}
          </div>

          <div className="input-group">
            <label>X USERNAME</label>

            <div className="username-input">
              <span>@</span>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchProfile();
                  }
                }}
                placeholder="yourusername"
              />

              <button
                onClick={fetchProfile}
                disabled={loading}
              >
                {loading ? "LOADING..." : "LOAD PROFILE"}
              </button>
            </div>
          </div>

          {/* FETCHED PROFILE */}

          {profile && (
            <div className="profile-preview">
              <div className="profile-avatar">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  crossOrigin="anonymous"
                />
              </div>

              <div className="profile-info">
                <span>CONNECTED X PROFILE</span>

                <strong>{profile.name}</strong>

                <small>
                  @{profile.username}
                </small>
              </div>

              <div className="profile-check">
                ✓
              </div>
            </div>
          )}

          {/* =========================
              IDENTITY DETAILS
          ========================= */}

          {profile && (
            <div className="identity-details">
              <div className="identity-details-header">
                <div>
                  <span className="identity-details-number">
                    02
                  </span>

                  <div>
                    <h3>Identity Details</h3>

                    <p>
                      Customize the details shown on your card.
                    </p>
                  </div>
                </div>
              </div>

              <div className="identity-fields">
                <div className="identity-field">
                  <label>USERNAME</label>

                  <div className="identity-input">
                    <span>@</span>

                    <input
                      value={cardUsername}
                      onChange={(e) =>
                        setCardUsername(e.target.value)
                      }
                      placeholder="yourusername"
                    />
                  </div>
                </div>

                <div className="identity-field">
                  <label>YOUR NAME</label>

                  <input
                    className="name-input"
                    value={cardName}
                    onChange={(e) =>
                      setCardName(e.target.value)
                    }
                    placeholder="Your Name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================
              CHARACTER
          ========================= */}

          {profile && (
            <div className="character-preview-box">
              <div className="character-preview-header">
                <div>
                  <span className="character-number">
                    03
                  </span>

                  <div>
                    <h3>Your Community Character</h3>

                    <p>
                      Your X profile in a fun cartoon-style
                      presentation.
                    </p>
                  </div>
                </div>

                <span className="character-tag">
                  CHARACTER
                </span>
              </div>

              <div className="character-preview-content">
                <div className="cartoon-character">
                  <div className="cartoon-glow" />

                  <div className="cartoon-ring">
                    <div className="cartoon-image">
                      <img
                        src={profile.avatar}
                        alt={`${cardName || profile.name} character`}
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>

                  <div className="character-spark spark-one">
                    ✦
                  </div>

                  <div className="character-spark spark-two">
                    ✦
                  </div>

                  <div className="character-spark spark-three">
                    •
                  </div>
                </div>

                <div className="character-info">
                  <span>COMMUNITY CHARACTER</span>

                  <strong>
                    {cardName || profile.name}
                  </strong>

                  <small>
                    @{cardUsername || profile.username}
                  </small>

                  <div className="character-style">
                    <span />
                    CARTOON STYLE
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="section-divider" />

          {/* =========================
              ROLES
          ========================= */}

          <div className="panel-heading roles-heading">
            <div>
              <span className="panel-number">04</span>

              <h2>Select Your Designation</h2>
            </div>

            <span className="selection-count">
              {selectedRoles.length}/8
            </span>
          </div>

          <p className="role-note">
            Choose the community roles that represent you.
          </p>

          <div className="role-grid">
            {ROLES.map((role) => {
              const active = selectedRoles.includes(role.id);

              return (
                <button
                  key={role.id}
                  className={`role-card role-${role.accent} ${
                    active ? "active" : ""
                  }`}
                  onClick={() => toggleRole(role.id)}
                >
                  <div className="role-icon">
                    {role.icon}
                  </div>

                  <div className="role-content">
                    <strong>{role.name}</strong>

                    <span>{role.message}</span>
                  </div>

                  <div className="role-check">
                    {active ? "✓" : "+"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ERROR */}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* GENERATE */}

          <button
            className="generate-button"
            onClick={generateCard}
            disabled={
              !profile ||
              !cardUsername.trim() ||
              !cardName.trim() ||
              selectedRoles.length === 0
            }
          >
            <span>
              GENERATE IDENTITY CARD
            </span>

            <b>→</b>
          </button>
        </div>

        {/* =========================
            RIGHT PANEL
        ========================= */}

        <div className="preview-panel">
          <div className="preview-top">
            <span>LIVE PREVIEW</span>

            <span className="preview-line" />

            <span>RIALO / 001</span>
          </div>

          {!generated ? (
            <div className="empty-preview">
              <div className="empty-card-icon">
                <div className="empty-logo">
                  <img
                    src="/rialo-logo.jpg"
                    alt="Rialo"
                  />
                </div>
              </div>

              <h3>Your Identity Card</h3>

              <p>
                Load your X profile, customize your
                identity details, select your community
                designation and generate your card.
              </p>
            </div>
          ) : (
            <div className="card-stage">

              {/* =========================
                  IDENTITY CARD
              ========================= */}

              <div
                id="identity-card"
                className="identity-card"
              >
                <div className="card-noise" />

                <div className="card-orb card-orb-one" />

                <div className="card-orb card-orb-two" />

                {/* HEADER */}

                <div className="fun-card-header">
                  <div className="fun-card-brand">
                    <div className="fun-card-logo">
                      <img
                        src="/rialo-logo.jpg"
                        alt="Rialo"
                      />
                    </div>

                    <div>
                      <div className="fun-card-title">
                        Rialo FUN Identity Card
                      </div>

                      <div className="fun-card-subtitle">
                        COMMUNITY EDITION
                      </div>
                    </div>
                  </div>

                  <div className="fun-card-badge">
                    RIALO
                  </div>
                </div>

                {/* MAIN */}

                <div className="fun-card-main">
                  <div className="fun-card-details">
                    <div className="detail-label">
                      COMMUNITY MEMBER
                    </div>

                    <div className="detail-row">
                      <span>Name :-</span>

                      <strong>
                        {cardName}
                      </strong>
                    </div>

                    <div className="detail-row">
                      <span>
                        Designation :-
                      </span>

                      <strong>
                        {primaryRole}
                      </strong>
                    </div>

                    <div className="x-handle">
                      @{cardUsername}
                    </div>

                    <div className="designation-line" />

                    <div className="selected-role-mini">
                      {selectedRoleObjects.map(
                        (role) => (
                          <span
                            key={role.id}
                            className={`mini-role mini-${role.accent}`}
                          >
                            {role.icon}{" "}
                            {role.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* CHARACTER */}

                  <div className="fun-card-character">
                    <div className="character-aura" />

                    <div className="character-ring">
                      <div className="character-inner">
                        <img
                          src={profile.avatar}
                          alt={`${cardName} character`}
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>

                    <div className="character-label">
                      <span />
                      X CHARACTER
                    </div>
                  </div>
                </div>

                {/* DIVIDER */}

                <div className="card-divider">
                  <span />
                  <span />
                  <span />
                </div>

                {/* FOOTER */}

                <div className="fun-card-footer">
                  <div className="gifted-from">
                    <span>GIFTED FROM</span>

                    <strong>
                      KNIGHT RIALO
                    </strong>
                  </div>

                  <div className="fun-footer-mark">
                    <span>COMMUNITY</span>

                    <strong>RIALO</strong>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="card-actions">
                <button onClick={downloadCard}>
                  ↓ DOWNLOAD PNG
                </button>

                <button onClick={shareOnX}>
                  𝕏 SHARE ON X
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="site-footer">
        <span>
          RIALO COMMUNITY IDENTITY SYSTEM
        </span>

        <span>
          Created by{" "}
          <strong>@joydeepcontai</strong>
          {" · "}
          Knight-rialo
        </span>
      </footer>
    </main>
  );
}