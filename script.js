const apiKey = '8d82c8b3d8d24da5a95e1ae45ec89cfe';
const searchBtn = document.getElementById('searchBtn');
const recipeResults = document.getElementById('recipeResults');

searchBtn.addEventListener('click', searchRecipes);

function searchRecipes() {
  var ingredients = document.getElementById('ingredients').value;
  var url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
    ingredients
  )}&apiKey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayRecipes(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayRecipes(recipes) {
  recipeResults.innerHTML = '';

  if (recipes.length === 0) {
    recipeResults.innerHTML = 'No recipes found.';
    return;
  }

  recipes.forEach(recipe => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');

    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.title;

    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.image;

    recipeDiv.appendChild(recipeTitle);
    recipeDiv.appendChild(recipeImage);
    recipeResults.appendChild(recipeDiv);

    // Add event listener to each recipe  
    recipeDiv.addEventListener('click', () => {
      fetch(`https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.length === 0) {
            recipeResults.innerHTML = 'No instructions found for this recipe.';
            return;
          }

          const instructions = data[0].steps;

          if (instructions.length === 0) {
            recipeResults.innerHTML = 'No instructions found for this recipe.';
            return;
          }

          const instructionsContainer = document.createElement('div');
          instructionsContainer.classList.add('instructions-container');

          const title = document.createElement('h3');
          title.textContent = recipe.title;
          instructionsContainer.appendChild(title);

          const instructionsList = document.createElement('ol');
          instructionsList.classList.add('instructions-list');

          instructions.forEach(step => {
            const instructionItem = document.createElement('li');
            instructionItem.textContent = step.step;
            instructionsList.appendChild(instructionItem);
          });

          instructionsContainer.appendChild(instructionsList);

          recipeResults.innerHTML = '';
          recipeResults.appendChild(instructionsContainer);
        })
        .catch(error => {
          console.log('Error:', error);
        });
    });
  });
}
