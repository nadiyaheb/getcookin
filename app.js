$(document).ready(function(){

var fireb = new Firebase("https://getcookin.firebaseio.com");
var ingredients =[];
var recipeListArr = [];

var pantryListHtml = $('#ingreList').html();
var compiledTemplateList = Handlebars.compile(pantryListHtml);

var suggestedRecipesHtml = $('#recipeList').html();
var compiledRecipeTemplateList = Handlebars.compile(suggestedRecipesHtml);

var featuredRecipesHtml = $('#featuredRecipe').html();
var compliedFeatureRecipeTemplate = Handlebars.compile(featuredRecipesHtml);

var ingredientsListHtml = $('#featuredIngredientList').html();
var compliedIngredientsListTemplate = Handlebars.compile(ingredientsListHtml);


$("#addToPantry").submit(function(e){
	//Creates the user ingredient list based on the users input
	e.preventDefault();
	var $foodItem = $(this).find('input[name="foodItem"]');
	
	//Users input is saved to firebase database
	fireb.child("foodItem").push({
		name:$foodItem.val(),
		amount: 1,
	})	

	$foodItem.val("");
})

function getPantry(){
	//Creates the user ingredient list based on the contents grabbed from firebase that user inputs

	fireb.child("foodItem").on('value', function(results){
		$("#pantryList").empty();
		ingredients =[];
		var values = results.val();
		
		for(var key in values){

			var food = values[key];

			ingredients.push(food);
			
			var compliedHtml = compiledTemplateList({
				name: food.name,
				key: key
			})
			
			$("#pantryList").append(compliedHtml);
		}
			
		
	})
}

$('#pantryList').on("click", ".delete-btn",function(e){
	//removes the ingredient from the pantry list
	e.preventDefault;
	var food = $(this).data("id");
	removeFoodItem(food);
	console.log($(this));
})

$("#getRecipes").on("click", function(){
	
	// Creates search query and returns the results of the search
	var yumID = "85a16a2a";
	var yumKey = "4dce213045767f5ce8d95fd7bcf16500";
	var foodQuery = "requirePictures=true";
	var ingredientParam = "";
	$("#suggestedRecipes").empty();
	console.log(ingredients);

	ingredients.forEach(function(ingredient){
		var addToList = "allowedIngredient[]=" + ingredient.name +"&";

		ingredientParam += addToList;
	})


	var url = "http://api.yummly.com/v1/api/recipes?_app_id="+ yumID +"&_app_key="+ yumKey +"&" + ingredientParam + foodQuery + "&maxResult=10&start=20";
	
	$.ajax({
		url: url,
		method: "GET",
		dataType: "jsonp",
		success: function(response){

			var matches = response.matches;
			console.log(matches);
			matches.forEach(function(foo){

				var orginalImgUrl = foo.imageUrlsBySize[90];
				var imgUrl = orginalImgUrl.replace("=s90-c","=s480-c-e365");
				var totalCookTime = (foo.totalTimeInSeconds/60);

				var compliedRecipeHtml = compiledRecipeTemplateList({
					recipeName: foo.recipeName,
					imgUrl: imgUrl,
					id: foo.id,
					totalCookTime: totalCookTime

				})
				
				$("#suggestedRecipes").append(compliedRecipeHtml);
			})

		}
	})
})



$("#suggestedRecipes").on("click", ".recipeItem", function(e){
	//Gets the details of the selected recipe

	$("#mainRecipe").empty();
	$("#ingredientList").removeClass("hide");
	e.preventDefault();

	var yumID = "85a16a2a";
	var yumKey = "4dce213045767f5ce8d95fd7bcf16500";
	var recipeQuery = $(this).attr("id");
	

	var url = "http://api.yummly.com/v1/api/recipe/"+ recipeQuery +"?_app_id="+ yumID +"&_app_key="+ yumKey;

	$.ajax({
		url: url,
		method: "GET",
		dataType: "jsonp",
		success: function(response){
			var source = response.source;
			var recipeUrl = source.sourceRecipeUrl;
			var recipeSource = source.sourceDisplayName;
			var img = response.images;
			var serving = response.numberOfServings;
			var totalCookTime = (response.totalTimeInSeconds/60);
			var prepTime = (response.prepTimeInSeconds/60);
			var ingredientItem = [];
			var ingredientLines = response.ingredientLines;
			console.log(response);
			console.log(response.prepTime);
			$("#recipeIngredientList").empty();
			ingredientLines.forEach(function(item){

				ingredientItem.push(item);
				var ingredientItems = $("<li>" + item + "</li>")
			
			var compliedIngredientsHtml = compliedIngredientsListTemplate({
					item: ingredientItems.html()	
				})

			$("#recipeIngredientList").append(compliedIngredientsHtml);
			
			});

			console.log(img[0].hostedLargeUrl);
			var compliedFeatureRecipeHtml = compliedFeatureRecipeTemplate({
				recipeName: response.name,
				imgUrl: img[0].hostedLargeUrl,
				id: response.id,
				totalCookTime: totalCookTime,
				numberOfServings: response.numberOfServings,
				prepTime: prepTime,
				source: recipeSource,
				sourceUrl: recipeUrl

			})
	
			$("#mainRecipe").append(compliedFeatureRecipeHtml);
			$("#ingredientList").removeClass("hide");

			
		}
	})

	
})

	function removeFoodItem(foodKey){
		var ref = fireb.child("foodItem").child(foodKey);
			 ref.remove();
	}


getPantry();

})