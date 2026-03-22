import type { Event, AgentResponse } from '#/lib/api';
import { CheckCircle, Zap } from 'lucide-react';

export interface ExecutionResultProps {
  result: AgentResponse;
  onBookEvent?: (event: Event) => void;
}

export function ExecutionResult({ result, onBookEvent }: ExecutionResultProps) {
  const { execution, research } = result;
  const selectedEvent = execution.selected_event;
  const booking = execution.booking;

  const estimatedPrice = selectedEvent.estimated_price || (selectedEvent.price_min + selectedEvent.price_max) / 2;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
      {/* Status */}
      <div className="flex items-center gap-3 mb-6">
        {booking && booking.success ? (
          <>
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Booking Confirmed! 🎉</h3>
              <p className="text-gray-600 text-sm">Confirmation: {booking.confirmation_number}</p>
            </div>
          </>
        ) : (
          <>
            <Zap className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Ready to Book</h3>
              <p className="text-gray-600 text-sm">One click away from your next event</p>
            </div>
          </>
        )}
      </div>

      {/* Selected Event */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <h4 className="font-bold text-lg text-gray-900 mb-2">{selectedEvent.title}</h4>
        <p className="text-gray-700 text-sm mb-3">{selectedEvent.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold text-gray-900">{selectedEvent.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Availability</p>
            <p className="font-semibold text-gray-900">{selectedEvent.available} tickets</p>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3">Price Breakdown</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Price</span>
            <span className="font-medium">${estimatedPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-medium">${(estimatedPrice * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${((estimatedPrice * 1.1) * 0.08).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-blue-600">${((estimatedPrice * 1.1) * 1.08).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Search Info */}
      {research.discovered_events.length > 0 && (
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <p className="text-sm text-gray-600">
            Found <strong>{research.discovered_events.length}</strong> matching events. This is the best option based on your criteria.
          </p>
        </div>
      )}

      {/* Action */}
      {!booking && onBookEvent && (
        <button
          onClick={() => onBookEvent(selectedEvent)}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
        >
          Complete Booking 🎟️
        </button>
      )}

      {booking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm font-medium">
            ✓ Your booking is confirmed. Check your email for details.
          </p>
        </div>
      )}
    </div>
  );
}
