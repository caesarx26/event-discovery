"""FAISS vector database for RAG-based event search."""

import faiss
import numpy as np
import json
from typing import List, Dict
import os

class FAISSIndex:
    """FAISS vector store for semantic search over events."""
    
    def __init__(self, index_path: str = "faiss_index.bin", dimension: int = 1536):
        self.index_path = index_path
        self.dimension = dimension
        self.index = None
        self.metadata = []
        self.id_map = {}
        
    def _get_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for texts.
        In production, use OpenAI embeddings or local models.
        For demo, using simple hash-based embeddings.
        """
        embeddings = []
        for text in texts:
            # Simple deterministic embedding based on text hash
            # In production: embedding = openai.Embedding.create(input=text)
            embedding = self._simple_embedding(text)
            embeddings.append(embedding)
        return np.array(embeddings, dtype=np.float32)
    
    def _simple_embedding(self, text: str) -> np.ndarray:
        """Generate simple deterministic embedding from text."""
        np.random.seed(hash(text) % (2**32))
        return np.random.randn(self.dimension).astype(np.float32)
    
    def add_events(self, events: List[Dict]):
        """Add events to FAISS index."""
        texts = [f"{e['title']} {e['description']} {e['category']}" for e in events]
        embeddings = self._get_embeddings(texts)
        
        if self.index is None:
            self.index = faiss.IndexFlatL2(self.dimension)
        
        self.index.add(embeddings)
        
        for i, event in enumerate(events):
            self.id_map[i] = event['id']
            self.metadata.append(event)
    
    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search for similar events."""
        if self.index is None or len(self.metadata) == 0:
            return []
        
        query_embedding = self._get_embeddings([query])[0]
        query_embedding = np.array([query_embedding], dtype=np.float32)
        
        distances, indices = self.index.search(query_embedding, min(top_k, len(self.metadata)))
        
        results = []
        for idx in indices[0]:
            if idx < len(self.metadata):
                results.append(self.metadata[idx])
        
        return results
    
    def save(self):
        """Save index to disk."""
        if self.index is not None:
            faiss.write_index(self.index, self.index_path)
            # Save metadata
            metadata_path = self.index_path.replace(".bin", "_metadata.json")
            with open(metadata_path, "w") as f:
                json.dump(self.metadata, f)
    
    def load(self):
        """Load index from disk."""
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            metadata_path = self.index_path.replace(".bin", "_metadata.json")
            if os.path.exists(metadata_path):
                with open(metadata_path, "r") as f:
                    self.metadata = json.load(f)


# Global FAISS instance
faiss_store = FAISSIndex()
