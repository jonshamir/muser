module.exports = [
  {
    waveform: Array(16)
      .fill(null)
      .map((_, i) => Math.random() * 50 + 5),
    genres: [
      {
        title: "blues",
        color: "#1155cc",
        weight: 0.39,
      },
      {
        title: "jazz",
        color: "#0a5394",
        weight: 0.25,
      },

      {
        title: "classic rock",
        color: "#f1c232",
        weight: 0.17,
      },
      {
        title: "pop",
        color: "#b3c376",
        weight: 0.08,
      },
      {
        title: "electronic",
        color: "#990000",
        weight: 0.08,
      },
    ],
    color: "#7d678b",
  },
  {
    waveform: Array(16)
      .fill(null)
      .map((_, i) => Math.random() * 50 + 5),
    genres: [
      {
        title: "electronic",
        color: "#990000",
        weight: 0.43,
      },
      {
        title: "hip-hop",
        color: "#741b47",
        weight: 0.19,
      },
      {
        title: "indie",
        color: "#f1c232",
        weight: 0.15,
      },

      {
        title: "alternative",
        color: "#f1c232",
        weight: 0.14,
      },
      {
        title: "rock",
        color: "#f1c232",
        weight: 0.07,
      },
    ],
    color: "#b75920",
  },
  {
    waveform: Array(16)
      .fill(null)
      .map((_, i) => Math.random() * 50 + 5),
    genres: [
      {
        title: "folk",
        color: "#0a5394",
        weight: 0.61,
      },
      {
        title: "blues",
        color: "#1155cc",
        weight: 0.14,
      },
      {
        title: "country",
        color: "#b3c376",
        weight: 0.1,
      },
      {
        title: "classical",
        color: "#888888",
        weight: 0.08,
      },
      {
        title: "indie",
        color: "#f1c232",
        weight: 0.05,
      },
    ],
    color: "#456372",
  },
];
