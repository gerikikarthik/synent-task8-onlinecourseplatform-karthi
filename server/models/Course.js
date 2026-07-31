const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
    },

    category: {
      type: String,
      default: "Development",
    },

    instructor: {
      type: String,
      default: "CourseHub",
    },

    duration: {
      type: String,
      default: "10 Hours",
    },

    students: {
      type: Number,
      default: 100,
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    language: {
      type: String,
      default: "English",
    },

    certificate: {
      type: String,
      default: "Yes",
    },

    // Premium Full Course Video
    videoUrl: {
      type: String,
      default: "",
    },

    // Free Preview Video
    previewVideoUrl: {
      type: String,
      default: "",
    },

    // Premium Course
    isPremium: {
      type: Boolean,
      default: true,
    },

    // Discount %
    discount: {
      type: Number,
      default: 0,
    },

    // Notes PDF Link
    notesUrl: {
      type: String,
      default: "",
    },

    // Quiz Available
    quizEnabled: {
      type: Boolean,
      default: true,
    },

    whatYouLearn: [
      {
        type: String,
      },
    ],

    courseContent: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);