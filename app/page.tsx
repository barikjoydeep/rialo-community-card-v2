"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

type Role = {
  id: string;
  name: string;
  message: string;
  icon: string;
  accent: string;
};

type Profile = {
  username: string;
  name: string;
  avatar: string;
  description?: string;
};

const ROLES: Role[] = [
  {
    id: "club",
    name: "Rialo Club Member",
    message: "You deserve it.",
    icon: "✦",
    accent: "violet",
  },
  {
    id: "shark",
    name: "Rialo Shark Tank Winner",
    message: "Oh, you are great.",
    icon: "◈",
    accent: "gold",
  },
  {
    id: "builder",
    name: "Builder",
    message: "Keep building.",
    icon: "⌘",
    accent: "blue",
  },
  {
    id: "regional",
    name: "Regional Helper",
    message: "You are making a difference.",
    icon: "◎",
    accent: "green",
  },
  {
    id: "rialone",
    name: "RialOne",
    message: "Keep it up.",
    icon: "◆",
    accent: "pink",
  },
  {
    id: "testnet",
    name: "Testnet Explorer",
    message: "Keep exploring.",
    icon: "↗",
    accent: "cyan",
  },
  {
    id: "og",
    name: "Community OG",
    message: "Respect the OG energy.",
    icon: "★",
    accent: "orange",
  },
  {
    id: "agent",
    name: "AI Agent Builder",
    message: "Agents are getting smarter.",
    icon: "⌬",
    accent: "purple",
  },
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  async function fetchProfile() {
    const clean = username.trim().replace(/^@/, "");

    if (!clean) {
      setError("Enter your X / Twitter username first.");
      return;
    }

    setLoading(true);
    setError("");
    setGenerated(false);

    try {
      const response = await fetch(
        `/api/x-profile?username=${encodeURIComponent(clean)}`
      );

      const data = await response.json();

      if (!response.ok || !data.avatar) {
        throw new Error(data.error || "Profile not found");
      }

      setProfile({
        username: data.username || clean,
        name: data.name || clean,
        avatar: data.avatar,
        description: data.description || "",
      });
    } catch (error) {
      console.error(error);
      setProfile(null);
      setError("Could not load this X profile.");
    } finally {
      setLoading(false);
    }
  }

  function toggleRole(id: string) {
    setSelectedRoles((current) =>
      current.includes(id)
        ? current.filter((role) => role !== id)
        : [...current, id]
    );
  }

  function generateCard() {
    if (!profile) {
      setError("Connect your X profile first.");
      return;
    }

    if (!selectedRoles.length) {
      setError("Select at least one community role.");
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
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#08080d",
      });

      const link = document.createElement("a");

      link.download = `rialo-identity-${
        profile?.username || "card"
      }.png`;

      link.href = canvas.toDataURL("image/png");

      link.click();
    } catch (error) {
      console.error(error);
      setError("Could not download the card.");
    }
  }

  function shareOnX() {
    if (!profile) return;

    const roles = ROLES.filter((role) =>
      selectedRoles.includes(role.id)
    )
      .map((role) => role.name)
      .join(", ");

    const text =
      `I just created my Rialo Community Identity Card.\n\n` +
      `My Rialo roles: ${roles}\n\n` +
      `Building, exploring and contributing with the Rialo community.`;

    const url =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(text);

    window.open(url, "_blank", "noopener,noreferrer");
  }

  const selectedRoleObjects = ROLES.filter((role) =>
    selectedRoles.includes(role.id)
  );

  return (
    <main className="site-shell">
      <div className="background-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      {/* HEADER */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">
            <img src="/rialo-logo.jpg" alt="Rialo" />
          </div>

          <div>
            <div className="brand-name">RIALO</div>
            <div className="brand-subtitle">
              COMMUNITY IDENTITY
            </div>
          </div>
        </div>

        <div className="community-pill">
          <span />
          COMMUNITY PROJECT
        </div>
      </header>

      {/* HERO */}

      <section className="hero">
        <div className="hero-pill">
          <span>✦</span>
          BUILD YOUR RIALO IDENTITY
        </div>

        <h1>
          Your community.
          <br />
          <span>Your identity.</span>
        </h1>

        <p>
          Turn your Rialo community journey into a unique
          identity card.
        </p>
      </section>

      {/* PROFILE */}

      <section className="builder-section">
        <div className="section-heading">
          <div>
            <div className="section-number">
              01 / PROFILE
            </div>

            <h2>Connect your X profile</h2>

            <p>
              Your public X profile picture will become the
              centerpiece of your identity card.
            </p>
          </div>

          {profile && (
            <div className="connected-badge">
              <span />
              CONNECTED
            </div>
          )}
        </div>

        <div className="profile-panel">
          <div className="profile-input">
            <label>X / TWITTER USERNAME</label>

            <div className="input-line">
              <div className="username-box">
                <span>@</span>

                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchProfile();
                    }
                  }}
                  placeholder="yourusername"
                />
              </div>

              <button
                className="fetch-button"
                onClick={fetchProfile}
                disabled={loading}
              >
                {loading ? "LOADING..." : "FETCH PROFILE"}
                <span>↗</span>
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="security-note">
              <span>⌁</span>
              Only your public X profile is used.
            </div>
          </div>

          <div className="profile-preview">
            {profile ? (
              <div className="preview-user">
                <div className="preview-avatar-glow">
                  <div className="preview-avatar-ring">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                <div className="preview-user-info">
                  <small>
                    <span />
                    X PROFILE FOUND
                  </small>

                  <h3>{profile.name}</h3>

                  <p>@{profile.username}</p>
                </div>

                <div className="profile-check">
                  ✓
                </div>
              </div>
            ) : (
              <div className="empty-preview">
                <div className="empty-x">𝕏</div>

                <div>
                  <strong>Profile preview</strong>
                  <span>
                    Your profile will appear here
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ROLES */}

      <section className="builder-section">
        <div className="section-heading">
          <div>
            <div className="section-number">
              02 / COMMUNITY ROLES
            </div>

            <h2>Choose your Rialo roles</h2>

            <p>
              Highlight the roles that represent your journey
              inside the Rialo community.
            </p>
          </div>

          <div className="role-counter">
            <strong>{selectedRoles.length}</strong>
            <span>ROLES SELECTED</span>
          </div>
        </div>

        <div className="roles-grid">
          {ROLES.map((role) => {
            const selected =
              selectedRoles.includes(role.id);

            return (
              <button
                key={role.id}
                className={`role-card role-${role.accent} ${
                  selected ? "role-selected" : ""
                }`}
                onClick={() => toggleRole(role.id)}
              >
                <div className="role-glow" />

                <div className="role-header">
                  <div className="role-icon">
                    {role.icon}
                  </div>

                  <div
                    className={`role-checkbox ${
                      selected ? "active" : ""
                    }`}
                  >
                    {selected && "✓"}
                  </div>
                </div>

                <div className="role-body">
                  <div className="role-tag">
                    RIALO ROLE
                  </div>

                  <h3>{role.name}</h3>

                  <p>{role.message}</p>
                </div>

                <div
                  className={`role-bottom ${
                    selected ? "selected-text" : ""
                  }`}
                >
                  {selected
                    ? "✓ SELECTED"
                    : "SELECT ROLE →"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="role-note">
          <span>✦</span>
          Select the community roles you identify with.
        </div>
      </section>

      {/* GENERATE */}

      <section className="generate-section">
        <div className="generate-box">
          <div>
            <div className="section-number">
              03 / CREATE
            </div>

            <h2>Make it yours.</h2>

            <p>
              Generate your premium Rialo Community Identity
              Card.
            </p>
          </div>

          <button
            className="generate-button"
            onClick={generateCard}
          >
            GENERATE MY RIALO CARD
            <span>↗</span>
          </button>
        </div>
      </section>

      {/* RESULT */}

      {generated && profile && (
        <section className="result-section">
          <div className="section-heading">
            <div>
              <div className="section-number">
                YOUR IDENTITY
              </div>

              <h2>Your Rialo identity card</h2>

              <p>
                This is your community identity.
              </p>
            </div>
          </div>

          <div className="identity-wrapper">
            <div
              id="identity-card"
              className="identity-card"
            >
              <div className="card-noise" />

              <div className="card-orb card-orb-one" />
              <div className="card-orb card-orb-two" />

              {/* CARD TOP */}

              <div className="card-top">
                <div className="card-brand">
                  <div className="card-logo">
                    <img
                      src="/rialo-logo.jpg"
                      alt="Rialo"
                    />
                  </div>

                  <div>
                    <strong>RIALO</strong>

                    <span>
                      COMMUNITY IDENTITY
                    </span>
                  </div>
                </div>

                <div className="card-id">
                  RIALO
                  <br />
                  IDENTITY
                </div>
              </div>

              {/* PROFILE */}

              <div className="card-profile">
                <div className="big-avatar">
                  <div className="avatar-glow" />

                  <div className="avatar-ring-outer">
                    <div className="avatar-ring-inner">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>

                  <div className="avatar-status">
                    ✓
                  </div>
                </div>

                <div className="card-user">
                  <div className="member-label">
                    <span />
                    RIALO COMMUNITY MEMBER
                  </div>

                  <h3>{profile.name}</h3>

                  <p>@{profile.username}</p>
                </div>
              </div>

              {/* ROLE AREA */}

              <div className="card-role-section">
                <div className="card-section-label">
                  <span />
                  COMMUNITY ROLES
                  <span />
                </div>

                <div className="card-role-grid">
                  {selectedRoleObjects.map((role) => (
                    <div
                      key={role.id}
                      className={`card-role card-role-${role.accent}`}
                    >
                      <div className="card-role-icon">
                        {role.icon}
                      </div>

                      <div className="card-role-info">
                        <strong>
                          {role.name}
                        </strong>

                        <span>
                          {role.message}
                        </span>
                      </div>

                      <div className="card-role-check">
                        ✓
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD FOOTER */}

              <div className="card-footer">
                <div className="creator">
                  <span>CREATED BY</span>
                  <strong>@joydeepcontai</strong>
                  <small>Knight-rialo</small>
                </div>

                <div className="card-footer-logo">
                  <img
                    src="/rialo-logo.jpg"
                    alt="Rialo"
                  />
                </div>

                <div className="card-mark">
                  <span>COMMUNITY</span>
                  <strong>RIALO</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="result-actions">
            <button
              className="download-button"
              onClick={downloadCard}
            >
              ↓ DOWNLOAD CARD
            </button>

            <button
              className="share-button"
              onClick={shareOnX}
            >
              𝕏 SHARE ON X
            </button>
          </div>
        </section>
      )}

      {/* FOOTER */}

      <footer className="footer">
        <div className="footer-brand">
          <img
            src="/rialo-logo.jpg"
            alt="Rialo"
          />

          <div>
            <strong>RIALO COMMUNITY</strong>
            <span>
              Built by the community, for the community.
            </span>
          </div>
        </div>

        <div>
          Created by{" "}
          <strong>@joydeepcontai</strong>
          {" "}· Knight-rialo
        </div>
      </footer>
    </main>
  );
}