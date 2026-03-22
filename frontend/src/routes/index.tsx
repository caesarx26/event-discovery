import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SearchForm } from '#/components/SearchForm';
import { Sparkles, Brain, Zap, FastForward } from 'lucide-react';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    // Navigate and let the results route handle the API call
    navigate({ to: '/results', search: { query, search_at: Date.now() } });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎟️</span>
            <h1 className="text-2xl font-bold text-gray-900">Event Discovery</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Brain className="w-4 h-4" />
            Multi-Agent AI
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {/* Main Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by Multi-Agent AI
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find &amp; Book Events
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              The Smart Way
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Describe what you're looking for. Our AI agents will search, filter, and recommend the perfect event for you.
          </p>

          {/* Search Form */}
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-8 my-16">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Planner Agent</h3>
            <p className="text-gray-600 text-sm">
              Breaks down your request into logical steps to find the perfect event.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Researcher Agent</h3>
            <p className="text-gray-600 text-sm">
              Searches and filters events using RAG technology for semantic matching.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FastForward className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Executor Agent</h3>
            <p className="text-gray-600 text-sm">
              Executes bookings and handles the purchase workflow seamlessly.
            </p>
          </div>
        </div>

        {/* Example Queries */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-12">
          <h3 className="text-2xl font-bold mb-4">Try These Queries</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Show me comedy shows under $100",
              "Find the cheapest music event available",
              "Book a theater show for this month",
              "What theater events are coming up?"
            ].map((query, i) => (
              <button
                key={i}
                onClick={() => {
                  setLoading(true);
                  handleSearch(query);
                }}
                className="text-left px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium"
              >
                "{query}"
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Multi-Agent?</h3>
          <div className="space-y-3">
            {[
              "✨ Understands natural language requests",
              "🔍 Semantic search with FAISS vector database",
              "💰 Smart pricing and availability filtering",
              "🎯 Intelligent recommendation system",
              "📊 Complete booking workflow",
              "🚀 Simulated but realistic purchases"
            ].map((feature, i) => (
              <p key={i} className="text-gray-700 flex items-center gap-3">
                {feature}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Built with React, TanStack Router, Tailwind CSS, and Python Flask</p>
          <p className="mt-2">Multi-Agent AI System for Event Discovery & Booking</p>
        </div>
      </footer>
    </main>
          >
            Router Guide
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            'Type-Safe Routing',
            'Routes and links stay in sync across every page.',
          ],
          [
            'Server Functions',
            'Call server code from your UI without creating API boilerplate.',
          ],
          [
            'Streaming by Default',
            'Ship progressively rendered responses for faster experiences.',
          ],
          [
            'Tailwind Native',
            'Design quickly with utility-first styling and reusable tokens.',
          ],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
              {title}
            </h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
          </article>
        ))}
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Quick Start</p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
          <li>
            Edit <code>src/routes/index.tsx</code> to customize the home page.
          </li>
          <li>
            Update <code>src/components/Header.tsx</code> and{' '}
            <code>src/components/Footer.tsx</code> for brand links.
          </li>
          <li>
            Add routes in <code>src/routes</code> and tweak visual tokens in{' '}
            <code>src/styles.css</code>.
          </li>
        </ul>
      </section>
    </main>
  )
}
