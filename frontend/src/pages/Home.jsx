import Hero from "../components/Hero";
import FeaturedCourses from "../components/FeaturedCourses";
import Categories from "../components/Categories";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCourses />
      <Categories />
      <Features />
      <Footer />
    </>
  );
}