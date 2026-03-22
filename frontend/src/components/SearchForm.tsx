import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

export interface SearchFormProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, loading = false }: SearchFormProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find me a comedy show under $100 and book it..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            disabled={loading}
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Search</span>
            </>
          )}
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Try: "Find a comedy show", "Book a cheap music event", "Theater shows under $50"
      </p>
    </form>
  );
}
