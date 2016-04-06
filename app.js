$(document).ready(function(){

var fireb = new Firebase("https://getcookin.firebaseio.com");
var ingredients =[];
var ingredientListHtml = $('#ingreList').html();
var compiledTemplateList = Handlebars.compile(ingredientListHtml);

$("#addToPantry").submit(function(e){
	e.preventDefault();
	var $foodItem = $(this).find('input[name="foodItem"]');
	//console.log($foodItem.val());

	fireb.child("foodItem").push({
		name:$foodItem.val(),
		amount: 1,

	})	

	$foodItem.val("");
})

function getPantry(){
	fireb.child("foodItem").on('value', function(results){
		$("#pantryInventory").empty();
		var values = results.val();
		
		for(var key in values){

			//console.log(values[key]);
			var food = values[key];

			ingredients.push(food);
			
			var compliedHtml = compiledTemplateList({
				name: food.name,
				key: key
			})
			
			$("#pantryInventory").append(compliedHtml);
		}
			
		
		// $("#pantryInventory li span").each(
		// 	function() { 
		// 		ingredientsArray.push($(el).text())
		// 	 }
		// )
	})
}

$('#pantryInventory').on("click", ".delete-btn",function(e){
	e.preventDefault;
	var food = $(this).data("id");
	removeFoodItem(food);
	console.log($(this));
})

$("#getRecipes").on("click", function(){
	var yumID = "85a16a2a";
	var yumKey = "4dce213045767f5ce8d95fd7bcf16500";
	var foodQuery = "requirePictures=true";
	var ingredientParam = "";

	console.log(ingredients);

	ingredients.forEach(function(ingredient){
		var addToList = "allowedIngredient[]=" + ingredient.name +"&";

		ingredientParam += addToList;
	})

	//console.log(ingredientParam);

	//foodQuery += ingredientParam;

	var url = "http://api.yummly.com/v1/api/recipes?_app_id="+ yumID +"&_app_key="+ yumKey +"&" + ingredientParam + foodQuery;
	
	$.ajax({
		url: url,
		method: "GET",
		dataType: "jsonp",
		success: function(response){
			console.log(url);
			console.log(response);
			var matches = response.matches;
			console.log(matches);
			matches.forEach(function(foo){

				var recipeName = foo.recipeName;
				console.log(recipeName);
				var imgUrl = foo.imageUrlsBySize[90];
				console.log("img url", imgUrl);
				var imgEl = $('<img src="' + imgUrl + '"/>');
				console.log(imgEl);
				var recipeListItem = $('<a class="recipe" href="#" id='+ foo.id +'><p>' + recipeName + "</p></a>").append(imgEl);
				$('#suggestedRecipes').append(recipeListItem);
			})
			
		}
	})
})

$("#suggestedRecipes").on("click", ".recipe", function(e){

	e.preventDefault();
	var yumID = "85a16a2a";
	var yumKey = "4dce213045767f5ce8d95fd7bcf16500";
	var recipeQuery = $(this).attr("id");
	//console.log(recipeQuery);

	var url = "http://api.yummly.com/v1/api/recipe/"+ recipeQuery +"?_app_id="+ yumID +"&_app_key="+ yumKey;

	$.ajax({
		url: url,
		method: "GET",
		dataType: "jsonp",
		success: function(response){
			var attribution = response.attribution;
			var img = response.images;
			//attribution.url;
			var imgEl = '<img src="' + img[0].hostedLargeUrl + '"/>';
			var mainRecipeEl = $('<a href="'+ attribution.url + '"> </a>');
			
			mainRecipeEl.append(imgEl);
			
			mainRecipeEl.appendTo("#mainRecipe");

			console.log(img[0].hostedLargeUrl);
			console.log(attribution.url);

		}
	})

	
})

	function removeFoodItem(food){
		var ref = fireb.child("foodItem").child(food);
		console.log(ref, food);

		ref.remove();
	}

getPantry();


})