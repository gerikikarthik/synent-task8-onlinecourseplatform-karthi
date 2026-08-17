import React, { useState } from "react";
import Hero from "../components/Hero";
import FeaturedCourses from "../components/FeaturedCourses";
import Categories from "../components/Categories";
import Features from "../components/Features";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Stats from "../components/Stats";
import Companies from "../components/Companies";
import Newsletter from "../components/Newsletter";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Categories />

      <FeaturedCourses searchQuery={searchQuery} />

      <Features />

      <Companies />

      <FAQ />

      <Stats />

      <Newsletter />

      <Footer />
    </div>
  );
}