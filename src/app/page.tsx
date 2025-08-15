export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-green-400">NutriSnap</h1>
        <p className="text-xl text-gray-300 mt-2">
          Prenez une photo de votre repas et découvrez ses secrets nutritionnels.
        </p>
      </header>

      <main className="w-full max-w-md">
        <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center transition-all duration-300 hover:border-green-400 hover:bg-gray-700">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <div className="bg-green-500 text-white rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Analyser une Photo</h2>
            <p className="text-gray-400">
              Cliquez ici pour utiliser votre appareil photo ou choisir une image.
            </p>
          </label>
          <input id="file-upload" type="file" accept="image/*" className="hidden" />
        </div>
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>Développé avec Gemini</p>
      </footer>
    </div>
  );
}
