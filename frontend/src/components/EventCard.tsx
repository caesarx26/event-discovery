import type { Event } from '#/lib/api';
import { Calendar, DollarSign, Users } from 'lucide-react';

export interface EventCardProps {
  event: Event;
  onBook?: (event: Event) => void;
  showBooking?: boolean;
}

export function EventCard({ event, onBook, showBooking = true }: EventCardProps) {
  const estimatedPrice = event.estimated_price || (event.price_min + event.price_max) / 2;
  const occupancyRate = ((200 - event.available) / 200) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>

      <div className="flex gap-2 mb-3">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {event.category.toUpperCase()}
        </span>
        {occupancyRate > 80 && (
          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            Limited ⚡
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>${estimatedPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{event.available} left</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${occupancyRate}%` }}
        ></div>
      </div>

      {showBooking && onBook && (
        <button
          onClick={() => onBook(event)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Book Now
        </button>
      )}

      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm mt-2 inline-block hover:underline"
      >
        View Details →
      </a>
    </div>
  );
}
