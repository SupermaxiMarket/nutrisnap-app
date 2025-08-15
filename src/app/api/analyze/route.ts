import { NextResponse } from 'next/server';

// This is a mock API route. It simulates the analysis of an image.
export async function POST(request: Request) {
  // In a real application, you would process the image from the request body.
  // For now, we just simulate the process.

  // Simulate a network delay to make it feel real.
  await new Promise(resolve => setTimeout(resolve, 1500));

  // This is our fake analysis result.
  const mockAnalysis = {
    foodName: 'Banane (simulation)',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
  };

  // Send the simulated data back to the frontend.
  return NextResponse.json(mockAnalysis);
}
