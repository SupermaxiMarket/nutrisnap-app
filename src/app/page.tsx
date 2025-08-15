"use client";

import { useState } from 'react';

interface AnalysisResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResult(null);
    setError(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse. Veuillez réessayer.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetState = () => {
    setLoading(false);
    setError(null);
    setResult(null);
    setImagePreview(null);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-green-400">NutriSnap</h1>
        <p className="text-xl text-gray-300 mt-2">
          Prenez une photo de votre repas et découvrez ses secrets nutritionnels.
        </p>
      </header>

      <main className="w-full max-w-md p-4 bg-gray-800 rounded-xl shadow-lg">
        {!result && !loading && !error && (
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center transition-all duration-300 hover:border-green-400 hover:bg-gray-700">
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <div className="bg-green-500 text-white rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Analyser une Photo</h2>
              <p className="text-gray-400">Cliquez ici pour commencer.</p>
            </label>
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        )}

        {loading && (
          <div className="text-center">
            <p className="text-xl mb-4">Analyse en cours...</p>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto"></div>
            {imagePreview && <img src={imagePreview} alt="Aperçu" className="mt-4 rounded-lg max-w-full h-auto" />}
          </div>
        )}

        {error && (
          <div className="text-center text-red-400">
            <h2 className="text-2xl font-bold mb-2">Erreur</h2>
            <p>{error}</p>
            <button onClick={resetState} className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
              Réessayer
            </button>
          </div>
        )}

        {result && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-green-400">{result.foodName}</h2>
            {imagePreview && <img src={imagePreview} alt="Aperçu de l'aliment" className="mb-4 rounded-lg max-w-full h-auto mx-auto" />}
            
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-lg">Calories</p>
              <p className="text-5xl font-bold">{result.calories} kcal</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-700 rounded-lg p-2">
                <p className="font-bold">Protéines</p>
                <p>{result.protein}g</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-2">
                <p className="font-bold">Glucides</p>
                <p>{result.carbs}g</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-2">
                <p className="font-bold">Lipides</p>
                <p>{result.fat}g</p>
              </div>
            </div>

            <button onClick={resetState} className="mt-6 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 w-full">
              Analyser une autre image
            </button>
          </div>
        )}
      </main>

      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Développé avec Gemini</p>
      </footer>
    </div>
  );
}
