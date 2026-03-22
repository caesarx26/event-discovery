import { useState, useEffect } from 'react';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { SearchForm } from '#/components/SearchForm';
import { runAgentPipeline, bookTicket, AgentResponse, Event } from '#/lib/api';
import { EventCard } from '#/components/EventCard';
import { ExecutionResult } from '#/components/ExecutionResult';
import { WorkflowSteps } from '#/components/WorkflowSteps';
import { AlertCircle, Loader2 } from 'lucide-react';

function Results() {
  const search = useSearch({ from: '/results' }) as any;
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  // Auto-search when query is provided via URL search params
  useEffect(() => {
    if (search?.query && !result) {
      handleSearch(search.query);
    }
  }, [search?.query]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setBooked(false);

    try {
      const response = await runAgentPipeline(query, false);
      setResult(response);

      if (!response.research.success) {
        setError('No events found matching your criteria.');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = async (event: Event) => {
    setLoading(true);
    setError(null);

    try {
      await bookTicket(event.id, 1, 'Guest');
      setBooked(true);

      // Update result to show booking confirmation
      if (result) {
        const updated = { ...result };
        updated.execution.booking = {
          success: true,
          booking_id: 'CONF-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          confirmation_number: 'CONF-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        };
        setResult(updated);
      }
    } catch (err) {
      setError(`Booking error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">🎟️ Event Discovery</h1>
            <p className="text-gray-600">Multi-Agent Ticket Discovery & Booking System</p>
          </div>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Running agent pipeline...</p>
            <p className="text-sm text-gray-500 mt-2">Planning → Research → Execution</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6">
            {/* Workflow Steps */}
            <WorkflowSteps result={result} />

            {/* Execution Result */}
            <ExecutionResult result={result} onBookEvent={handleBookEvent} />

            {/* Other Discovered Events */}
            {result.research.discovered_events.length > 1 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Other Matching Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.research.discovered_events.slice(1).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onBook={handleBookEvent}
                      showBooking={!booked}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Booking Confirmation Message */}
            {booked && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 text-center">
                <p className="text-lg font-bold text-green-900 mb-2">🎉 Booking Confirmed!</p>
                <p className="text-green-800">
                  Your tickets are reserved. Check your email for confirmation details.
                </p>
              </div>
            )}
          </div>
        )}

        {!result && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Enter a query above to discover and book events
            </p>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Try: "Find me a comedy show", "Book a cheap music event", "Theater shows under $50"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/results')({
  component: Results,
});
