export default function MobilePreviewPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A4030 0%, #1B6B4E 50%, #2D9B6E 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            margin: 0,
            fontFamily: "'Manrope', system-ui, sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          Nova Mobile
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#8ECFB0",
            margin: "8px 0 0",
            fontWeight: 500,
          }}
        >
          Aperçu de l&apos;application mobile
        </p>
      </div>

      {/* iPhone Frame */}
      <div
        style={{
          position: "relative",
          width: 393,
          height: 852,
          borderRadius: 44,
          background: "#1a1a1a",
          padding: 10,
          boxShadow:
            "0 50px 100px rgba(0,0,0,0.4), 0 0 0 2px #333, inset 0 0 0 2px #2a2a2a",
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 34,
            overflow: "hidden",
            background: "#000",
            position: "relative",
          }}
        >
          {/* Status Bar / Dynamic Island overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 54,
              background: "#F5FAF7",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                width: 126,
                height: 36,
                borderRadius: 20,
                background: "#1a1a1a",
                marginTop: 4,
              }}
            />
          </div>
          <iframe
            src="https://camp-regulatory-creation-synthesis.trycloudflare.com"
            style={{
              width: "100%",
              height: "calc(100% - 54px)",
              marginTop: 54,
              border: "none",
            }}
            title="Nova Mobile App"
          />
        </div>

        {/* Home Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 4,
            borderRadius: 2,
            background: "#555",
            zIndex: 10,
          }}
        />
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: 24,
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
          fontWeight: 500,
        }}
      >
        Démo — Version preview
      </p>
    </div>
  );
}
