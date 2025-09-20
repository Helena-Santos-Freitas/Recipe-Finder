const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');
const recipeDetails = document.querySelector('.recipe-details');

form.addEventListener('submit', function(event) {
    event.preventDefault()
    const inputValue = event.target[0].value

    searchRecipes(inputValue)
})

async function searchRecipes(ingredient) {
    recipeList.innerHTML = '<p>Carregando Receitas...</p>';
    try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
    showRecipes(data.meals);
    } catch (error) {
        recipeList.innerHTML = '<p>Erro ao buscar receitas. Tente novamente.</p>';
    }
}

function showRecipes(recipes){
    recipeList.innerHTML = recipes.map(item =>
        `<div class="recipe-card" data-id="${item.idMeal}">
           <img src="${item.strMealThumb}" alt="${item.strMeal}">
           <h3>${item.strMeal}</h3>
           <div class="recipe-details-card"></div>
        </div>`
    ).join('');

    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', async function(e) {
            e.stopPropagation();
            const id = card.getAttribute('data-id');
            const detailsDiv = card.querySelector('.recipe-details-card');
            if(detailsDiv.innerHTML.trim() !== '') {
                detailsDiv.innerHTML = '';
                return;
            }
            detailsDiv.innerHTML = '<p>Carregando detalhes...</p>';
            const details = await getRecipesDetails(id);
            detailsDiv.innerHTML = details;
        });
    });
}

async function getRecipesDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const recipe = data.meals[0];
    let ingredients = '';

    for(let i = 1; i <=20; i++){
        if(recipe[`strIngredient${i}`]){
            ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`;
        } else {
            break;
        }
    }

    return `
        <div class="details-content">
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>Categoria: ${recipe.strCategory}</h3>
            <h3>Origem: ${recipe.strArea}</h3>
            <h3>Ingredientes:</h3>
            <ul>${ingredients}</ul>
            <h3>Instruções:</h3>
            <p>${recipe.strInstructions}</p>
            <p>Tags: ${recipe.strTags}</p>
            <p>Vídeo: <a href="${recipe.strYoutube}" target="_blank">Assista no YouTube</a></p>
        </div>
    `;
}

async function getRecipesDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.meals || !data.meals[0]) {
        return `<p>Detalhes não encontrados.</p>`;
    }

    const recipe = data.meals[0];
    let ingredients = '';

    for(let i = 1; i <=20; i++){
        if(recipe[`strIngredient${i}`]){
            ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`;
        } else {
            break;
        }
    }

    return `
        <div class="details-content">
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>Categoria: ${recipe.strCategory}</h3>
            <h3>Origem: ${recipe.strArea}</h3>
            <h3>Ingredientes:</h3>
            <ul>${ingredients}</ul>
            <h3>Instruções:</h3>
            <p>${recipe.strInstructions}</p>
            <p>Tags: ${recipe.strTags || 'Nenhuma'}</p>
            <p>Vídeo: <a href="${recipe.strYoutube}" target="_blank">Assista no YouTube</a></p>
        </div>
    `;
}