import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        fontSize: 32,
        fontWeight: "bold",
        flexDirection: "column",
      }}
    >
      <svg
        width="108"
        height="126"
        viewBox="0 0 212 252"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradPurpleBlack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(70, 0, 255, 1)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 1)" />
          </linearGradient>
        </defs>
        <path
          d="M0.000488281 60.3815V75.3836H178.71V240.918H200.402V60.3815H0.000488281Z"
          fill="#000"
        />
        <path d="M168.896 83.1428H0V239.366H168.896V83.1428Z" fill="#000" />
        <path
          d="M74.8097 70.1716L51.3801 32.0061L90.219 43.508C95.2115 58.6437 86.1417 61.0888 74.8097 70.1716Z"
          fill="white"
        />
        <path
          d="M86.0758 0L96.3021 56.6962L27.2752 113.758L22.5277 155.824L2.44067 192.402L43.7104 251.659L126.975 245.405C111.967 225.879 103.825 201.932 103.816 177.29C103.84 148.267 115.138 120.391 135.32 99.5631C155.503 78.7353 182.985 66.5898 211.95 65.6972L86.0758 0ZM112.469 69.305C67.9028 108.161 85.9971 149.279 35.7672 162.289C28.4256 110.286 74.2968 96.9914 112.469 69.305Z"
          fill="white"
        />
      </svg>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0);}
            40% { transform: translateY(-12px);}
          }
        `}
      </style>
      <span>
        Carregando
        <span
          style={{
            display: "inline-block",
            animation: "bounce 1.4s infinite",
          }}
        >
          .
        </span>
        <span
          style={{
            display: "inline-block",
            animation: "bounce 1.4s infinite 0.2s",
          }}
        >
          .
        </span>
        <span
          style={{
            display: "inline-block",
            animation: "bounce 1.4s infinite 0.4s",
          }}
        >
          .
        </span>
      </span>
    </div>
  );
}