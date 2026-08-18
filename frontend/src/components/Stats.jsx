import { useState } from "react";

export default function Stats() {
  const stats = [
    {
      number: 25000,
      title: "Happy Students",
      icon: "👨‍🎓",
      color: "#0d6efd",
    },
    {
      number: 500,
      title: "Premium Courses",
      icon: "📚",
      color: "#198754",
    },
    {
      number: 10000,
      title: "Certificates",
      icon: "🎓",
      color: "#ffc107",
    },
    {
      number: 98,
      title: "Success Rate",
      icon: "🏆",
      color: "#dc3545",
    },
  ];

  // Starting values
  const [counts, setCounts] = useState(
    stats.map(() => 0)
  );

  // Which cards are already animated
  const [animated, setAnimated] = useState(
    stats.map(() => false)
  );

  const startCounter = (index) => {
    // Already completed అయితే malli animation run avvakudadhu
    if (animated[index]) return;

    const target = stats[index].number;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const currentValue = Math.floor(
        progress * target
      );

      setCounts((prev) => {
        const newCounts = [...prev];
        newCounts[index] = currentValue;
        return newCounts;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final value
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = target;
          return newCounts;
        });

        // Animation complete
        setAnimated((prev) => {
          const newAnimated = [...prev];
          newAnimated[index] = true;
          return newAnimated;
        });
      }
    };

    requestAnimationFrame(animate);
  };

  // Number formatting
  const formatNumber = (value, index) => {
    // Happy Students
    if (index === 0) {
      if (value === 0) return "0";

      if (value < 1000) {
        return `${value}`;
      }

      return `${Math.floor(value / 1000)}K+`;
    }

    // Premium Courses
    if (index === 1) {
      return `${value}+`;
    }

    // Certificates
    if (index === 2) {
      if (value === 0) return "0";

      if (value < 1000) {
        return `${value}`;
      }

      return `${Math.floor(value / 1000)}K+`;
    }

    // Success Rate
    if (index === 3) {
      return `${value}%`;
    }

    return value;
  };

  return (
    <section
      className="py-5"
      style={{
        background:
          "linear-gradient(135deg,#0d6efd,#6610f2)",
        color: "white",
      }}
    >
      <div className="container">
        <div className="row text-center">

          {stats.map((item, index) => (
            <div
              className="col-lg-3 col-md-6 mb-4"
              key={index}
              onMouseEnter={() => startCounter(index)}
              style={{
                cursor: "pointer",
              }}
            >
              <div className="p-4">

                {/* Icon */}
                <div
                  style={{
                    fontSize: "55px",
                  }}
                >
                  {item.icon}
                </div>

                {/* Counter */}
                <h1
                  className="fw-bold mt-3"
                  style={{
                    color: item.color,
                  }}
                >
                  {formatNumber(counts[index], index)}
                </h1>

                {/* Title */}
                <h5>
                  {item.title}
                </h5>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}