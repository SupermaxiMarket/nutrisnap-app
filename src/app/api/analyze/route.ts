import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!spoonacularApiKey || !googleApiKey) {
    return NextResponse.json({ error: 'API keys are not configured on the server.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const imageBuffer = Buffer.from(bytes);

    // 1. Analyze image with Google Vision REST API
    const googleUrl = `https://vision.googleapis.com/v1/images:annotate?key=${googleApiKey}`;
    const visionRequestBody = {
      requests: [
        {
          image: {
            content: imageBuffer.toString('base64'),
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 5,
            },
          ],
        },
      ],
    };

    const visionResponse = await fetch(googleUrl, {
      method: 'POST',
      body: JSON.stringify(visionRequestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const visionData = await visionResponse.json();
    
    const labels = visionData.responses[0]?.labelAnnotations;
    if (!labels || labels.length === 0 || !labels[0].description) {
      return NextResponse.json({ error: 'Could not identify the food in the image.' }, { status: 400 });
    }
    const foodName = labels[0].description;

    // 2. Get nutrition data from Spoonacular
    let spoonacularResponse = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${foodName}&number=1&apiKey=${spoonacularApiKey}`);
    let spoonacularData = await spoonacularResponse.json();

    if (!spoonacularData.results || spoonacularData.results.length === 0) {
        const secondGuess = labels[1]?.description;
        if (secondGuess) {
            spoonacularResponse = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${secondGuess}&number=1&apiKey=${spoonacularApiKey}`);
            spoonacularData = await spoonacularResponse.json();
            if (!spoonacularData.results || spoonacularData.results.length === 0) {
                 return NextResponse.json({ error: `Could not find nutrition data for \"${foodName}\" or \"${secondGuess}\".` }, { status: 404 });
            }
        } else {
            return NextResponse.json({ error: `Could not find nutrition data for \"${foodName}\".` }, { status: 404 });
        }
    }

    const foodId = spoonacularData.results[0].id;

    const nutritionUrl = `https://api.spoonacular.com/food/ingredients/${foodId}/information?amount=100&unit=grams&apiKey=${spoonacularApiKey}`;
    const nutritionResponse = await fetch(nutritionUrl);
    const nutritionData = await nutritionResponse.json();

    const nutrients = nutritionData.nutrition.nutrients;
    const calories = nutrients.find((n: any) => n.name === 'Calories')?.amount || 0;
    const protein = nutrients.find((n: any) => n.name === 'Protein')?.amount || 0;
    const carbs = nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0;
    const fat = nutrients.find((n: any) => n.name === 'Fat')?.amount || 0;

    const finalResult = {
      foodName: nutritionData.name.charAt(0).toUpperCase() + nutritionData.name.slice(1),
      calories: Math.round(calories),
      protein,
      carbs,
      fat,
    };

    return NextResponse.json(finalResult);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
