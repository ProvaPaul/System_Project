import { Button } from '@/components/ui/button';
import Contect from './_components/Contect';
import Link from 'next/link';
import { FaGithub } from "react-icons/fa";

export const metadata = {
  title: 'AI Mock Interview',
  description: 'Ace your next interview with AI-powered mock interviews',
};

async function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="w-full py-8 bg-gray-100 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <h1 className="text-3xl font-bold text-primary">AI Mock Interview</h1>
          <nav className="flex flex-col sm:flex-row flex-wrap items-center justify-between mt-4 md:mt-0 space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <iframe
                src="https://github.com/sponsors/modamaan/button"
                title="Sponsor modamaan on GitHub"
                height="32"
                width="114"
                className="border-0 rounded-lg"
                loading="lazy"
              />
            </div>

            <div>
              <Link
                href="https://github.com/modamaan/Ai-mock-Interview"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              >
                <FaGithub className="w-10 h-8" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
              <Link href="#features" className="text-lg text-gray-800 mx-2 md:mx-4">Features</Link>
              <Link href="#testimonials" className="text-lg text-gray-800 mx-2 md:mx-4">Testimonials</Link>
              <Link href="#contact" className="text-lg text-gray-800 mx-2 md:mx-4">Contact</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-r from-gray-900 to-gray-400 px-6 md:px-0">
        <h2 className="text-4xl md:text-5xl font-bold text-white">Ace Your Next Interview</h2>
        <p className="mt-4 text-lg md:text-xl text-white">Practice with AI-powered mock interviews and get personalized feedback</p>
        <div className="mt-6 flex flex-col md:flex-row">
          <Link
            href="/dashboard"
            className="px-6 py-3 mb-4 md:mb-0 md:mr-4 text-lg font-semibold bg-white !text-primary-600 rounded-lg shadow-lg hover:bg-gray-100"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="px-6 py-3 text-lg font-semibold border border-white rounded-lg hover:bg-white hover:text-black-600"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white px-6 md:px-0">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800">Features</h2>
          <p className="mt-4 text-lg text-gray-800">
            Our AI Mock Interview platform offers a range of powerful features:
          </p>
          <div className="flex flex-wrap justify-center mt-8">
            {[
              {
                title: "AI Mock Interviews",
                description: "Experience realistic interview scenarios with our advanced AI."
              },
              {
                title: "Instant Feedback",
                description: "Get instant, personalized feedback to improve your performance."
              },
              {
                title: "Comprehensive Reports",
                description: "Receive detailed reports highlighting your strengths and weaknesses."
              }
            ].map((feature, index) => (
              <div key={index} className="w-full md:w-1/3 px-4 py-8">
                <div className="bg-blue-100 rounded-lg p-6 shadow-md">
                  <h3 className="text-2xl font-semibold text-black-600">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50 px-6 md:px-0">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800">What Our Users Say</h2>
          <div className="flex flex-wrap justify-center mt-8">
            {[
              {
                quote: "The AI mock interviews were incredibly helpful. I felt much more confident going into my real interview.",
                author: "Alex Johnson"
              },
              {
                quote: "The feedback was spot on and helped me improve my answers. Highly recommend this service!",
                author: "Sarah Williams"
              }
            ].map((testimonial, index) => (
              <div key={index} className="w-full md:w-1/2 px-4 py-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-gray-600">"{testimonial.quote}"</p>
                  <h4 className="mt-4 text-lg font-semibold text-blue-600">- {testimonial.author}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white px-6 md:px-0">
        <Contect />
      </section>

      <footer className="py-8 bg-black text-white text-center mt-auto">
        <p>© {new Date().getFullYear()} AI Mock Interview. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Page;